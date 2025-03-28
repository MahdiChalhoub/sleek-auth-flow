
-- Create new RPC functions to safely interact with product_batches

-- Get product batches for a specific product
CREATE OR REPLACE FUNCTION get_product_batches(product_id_param UUID)
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'product_batches'
  ) THEN
    RETURN QUERY
      SELECT to_jsonb(pb.*) 
      FROM public.product_batches pb
      WHERE pb.product_id = product_id_param
      ORDER BY pb.expiry_date ASC;
  ELSE
    RETURN;
  END IF;
END;
$$;

-- Insert a new product batch safely
CREATE OR REPLACE FUNCTION insert_product_batch(batch JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'product_batches'
  ) THEN
    INSERT INTO public.product_batches (
      product_id,
      batch_number,
      quantity,
      expiry_date,
      created_at,
      updated_at
    ) VALUES (
      (batch->>'product_id')::UUID,
      batch->>'batch_number',
      (batch->>'quantity')::INTEGER,
      (batch->>'expiry_date')::TIMESTAMP WITH TIME ZONE,
      COALESCE((batch->>'created_at')::TIMESTAMP WITH TIME ZONE, NOW()),
      COALESCE((batch->>'updated_at')::TIMESTAMP WITH TIME ZONE, NOW())
    )
    RETURNING to_jsonb(*) INTO result;
    
    RETURN result;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;

-- Delete a product batch safely
CREATE OR REPLACE FUNCTION delete_product_batch(batch_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'product_batches'
  ) THEN
    DELETE FROM public.product_batches
    WHERE id = batch_id;
    
    RETURN FOUND;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;
