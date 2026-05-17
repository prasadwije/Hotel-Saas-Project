-- Rename tables
ALTER TABLE IF EXISTS bookings RENAME TO hotel_bookings;
ALTER TABLE IF EXISTS inquiries RENAME TO hotel_inquiries;
ALTER TABLE IF EXISTS packages RENAME TO hotel_packages;
ALTER TABLE IF EXISTS rooms RENAME TO hotel_rooms;

-- Ensure hotel_rooms has unique constraint on hotel_id and name for ON CONFLICT to work
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'hotel_rooms_hotel_id_name_key'
  ) THEN
    ALTER TABLE hotel_rooms ADD CONSTRAINT hotel_rooms_hotel_id_name_key UNIQUE (hotel_id, name);
  END IF;
END $$;

-- Create toggle booking engine RPC
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
    -- Get current config
    SELECT site_config INTO v_site_config
    FROM hotels
    WHERE id = p_hotel_id;
    
    IF v_site_config IS NULL THEN
        RETURN;
    END IF;

    IF p_enable THEN
        -- Engine is being turned ON. Move rooms FROM site_config TO hotel_rooms table.
        v_rooms := v_site_config -> 'rooms';
        
        -- Insert rooms if not empty
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
                    (v_room.value->>'gallery')::jsonb,
                    (v_room.value->>'features')::jsonb,
                    (v_room.value->>'amenities')::jsonb
                ) ON CONFLICT (hotel_id, name) DO UPDATE SET
                    description = EXCLUDED.description,
                    price = EXCLUDED.price,
                    image_url = EXCLUDED.image_url,
                    gallery = EXCLUDED.gallery,
                    features = EXCLUDED.features,
                    amenities = EXCLUDED.amenities;
            END LOOP;
        END IF;

        -- Remove rooms from site_config and set status
        UPDATE hotels 
        SET site_config = site_config - 'rooms',
            is_booking_engine_enabled = true
        WHERE id = p_hotel_id;

    ELSE
        -- Engine is being turned OFF. Move rooms FROM hotel_rooms table TO site_config.
        -- Construct the jsonb array from hotel_rooms
        SELECT jsonb_agg(
            jsonb_build_object(
                'name', name,
                'price', CASE WHEN price IS NOT NULL THEN price::text ELSE '' END,
                'description', COALESCE(description, ''),
                'image', COALESCE(image_url, ''),
                'gallery', COALESCE(gallery, '[]'::jsonb),
                'features', COALESCE(features, '[]'::jsonb),
                'amenities', COALESCE(amenities, '[]'::jsonb)
            )
        ) INTO v_rooms
        FROM hotel_rooms
        WHERE hotel_id = p_hotel_id;
        
        IF v_rooms IS NULL THEN
            v_rooms := '[]'::jsonb;
        END IF;

        -- Update site_config and status
        UPDATE hotels 
        SET site_config = jsonb_set(site_config, '{rooms}', v_rooms),
            is_booking_engine_enabled = false
        WHERE id = p_hotel_id;
        
        -- The prompt says: "koi welawakawath rooms table eke thiyena colums auto delete karanna epa"
        -- We will leave the rows in hotel_rooms intact.
    END IF;
END;
$$;
