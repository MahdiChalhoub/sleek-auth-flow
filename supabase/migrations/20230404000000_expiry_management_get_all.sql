
-- Create RPC function to get all product batches
CREATE OR REPLACE FUNCTION get_all_product_batches()
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
      ORDER BY pb.expiry_date ASC;
  ELSE
    RETURN;
  END IF;
END;
$$;

-- Create a safer way to execute SQL queries
CREATE OR REPLACE FUNCTION execute_sql_safely(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- This is a simple function that allows for some flexibility
  -- while maintaining control over what SQL can be executed
  IF sql_query LIKE 'SELECT%FROM product_batches%' THEN
    EXECUTE 'SELECT jsonb_agg(q) FROM (' || sql_query || ') q' INTO result;
    RETURN result;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;
