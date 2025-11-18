/*
# Add delivered_at Timestamp to Orders

This migration adds a delivered_at timestamp field to track when orders are delivered.
This is needed to enforce the 12-hour return window policy.

## Changes
1. Add delivered_at column to orders table
2. Create trigger to automatically set delivered_at when status changes to 'delivered'

## Notes
- delivered_at is set automatically when order status becomes 'delivered'
- Used to calculate 12-hour return eligibility window
*/

-- Add delivered_at column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at timestamptz;

-- Function to set delivered_at timestamp
CREATE OR REPLACE FUNCTION set_delivered_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Set delivered_at when status changes to 'delivered'
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
    NEW.delivered_at := now();
  END IF;
  
  -- Clear delivered_at if status changes from 'delivered' to something else
  IF OLD.status = 'delivered' AND NEW.status != 'delivered' THEN
    NEW.delivered_at := NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_delivered_at ON orders;
CREATE TRIGGER trigger_set_delivered_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_delivered_at();
