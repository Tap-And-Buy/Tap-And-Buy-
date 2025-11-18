/*
# Fix Order ID Generation Race Condition

This migration fixes the duplicate order_id issue by using a sequence-based approach
that is transaction-safe and prevents race conditions.

## Changes
1. Create a sequence for order numbering
2. Update generate_order_id function to use sequence
3. Sequence continues incrementing (no daily reset) to ensure uniqueness

## Notes
- Order ID format: TAB-YYYYMMDD-XXXX (TAB prefix, date, sequential number)
- Sequential number never resets to prevent duplicates
- Transaction-safe implementation
*/

-- Create sequence for order IDs
CREATE SEQUENCE IF NOT EXISTS order_id_seq START WITH 1;

-- Update function to generate order ID using sequence
CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  today_date text;
  seq_num integer;
  new_order_id text;
BEGIN
  -- Get today's date in YYYYMMDD format
  today_date := to_char(now(), 'YYYYMMDD');
  
  -- Get next sequence number (transaction-safe)
  seq_num := nextval('order_id_seq');
  
  -- Generate new order ID
  new_order_id := 'TAB-' || today_date || '-' || LPAD(seq_num::text, 4, '0');
  
  RETURN new_order_id;
END;
$$;

-- The trigger function remains the same, no changes needed
