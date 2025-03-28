
-- Function to check if a table exists in the database
CREATE OR REPLACE FUNCTION check_table_exists(table_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = $1
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$$;

-- Function to create product_batches table if it doesn't exist
CREATE OR REPLACE FUNCTION create_product_batches_table()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'product_batches'
  ) THEN
    CREATE TABLE public.product_batches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
      batch_number TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    COMMENT ON TABLE public.product_batches IS 'Stores product batch information including expiry dates';
  END IF;
END;
$$;
