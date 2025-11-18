/*
# Create storage bucket for product images

1. New Storage Bucket
   - `product_images` bucket for storing product images
   - Public access for reading
   - Size limit: 1MB per file
   - Allowed MIME types: image/jpeg, image/png, image/webp

2. Security
   - Public read access (no authentication required)
   - Only authenticated admins can upload/update/delete
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product_images',
  'product_images',
  true,
  1048576,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product_images');

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product_images' AND
  is_admin(auth.uid())
);

-- Allow authenticated admins to update
CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product_images' AND
  is_admin(auth.uid())
);

-- Allow authenticated admins to delete
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product_images' AND
  is_admin(auth.uid())
);
