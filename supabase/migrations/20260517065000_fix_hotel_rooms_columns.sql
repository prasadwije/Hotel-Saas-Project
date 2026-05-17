-- Add missing columns to hotel_rooms
ALTER TABLE hotel_rooms ADD COLUMN IF NOT EXISTS gallery text[];
ALTER TABLE hotel_rooms ADD COLUMN IF NOT EXISTS amenities text[];

-- Recreate toggle booking engine RPC with proper array handling
CREATE OR REPLACE FUNCTION toggle_booking_engine(p_hotel_id uuid, p_enable boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_site_config jsonb;
    v_rooms jsonb;
    v_room record;
BEGIN
    SELECT site_config INTO v_site_config FROM hotels WHERE id = p_hotel_id;
    IF v_site_config IS NULL THEN RETURN; END IF;

    IF p_enable THEN
        v_rooms := v_site_config -> 'rooms';
        IF v_rooms IS NOT NULL AND jsonb_array_length(v_rooms) > 0 THEN
            FOR v_room IN SELECT * FROM jsonb_array_elements(v_rooms)
            LOOP
                INSERT INTO hotel_rooms (
                    hotel_id, name, description, price, image_url, gallery, features, amenities
                ) VALUES (
                    p_hotel_id,
                    v_room.value->>'name',
                    v_room.value->>'description',
                    NULLIF(regexp_replace(v_room.value->>'price', '[^0-9.]', '', 'g'), '')::numeric,
                    v_room.value->>'image',
                    (SELECT ARRAY(SELECT jsonb_array_elements_text(CASE WHEN (v_room.value->'gallery') IS NULL THEN '[]'::jsonb ELSE (v_room.value->'gallery') END))),
                    (SELECT ARRAY(SELECT jsonb_array_elements_text(CASE WHEN (v_room.value->'features') IS NULL THEN '[]'::jsonb ELSE (v_room.value->'features') END))),
                    (SELECT ARRAY(SELECT jsonb_array_elements_text(CASE WHEN (v_room.value->'amenities') IS NULL THEN '[]'::jsonb ELSE (v_room.value->'amenities') END)))
                ) ON CONFLICT (hotel_id, name) DO UPDATE SET
                    description = EXCLUDED.description,
                    price = EXCLUDED.price,
                    image_url = EXCLUDED.image_url,
                    gallery = EXCLUDED.gallery,
                    features = EXCLUDED.features,
                    amenities = EXCLUDED.amenities;
            END LOOP;
        END IF;

        UPDATE hotels SET site_config = site_config - 'rooms', is_booking_engine_enabled = true WHERE id = p_hotel_id;
    ELSE
        SELECT jsonb_agg(
            jsonb_build_object(
                'name', name,
                'price', CASE WHEN price IS NOT NULL THEN '€' || price::text ELSE '' END,
                'description', COALESCE(description, ''),
                'image', COALESCE(image_url, ''),
                'gallery', COALESCE(to_jsonb(gallery), '[]'::jsonb),
                'features', COALESCE(to_jsonb(features), '[]'::jsonb),
                'amenities', COALESCE(to_jsonb(amenities), '[]'::jsonb)
            )
        ) INTO v_rooms FROM hotel_rooms WHERE hotel_id = p_hotel_id;
        
        IF v_rooms IS NULL THEN v_rooms := '[]'::jsonb; END IF;

        UPDATE hotels SET site_config = jsonb_set(site_config, '{rooms}', v_rooms), is_booking_engine_enabled = false WHERE id = p_hotel_id;
    END IF;
END;
$$;

-- Update get_site_data RPC
CREATE OR REPLACE FUNCTION public.get_site_data(header_host text)
 RETURNS TABLE(id uuid, subdomain text, custom_domain text, is_admin_accessible boolean, status text, site_config jsonb)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _host text;
  _subdomain text;
  _hotel record;
  _rooms jsonb;
BEGIN
  _host := split_part(header_host, ':', 1);

  SELECT h.id, h.subdomain, h.custom_domain, h.is_admin_accessible, h.status, h.site_config, h.is_booking_engine_enabled
  INTO _hotel FROM public.hotels h WHERE h.custom_domain = _host LIMIT 1;

  IF _hotel.id IS NULL THEN
    _subdomain := split_part(_host, '.', 1);
    SELECT h.id, h.subdomain, h.custom_domain, h.is_admin_accessible, h.status, h.site_config, h.is_booking_engine_enabled
    INTO _hotel FROM public.hotels h WHERE h.subdomain = _subdomain LIMIT 1;
  END IF;

  IF _hotel.id IS NOT NULL THEN
    _hotel.site_config := jsonb_set(_hotel.site_config, '{isBookingEngineEnabled}', to_jsonb(COALESCE(_hotel.is_booking_engine_enabled, false)));

    IF _hotel.is_booking_engine_enabled THEN
        SELECT jsonb_agg(
            jsonb_build_object(
                'name', name,
                'price', CASE WHEN price IS NOT NULL THEN '€' || price::text ELSE '' END,
                'description', COALESCE(description, ''),
                'image', COALESCE(image_url, ''),
                'gallery', COALESCE(to_jsonb(gallery), '[]'::jsonb),
                'features', COALESCE(to_jsonb(features), '[]'::jsonb),
                'amenities', COALESCE(to_jsonb(amenities), '[]'::jsonb)
            )
        ) INTO _rooms FROM hotel_rooms WHERE hotel_id = _hotel.id;
        
        IF _rooms IS NULL THEN _rooms := '[]'::jsonb; END IF;
        _hotel.site_config := jsonb_set(_hotel.site_config, '{rooms}', _rooms);
    END IF;
    
    RETURN QUERY SELECT _hotel.id, _hotel.subdomain, _hotel.custom_domain, _hotel.is_admin_accessible, _hotel.status, _hotel.site_config;
  END IF;
END;
$function$;
