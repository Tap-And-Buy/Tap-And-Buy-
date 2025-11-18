/*
# Tap And Buy eCommerce Platform - Initial Schema

## 1. New Tables

### profiles
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `phone` (text, unique)
- `full_name` (text)
- `role` (user_role enum: 'customer', 'admin')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### categories
- `id` (uuid, primary key)
- `name` (text, not null)
- `description` (text)
- `image_url` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### products
- `id` (uuid, primary key)
- `category_id` (uuid, references categories)
- `name` (text, not null)
- `description` (text)
- `price` (numeric, not null)
- `image_urls` (text array)
- `stock_quantity` (integer, default 0)
- `is_active` (boolean, default true)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### addresses
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `full_name` (text, not null)
- `phone` (text, not null)
- `address_line1` (text, not null)
- `address_line2` (text)
- `city` (text, not null)
- `state` (text, not null)
- `pincode` (text, not null)
- `is_default` (boolean, default false)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### orders
- `id` (uuid, primary key)
- `order_id` (text, unique, not null) - Display order ID
- `user_id` (uuid, references profiles)
- `address_id` (uuid, references addresses)
- `subtotal` (numeric, not null)
- `platform_fee` (numeric, default 10)
- `delivery_fee` (numeric, default 60)
- `discount` (numeric, default 0)
- `total` (numeric, not null)
- `payment_reference` (text, not null)
- `status` (order_status enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
- `tracking_info` (text)
- `cancellation_requested` (boolean, default false)
- `cancellation_reason` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### order_items
- `id` (uuid, primary key)
- `order_id` (uuid, references orders)
- `product_id` (uuid, references products)
- `product_name` (text, not null)
- `product_price` (numeric, not null)
- `quantity` (integer, not null)
- `subtotal` (numeric, not null)
- `created_at` (timestamptz)

### return_requests
- `id` (uuid, primary key)
- `order_id` (uuid, references orders)
- `user_id` (uuid, references profiles)
- `reason` (text, not null)
- `images` (text array)
- `status` (return_status enum: 'pending', 'approved', 'rejected')
- `admin_notes` (text)
- `refund_amount` (numeric)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### search_history
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `search_term` (text, not null)
- `created_at` (timestamptz)

### promotional_images
- `id` (uuid, primary key)
- `title` (text)
- `image_url` (text, not null)
- `link_url` (text)
- `display_order` (integer, default 0)
- `is_active` (boolean, default true)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### support_messages
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `order_id` (text)
- `message` (text, not null)
- `response` (text)
- `status` (support_status enum: 'open', 'responded', 'closed')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### recently_viewed
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `product_id` (uuid, references products)
- `viewed_at` (timestamptz)

### cart_items
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `product_id` (uuid, references products)
- `quantity` (integer, not null, default 1)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## 2. Security
- Enable RLS on all tables
- Profiles table: First user becomes admin, users can view/edit their own profile
- Products/Categories: Public read, admin write
- Orders: Users can view their own orders, admin can view all
- Addresses: Users can manage their own addresses
- Cart: Users can manage their own cart
- Search history: Users can view their own history
- Support messages: Users can create and view their own messages, admin can view all

## 3. Functions
- `handle_new_user()`: Trigger to create profile after auth signup
- `generate_order_id()`: Generate unique order ID
- `is_admin()`: Check if user is admin
*/

-- Create enums
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE return_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE support_status AS ENUM ('open', 'responded', 'closed');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  phone text UNIQUE,
  full_name text,
  role user_role DEFAULT 'customer'::user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  image_urls text[],
  stock_quantity integer DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  address_id uuid REFERENCES addresses(id) ON DELETE SET NULL,
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  platform_fee numeric DEFAULT 10 CHECK (platform_fee >= 0),
  delivery_fee numeric DEFAULT 60 CHECK (delivery_fee >= 0),
  discount numeric DEFAULT 0 CHECK (discount >= 0),
  total numeric NOT NULL CHECK (total >= 0),
  payment_reference text NOT NULL,
  status order_status DEFAULT 'pending'::order_status NOT NULL,
  tracking_info text,
  cancellation_requested boolean DEFAULT false,
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_price numeric NOT NULL CHECK (product_price >= 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create return_requests table
CREATE TABLE IF NOT EXISTS return_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reason text NOT NULL,
  images text[],
  status return_status DEFAULT 'pending'::return_status NOT NULL,
  admin_notes text,
  refund_amount numeric CHECK (refund_amount >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create search_history table
CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  search_term text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create promotional_images table
CREATE TABLE IF NOT EXISTS promotional_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  image_url text NOT NULL,
  link_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create support_messages table
CREATE TABLE IF NOT EXISTS support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id text,
  message text NOT NULL,
  response text,
  status support_status DEFAULT 'open'::support_status NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recently_viewed table
CREATE TABLE IF NOT EXISTS recently_viewed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_search_history_user ON search_history(user_id);
CREATE INDEX idx_recently_viewed_user ON recently_viewed(user_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotional_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL) OR
     (TG_OP = 'INSERT' AND NEW.confirmed_at IS NOT NULL) THEN
    SELECT COUNT(*) INTO user_count FROM profiles;
    INSERT INTO profiles (id, phone, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.phone,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'customer'::user_role END
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to generate order ID
CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_id text;
  done bool;
BEGIN
  done := false;
  WHILE NOT done LOOP
    new_id := 'TAB' || LPAD(floor(random() * 1000000)::text, 6, '0');
    done := NOT EXISTS(SELECT 1 FROM orders WHERE order_id = new_id);
  END LOOP;
  RETURN new_id;
END;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin(auth.uid()));

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for addresses
CREATE POLICY "Users can view own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders" ON orders
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id AND (o.user_id = auth.uid() OR is_admin(auth.uid()))
    )
  );

CREATE POLICY "Users can create order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

-- RLS Policies for return_requests
CREATE POLICY "Users can view own return requests" ON return_requests
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Users can create return requests" ON return_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage return requests" ON return_requests
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for search_history
CREATE POLICY "Users can view own search history" ON search_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own search history" ON search_history
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for promotional_images (public read, admin write)
CREATE POLICY "Anyone can view active promotional images" ON promotional_images
  FOR SELECT USING (is_active = true OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage promotional images" ON promotional_images
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for support_messages
CREATE POLICY "Users can view own support messages" ON support_messages
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Users can create support messages" ON support_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage support messages" ON support_messages
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for recently_viewed
CREATE POLICY "Users can view own recently viewed" ON recently_viewed
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own recently viewed" ON recently_viewed
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for cart_items
CREATE POLICY "Users can view own cart" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);
