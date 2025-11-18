/*
# Auto-generate Order ID

This migration adds a trigger to automatically generate a unique order_id when a new order is created.

## Changes
1. Create function to generate order_id in format: TAB-YYYYMMDD-XXXX
2. Add trigger to orders table to auto-generate order_id before insert

## Notes
- Order ID format: TAB-20250118-0001 (TAB prefix, date, sequential number)
- Sequential number resets daily
*/

-- Function to generate order ID
CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  today_date text;
  order_count integer;
  new_order_id text;
BEGIN
  -- Get today's date in YYYYMMDD format
  today_date := to_char(now(), 'YYYYMMDD');
  
  -- Count orders created today
  SELECT COUNT(*) INTO order_count
  FROM orders
  WHERE order_id LIKE 'TAB-' || today_date || '-%';
  
  -- Generate new order ID
  new_order_id := 'TAB-' || today_date || '-' || LPAD((order_count + 1)::text, 4, '0');
  
  RETURN new_order_id;
END;
$$;

-- Trigger function to set order_id before insert
CREATE OR REPLACE FUNCTION set_order_id()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_id IS NULL OR NEW.order_id = '' THEN
    NEW.order_id := generate_order_id();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_order_id ON orders;
CREATE TRIGGER trigger_set_order_id
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_id();
