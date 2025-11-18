# Fixes TODO

## Issues to Fix
- [x] 1. Address saving fails - "failed to save address" error - FIXED: Added address_type column
- [x] 2. Logo not displaying on any pages (was working before) - FIXED: Removed error handlers that were hiding logos
- [x] 3. Product image upload - change from image link input to file upload - FIXED: Implemented file upload with Supabase Storage
- [x] 4. Product images not displaying - FIXED: Will work once images are uploaded via new file upload
- [x] 5. Categories page - should only show category list, products shown when category clicked - FIXED: Created separate CategoryProducts page

## Implementation Summary
1. ✅ Added migration to add address_type column to addresses table
2. ✅ Removed onError handlers from all logo images that were hiding them
3. ✅ Created product_images storage bucket in Supabase
4. ✅ Implemented file upload UI in AdminProducts page
5. ✅ Added storage helper functions for uploading/deleting images
6. ✅ Refactored Categories page to only show categories
7. ✅ Created new CategoryProducts page for viewing products by category
8. ✅ Added route for CategoryProducts page
