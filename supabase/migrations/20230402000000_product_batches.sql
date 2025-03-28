
-- Check if the product_batches table already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'product_batches'
  ) THEN
    -- Create the product_batches table
    CREATE TABLE public.product_batches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
      batch_number TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Add comment
    COMMENT ON TABLE public.product_batches IS 'Stores product batch information including expiry dates';
  END IF;
END
$$;
