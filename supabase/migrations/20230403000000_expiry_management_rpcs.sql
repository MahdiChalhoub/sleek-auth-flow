
-- Function to execute SQL safely and check if a table exists
CREATE OR REPLACE FUNCTION execute_sql_safely(sql_query TEXT)
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY EXECUTE sql_query;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error executing SQL: %', SQLERRM;
    RETURN;
END;
$$;

-- Function to check if a table exists
CREATE OR REPLACE FUNCTION check_table_exists(table_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = table_name
    ) INTO table_exists;
    
    RETURN table_exists;
END;
$$;

-- Function to get product batches by product ID
CREATE OR REPLACE FUNCTION get_product_batches(product_id_param UUID) 
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product_batches') THEN
        RETURN QUERY 
        SELECT jsonb_build_object(
            'id', pb.id,
            'product_id', pb.product_id,
            'batch_number', pb.batch_number,
            'quantity', pb.quantity,
            'expiry_date', pb.expiry_date,
            'created_at', pb.created_at,
            'updated_at', pb.updated_at
        )
        FROM product_batches pb
        WHERE pb.product_id = product_id_param
        ORDER BY pb.expiry_date ASC;
    ELSE
        -- Table doesn't exist, return empty set
        RETURN;
    END IF;
END;
$$;

-- Function to get all product batches
CREATE OR REPLACE FUNCTION get_all_product_batches() 
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product_batches') THEN
        RETURN QUERY 
        SELECT jsonb_build_object(
            'id', pb.id,
            'product_id', pb.product_id,
            'batch_number', pb.batch_number,
            'quantity', pb.quantity,
            'expiry_date', pb.expiry_date,
            'created_at', pb.created_at,
            'updated_at', pb.updated_at
        )
        FROM product_batches pb
        ORDER BY pb.expiry_date ASC;
    ELSE
        -- Table doesn't exist, return empty set
        RETURN;
    END IF;
END;
$$;

-- Function to insert a new product batch
CREATE OR REPLACE FUNCTION insert_product_batch(batch JSONB) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_id UUID;
    new_batch JSONB;
BEGIN
    IF NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product_batches') THEN
        RETURN NULL;
    END IF;

    INSERT INTO product_batches (
        product_id,
        batch_number,
        quantity,
        expiry_date
    ) VALUES (
        (batch->>'product_id')::UUID,
        batch->>'batch_number',
        (batch->>'quantity')::INTEGER,
        (batch->>'expiry_date')::TIMESTAMPTZ
    )
    RETURNING id INTO new_id;
    
    -- Get the full record including the new ID and timestamps
    SELECT jsonb_build_object(
        'id', pb.id,
        'product_id', pb.product_id,
        'batch_number', pb.batch_number,
        'quantity', pb.quantity,
        'expiry_date', pb.expiry_date,
        'created_at', pb.created_at,
        'updated_at', pb.updated_at
    ) INTO new_batch
    FROM product_batches pb
    WHERE pb.id = new_id;
    
    RETURN new_batch;
END;
$$;

-- Function to delete a product batch
CREATE OR REPLACE FUNCTION delete_product_batch(batch_id UUID) 
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product_batches') THEN
        RETURN false;
    END IF;

    DELETE FROM product_batches 
    WHERE id = batch_id;
    
    RETURN FOUND;
END;
$$;
