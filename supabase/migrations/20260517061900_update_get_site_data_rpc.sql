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
  -- Normalize: strip port if present
  _host := split_part(header_host, ':', 1);

  -- 1. Try exact match on custom_domain
  SELECT h.id, h.subdomain, h.custom_domain, h.is_admin_accessible, h.status, h.site_config, h.is_booking_engine_enabled
  INTO _hotel
  FROM public.hotels h
  WHERE h.custom_domain = _host
  LIMIT 1;

  IF _hotel.id IS NULL THEN
    -- 2. Extract subdomain
    _subdomain := split_part(_host, '.', 1);

    SELECT h.id, h.subdomain, h.custom_domain, h.is_admin_accessible, h.status, h.site_config, h.is_booking_engine_enabled
    INTO _hotel
    FROM public.hotels h
    WHERE h.subdomain = _subdomain
    LIMIT 1;
  END IF;

  IF _hotel.id IS NOT NULL THEN
    -- Inject booking engine state to site_config
    _hotel.site_config := jsonb_set(_hotel.site_config, '{isBookingEngineEnabled}', to_jsonb(COALESCE(_hotel.is_booking_engine_enabled, false)));

    -- Merge rooms if booking engine is enabled
    IF _hotel.is_booking_engine_enabled THEN
        SELECT jsonb_agg(
            jsonb_build_object(
                'name', name,
                'price', CASE WHEN price IS NOT NULL THEN '€' || price::text ELSE '' END,
                'description', COALESCE(description, ''),
                'image', COALESCE(image_url, ''),
                'gallery', COALESCE(gallery, '[]'::jsonb),
                'features', COALESCE(features, '[]'::jsonb),
                'amenities', COALESCE(amenities, '[]'::jsonb)
            )
        ) INTO _rooms
        FROM hotel_rooms
        WHERE hotel_id = _hotel.id;
        
        IF _rooms IS NULL THEN
            _rooms := '[]'::jsonb;
        END IF;
        
        _hotel.site_config := jsonb_set(_hotel.site_config, '{rooms}', _rooms);
    END IF;
    
    RETURN QUERY SELECT _hotel.id, _hotel.subdomain, _hotel.custom_domain, _hotel.is_admin_accessible, _hotel.status, _hotel.site_config;
  END IF;
END;
$function$;
