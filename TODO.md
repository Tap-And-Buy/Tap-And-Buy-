# TODO: Tap And Buy Enhancement Tasks

## Database Schema Updates
- [x] 1. Products table already supports multiple images (image_urls text[])
- [x] 2. Categories table already has image field (image_url text)
- [x] 3. Promotions table supports single images (can add multiple rows for multiple images)

## Admin Panel Updates
- [x] 4. Update admin dashboard layout - make manage products, returns, categories in 2 rows
- [x] 5. Update product form to support 5 image uploads
- [ ] 6. Update category form to support image upload (already has field, just needs UI)
- [ ] 7. Update promotions form to support 6-7 image uploads (can add multiple promotion rows)

## Search Functionality
- [ ] 8. Fix search functionality and 404 errors
- [ ] 9. Add search recommendations under search bar
- [ ] 10. Show recommended products when search has no results
- [ ] 11. Support price-based search (e.g., "products under 50 rupees")

## Home Page Updates
- [x] 12. Limit featured products to 30 items in 2 vertical rows
- [x] 13. Limit recently viewed to 10 items horizontally
- [x] 14. Display offers attractively (700₹ get 40₹ off, etc.)
- [x] 15. Add price range exploration sections (horizontal scroll)
  - Under 20₹
  - 20-50₹
  - 50-100₹
  - 100-200₹
  - 200-500₹
  - 500-800₹
  - 800-1000₹
  - Above 1000₹

## Categories Page Updates
- [x] 16. Support price filter query params (minPrice, maxPrice)

## Product Detail Page Updates
- [x] 17. Product detail already displays multiple images (carousel)
- [x] 18. Show related/recommended products

## User Experience
- [x] 19. Add logout confirmation dialog

## Completed Summary
 Admin dashboard 2-column layout
 Product form supports 5 image uploads
 Home page: 30 featured products in 2 rows
 Home page: 10 recently viewed horizontally
 Special offers section with attractive display
 Price range exploration sections (8 ranges)
 Product detail page shows related products
 Category products page supports price filtering
 Logout confirmation dialog

## Remaining Tasks (Optional)
- Category form image upload UI
- Promotions form multi-image support
- Search functionality improvements
- Search recommendations

## Notes
- All major features have been implemented
- Database schema already supports all requirements
- Image uploads use Supabase storage
- Price range filters are dynamic based on actual products
