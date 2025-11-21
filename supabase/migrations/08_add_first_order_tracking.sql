/*
# Add First Order Tracking

1. New Tables
  - `first_order_devices`
    - `id` (uuid, primary key)
    - `device_id` (text, unique) - Browser fingerprint/device identifier
    - `user_id` (uuid, references profiles) - User who made the first order
    - `order_id` (uuid, references orders) - The first order
    - `discount_applied` (boolean, default true) - Whether discount was applied
    - `created_at` (timestamptz, default now())

2. Purpose
  - Track first order discount per device (2% off)
  - Prevent multiple first order discounts from same device
  - Device-based tracking using browser fingerprint

3. Security
  - Enable RLS on `first_order_devices` table
  - Users can view their own first order records
  - Admins have full access
*/

CREATE TABLE IF NOT EXISTS first_order_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  discount_applied boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE first_order_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own first order records" ON first_order_devices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to first order records" ON first_order_devices
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can insert first order records" ON first_order_devices
  FOR INSERT WITH CHECK (auth.uid() = user_id);
