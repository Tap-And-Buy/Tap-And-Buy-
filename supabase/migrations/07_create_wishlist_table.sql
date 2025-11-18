/*
# Create wishlist table

1. New Tables
- `wishlist`
    - `id` (uuid, primary key, default: gen_random_uuid())
    - `user_id` (uuid, references auth.users, not null)
    - `product_id` (uuid, references products, not null)
    - `created_at` (timestamptz, default: now())
    - Unique constraint on (user_id, product_id) to prevent duplicates

2. Security
- Enable RLS on `wishlist` table
- Users can view their own wishlist items
- Users can add items to their own wishlist
- Users can remove items from their own wishlist

3. Indexes
- Index on user_id for faster queries
- Index on product_id for faster lookups
*/

CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist" ON wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own wishlist" ON wishlist
  FOR DELETE USING (auth.uid() = user_id);
