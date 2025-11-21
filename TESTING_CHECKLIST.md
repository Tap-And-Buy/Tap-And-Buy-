# Complete Application Testing Checklist

## 1. Authentication & User Management

### Registration
- [ ] User can register with email and password
- [ ] Email validation works correctly
- [ ] Password strength requirements are enforced
- [ ] Success message appears after registration
- [ ] User is redirected to appropriate page after registration
- [ ] Duplicate email registration is prevented

### Login
- [ ] User can login with correct credentials
- [ ] Error message appears for incorrect credentials
- [ ] "Remember me" functionality works
- [ ] User session persists across page refreshes
- [ ] Logout functionality works correctly

### Password Management
- [ ] Forgot password link is accessible
- [ ] Password reset email is sent
- [ ] Password reset link works correctly
- [ ] New password can be set successfully
- [ ] User can login with new password

### Profile Management
- [ ] User can view their profile
- [ ] User can edit profile information
- [ ] Profile changes are saved correctly
- [ ] Profile image upload works (if applicable)
- [ ] Email change requires verification

---

## 2. Homepage

### Layout & Design
- [ ] Homepage loads without errors
- [ ] All sections are visible and properly aligned
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] Logo and branding are displayed correctly
- [ ] Footer contains all necessary links

### Promotional Banners
- [ ] Promotional banners display correctly
- [ ] Auto-rotation works (5-second interval)
- [ ] Manual navigation (prev/next) works
- [ ] Banner images load properly
- [ ] Click on banner navigates to correct page

### Search Functionality
- [ ] Search bar is visible and accessible
- [ ] Search icon is displayed
- [ ] Typing shows suggestions after 2 characters
- [ ] Suggestions include all products (old and new)
- [ ] Clicking suggestion navigates to product
- [ ] Pressing Enter performs search
- [ ] Search history is saved (for logged-in users)

### Offers Section
- [ ] "All Time Offers" section displays
- [ ] All 4 offer cards are visible
- [ ] Quantity-based discounts are correct:
  - [ ] ₹40 OFF on 10+ products
  - [ ] ₹80 OFF on 20+ products
  - [ ] ₹150 OFF on 35+ products
  - [ ] FREE DELIVERY on orders above ₹499

### Product Sections
- [ ] Featured products display in 2-row grid
- [ ] Price range sections display correctly:
  - [ ] Under ₹20
  - [ ] ₹20 - ₹50
  - [ ] ₹50 - ₹100
  - [ ] ₹100 - ₹200
  - [ ] ₹200 - ₹500
  - [ ] ₹500 - ₹800
  - [ ] ₹800 - ₹1000
  - [ ] Above ₹1000
- [ ] Products display in 2-row grids (mobile: 2 cols, desktop: 5 cols)
- [ ] "View All" buttons work correctly
- [ ] In-stock products appear before out-of-stock
- [ ] Out-of-stock products appear at the bottom

### Recently Viewed
- [ ] Recently viewed section appears (for logged-in users)
- [ ] Shows last 10 viewed products
- [ ] Products are clickable
- [ ] Section updates after viewing new products

---

## 3. Product Browsing

### Categories Page
- [ ] All categories are displayed
- [ ] Category images load correctly
- [ ] Category names are visible
- [ ] Clicking category navigates to products
- [ ] Product count is displayed per category
- [ ] Grid layout is responsive

### Category Products Page
- [ ] Products load for selected category
- [ ] Category name is displayed in header
- [ ] Grid layout: 2 columns (mobile), 4 columns (desktop)
- [ ] Sorting options work:
  - [ ] Sort by name
  - [ ] Sort by price (low to high)
  - [ ] Sort by price (high to low)
- [ ] Price range filter works
- [ ] Search within category works
- [ ] "No products found" message appears when appropriate
- [ ] Recommended products show when no results

### Product Detail Page
- [ ] Product images display correctly
- [ ] Image carousel works (prev/next buttons)
- [ ] Touch/swipe gestures work on mobile
- [ ] Image transitions are fast (200ms)
- [ ] Swipe requires 50px minimum distance
- [ ] Product name and description are visible
- [ ] Price is displayed correctly
- [ ] Stock status is shown
- [ ] "Add to Cart" button works
- [ ] "Add to Wishlist" button works
- [ ] Quantity selector works
- [ ] Related products are displayed
- [ ] Page scrolls to top on navigation

### Search Results Page
- [ ] Search query is displayed
- [ ] Matching products are shown
- [ ] Grid layout: 2 columns (mobile), 4 columns (desktop)
- [ ] "No products found" message appears when no matches
- [ ] Recommended products show when no results
- [ ] Sorting and filtering work
- [ ] Page scrolls to top on navigation

---

## 4. Shopping Cart

### Cart Functionality
- [ ] Cart icon shows item count
- [ ] Cart page displays all added items
- [ ] Product images and details are correct
- [ ] Quantity can be increased
- [ ] Quantity can be decreased
- [ ] Minimum quantity is 1
- [ ] Remove item button works
- [ ] Cart updates in real-time
- [ ] Empty cart message appears when no items

### Price Calculation
- [ ] Subtotal is calculated correctly
- [ ] Total quantity is displayed (not unique items)
- [ ] Platform fee (₹10) is added
- [ ] Delivery fee (₹60) is added for orders below ₹499
- [ ] Free delivery applies for orders above ₹499
- [ ] Quantity discount applies correctly:
  - [ ] ₹40 OFF for 10+ items
  - [ ] ₹80 OFF for 20+ items
  - [ ] ₹150 OFF for 35+ items
- [ ] Total amount is calculated correctly
- [ ] All prices display with 2 decimal places

### Cart UI
- [ ] "Continue Shopping" button works
- [ ] "Proceed to Checkout" button works
- [ ] Discount information is displayed
- [ ] Free delivery progress message shows
- [ ] Grid layout is responsive
- [ ] Page scrolls to top on navigation

---

## 5. Checkout Process

### Address Selection
- [ ] Saved addresses are displayed
- [ ] User can select an address
- [ ] "Add New Address" button works
- [ ] Address form validation works
- [ ] New address is saved correctly
- [ ] Address can be edited
- [ ] Address can be deleted
- [ ] Default address is pre-selected

### Order Summary
- [ ] All cart items are displayed
- [ ] Product details are correct
- [ ] Subtotal is calculated correctly
- [ ] Platform fee is displayed
- [ ] Delivery fee is calculated correctly
- [ ] Quantity discount checkbox appears when eligible
- [ ] Discount applies when checkbox is checked
- [ ] Total amount updates when discount is applied
- [ ] Discount description is accurate

### Payment
- [ ] "Proceed to Payment" button is enabled when address is selected
- [ ] Error message appears if no address is selected
- [ ] Payment page loads correctly
- [ ] Payment options are displayed
- [ ] Payment processing works
- [ ] Order confirmation appears after successful payment
- [ ] Order details are saved to database

---

## 6. Order Management (Customer)

### Orders Page
- [ ] All user orders are displayed
- [ ] Orders are sorted by date (newest first)
- [ ] Order status is displayed correctly
- [ ] Order ID is visible
- [ ] Order date is shown
- [ ] Total amount is displayed
- [ ] "View Details" button works
- [ ] Empty orders message appears when no orders
- [ ] Page scrolls to top on navigation

### Order Detail Page
- [ ] Order ID is displayed
- [ ] Order date and time are shown
- [ ] Order status is visible
- [ ] All ordered items are listed
- [ ] Product images and details are correct
- [ ] Quantities are accurate
- [ ] Prices are correct
- [ ] Delivery address is displayed
- [ ] Payment method is shown
- [ ] Order total breakdown is visible
- [ ] "Track Order" button works (if applicable)
- [ ] "Cancel Order" button works (if applicable)
- [ ] Page scrolls to top on navigation

---

## 7. Wishlist

### Wishlist Functionality
- [ ] Wishlist icon shows item count
- [ ] Wishlist page displays all saved items
- [ ] Product images and details are correct
- [ ] Grid layout: 2 columns (mobile), 4 columns (desktop)
- [ ] "Add to Cart" button works
- [ ] "Remove from Wishlist" button works
- [ ] Wishlist updates in real-time
- [ ] Empty wishlist message appears when no items
- [ ] Wishlist persists across sessions
- [ ] Page scrolls to top on navigation

---

## 8. User Account

### Account Page
- [ ] User profile information is displayed
- [ ] "Edit Profile" button works
- [ ] Profile changes are saved
- [ ] "Change Password" button works
- [ ] Password change form validation works
- [ ] New password is saved correctly
- [ ] "Logout" button works
- [ ] Page scrolls to top on navigation

### Addresses Page
- [ ] All saved addresses are displayed
- [ ] "Add New Address" button works
- [ ] Address form validation works
- [ ] New address is saved correctly
- [ ] "Edit" button works for each address
- [ ] Address changes are saved
- [ ] "Delete" button works
- [ ] Confirmation dialog appears before deletion
- [ ] Default address is marked
- [ ] Page scrolls to top on navigation

---

## 9. Admin Panel

### Admin Dashboard
- [ ] Admin can access dashboard
- [ ] Statistics are displayed correctly
- [ ] Charts and graphs load properly
- [ ] Recent orders are shown
- [ ] Low stock alerts are visible
- [ ] Navigation menu works

### Product Management
- [ ] All products are displayed
- [ ] Grid layout: 2 columns (mobile), 4 columns (desktop)
- [ ] Search functionality works
- [ ] Filter by category works
- [ ] "Add New Product" button works
- [ ] Product form validation works
- [ ] Price input allows manual typing
- [ ] Price input accepts decimal values
- [ ] Price input rejects non-numeric characters
- [ ] Image upload works (click to upload)
- [ ] Drag-and-drop image upload works
- [ ] Visual feedback appears when dragging
- [ ] Multiple images can be uploaded
- [ ] Product is saved correctly
- [ ] "Edit" button works for each product
- [ ] Product changes are saved
- [ ] "Delete" button works
- [ ] Confirmation dialog appears before deletion
- [ ] Stock quantity can be updated

### Category Management
- [ ] All categories are displayed
- [ ] "Add New Category" button works
- [ ] Category form validation works
- [ ] Category image upload works
- [ ] New category is saved correctly
- [ ] "Edit" button works for each category
- [ ] Category changes are saved
- [ ] "Delete" button works
- [ ] Confirmation dialog appears before deletion

### Order Management
- [ ] All orders are displayed
- [ ] Orders are sorted by date (newest first)
- [ ] Filter by status works:
  - [ ] Pending
  - [ ] Processing
  - [ ] Order Placed
  - [ ] Shipped
  - [ ] Delivered
  - [ ] Cancelled
- [ ] Order count is displayed for each filter
- [ ] Sort by newest/oldest works
- [ ] Search by order ID works
- [ ] "View Details" button works
- [ ] Order status can be updated
- [ ] Admin can add description/notes
- [ ] Changes are saved correctly

### Return Management
- [ ] All return requests are displayed
- [ ] Filter by status works
- [ ] Sort by newest/oldest works
- [ ] Search by order ID/reference number works
- [ ] Return request details are visible
- [ ] Admin can approve/reject returns
- [ ] Return status can be updated
- [ ] Changes are saved correctly

### Promotional Images
- [ ] All promotional images are displayed
- [ ] "Add New Image" button works
- [ ] Image upload works
- [ ] Image URL can be set
- [ ] Active/inactive toggle works
- [ ] Display order can be set
- [ ] "Edit" button works
- [ ] "Delete" button works
- [ ] Changes are saved correctly

---

## 10. Responsive Design

### Mobile (< 640px)
- [ ] All pages are accessible
- [ ] Navigation menu works (hamburger menu)
- [ ] Touch gestures work (swipe, tap)
- [ ] Product grids display in 2 columns
- [ ] Forms are usable
- [ ] Buttons are tappable
- [ ] Images scale correctly
- [ ] Text is readable
- [ ] No horizontal scrolling

### Tablet (640px - 1024px)
- [ ] All pages are accessible
- [ ] Navigation menu works
- [ ] Product grids display correctly
- [ ] Forms are usable
- [ ] Layout adapts to screen size
- [ ] Images scale correctly
- [ ] Text is readable

### Desktop (≥ 1024px)
- [ ] All pages are accessible
- [ ] Navigation menu works
- [ ] Product grids display in 4 columns
- [ ] Forms are usable
- [ ] Layout uses full width appropriately
- [ ] Images scale correctly
- [ ] Text is readable
- [ ] Hover effects work

---

## 11. Performance

### Page Load Times
- [ ] Homepage loads in < 3 seconds
- [ ] Product pages load in < 2 seconds
- [ ] Search results appear in < 1 second
- [ ] Cart updates in < 500ms
- [ ] Navigation is smooth

### Image Loading
- [ ] Images load progressively
- [ ] Lazy loading works for off-screen images
- [ ] Image placeholders are shown while loading
- [ ] No broken image links

### API Calls
- [ ] All API calls complete successfully
- [ ] Error handling works for failed requests
- [ ] Loading states are displayed
- [ ] No unnecessary duplicate requests

---

## 12. Security

### Authentication
- [ ] Passwords are hashed
- [ ] Session tokens are secure
- [ ] Unauthorized access is prevented
- [ ] Admin routes are protected
- [ ] User data is private

### Data Validation
- [ ] Input validation works on frontend
- [ ] Input validation works on backend
- [ ] SQL injection is prevented
- [ ] XSS attacks are prevented
- [ ] CSRF protection is enabled

---

## 13. Browser Compatibility

### Chrome
- [ ] All features work correctly
- [ ] No console errors
- [ ] UI renders properly

### Firefox
- [ ] All features work correctly
- [ ] No console errors
- [ ] UI renders properly

### Safari
- [ ] All features work correctly
- [ ] No console errors
- [ ] UI renders properly

### Edge
- [ ] All features work correctly
- [ ] No console errors
- [ ] UI renders properly

---

## 14. Accessibility

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Keyboard shortcuts work

### Screen Readers
- [ ] Alt text is provided for images
- [ ] ARIA labels are used appropriately
- [ ] Form labels are associated correctly
- [ ] Error messages are announced

### Color Contrast
- [ ] Text has sufficient contrast
- [ ] Interactive elements are distinguishable
- [ ] Color is not the only indicator

---

## 15. Error Handling

### User Errors
- [ ] Validation errors are displayed clearly
- [ ] Error messages are helpful
- [ ] Users can recover from errors
- [ ] Form data is preserved on error

### System Errors
- [ ] 404 page is displayed for invalid routes
- [ ] 500 error page is displayed for server errors
- [ ] Network errors are handled gracefully
- [ ] Fallback UI is shown when needed

---

## 16. Data Persistence

### Local Storage
- [ ] Cart persists across sessions (if applicable)
- [ ] User preferences are saved
- [ ] Search history is saved

### Database
- [ ] User data is saved correctly
- [ ] Orders are saved correctly
- [ ] Products are saved correctly
- [ ] Data integrity is maintained

---

## 17. Edge Cases

### Empty States
- [ ] Empty cart message is displayed
- [ ] Empty wishlist message is displayed
- [ ] No orders message is displayed
- [ ] No search results message is displayed

### Boundary Conditions
- [ ] Maximum quantity limits work
- [ ] Minimum quantity limits work
- [ ] Price limits are enforced
- [ ] Character limits are enforced

### Concurrent Actions
- [ ] Multiple users can place orders simultaneously
- [ ] Stock updates are handled correctly
- [ ] Race conditions are prevented

---

## 18. Integration Testing

### Payment Gateway
- [ ] Payment processing works
- [ ] Payment confirmation is received
- [ ] Failed payments are handled
- [ ] Refunds work correctly

### Email Service
- [ ] Registration emails are sent
- [ ] Order confirmation emails are sent
- [ ] Password reset emails are sent
- [ ] Email templates render correctly

---

## 19. Recent Changes Verification

### Search Functionality
- [ ] Search loads all products (not just 30)
- [ ] Search suggestions show old and new products
- [ ] Search results display correctly
- [ ] No continuous loading issue

### Grid Layouts
- [ ] Mobile: 2 columns everywhere
- [ ] Desktop: 4 columns everywhere
- [ ] Consistent across all product listing pages

### Price Input
- [ ] Manual typing works in admin panel
- [ ] No up/down arrows on desktop
- [ ] Decimal values are accepted
- [ ] Validation prevents non-numeric input

### Quantity Discounts
- [ ] 10+ items: ₹40 off
- [ ] 20+ items: ₹80 off
- [ ] 35+ items: ₹150 off
- [ ] Discount displays in cart
- [ ] Discount displays in checkout
- [ ] Discount applies to total

### Scroll-to-Top
- [ ] Works on all 13 pages
- [ ] Scrolls instantly (not smooth)
- [ ] Triggers on route change

### Touch Gestures
- [ ] Swipe left/right on product images
- [ ] 50px minimum swipe distance
- [ ] Fast transitions (200ms)

### Drag-and-Drop
- [ ] Drag files over upload area
- [ ] Visual feedback appears
- [ ] Files are uploaded correctly

---

## 20. Final Checks

### Code Quality
- [ ] No console errors
- [ ] No console warnings
- [ ] Linting passes
- [ ] TypeScript types are correct
- [ ] Code is well-documented

### Deployment
- [ ] Build process completes successfully
- [ ] Environment variables are set
- [ ] Database migrations run correctly
- [ ] Production build works

### Documentation
- [ ] README is up to date
- [ ] API documentation is complete
- [ ] User guide is available
- [ ] Admin guide is available

---

## Testing Summary

**Total Test Cases**: 400+

**Categories**:
- Authentication: 15 tests
- Homepage: 35 tests
- Product Browsing: 45 tests
- Shopping Cart: 25 tests
- Checkout: 20 tests
- Order Management: 20 tests
- Wishlist: 10 tests
- User Account: 15 tests
- Admin Panel: 60 tests
- Responsive Design: 25 tests
- Performance: 10 tests
- Security: 10 tests
- Browser Compatibility: 12 tests
- Accessibility: 10 tests
- Error Handling: 10 tests
- Data Persistence: 5 tests
- Edge Cases: 10 tests
- Integration: 8 tests
- Recent Changes: 25 tests
- Final Checks: 10 tests

---

## Notes

- Test on real devices when possible
- Use browser developer tools for debugging
- Check network tab for API calls
- Monitor console for errors
- Test with different user roles
- Test with different data sets
- Test edge cases and boundary conditions
- Document any bugs found
- Retest after bug fixes

---

## Bug Reporting Template

```
**Bug Title**: [Short description]

**Priority**: [High/Medium/Low]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happens]

**Screenshots**: [If applicable]

**Environment**:
- Browser: [Chrome/Firefox/Safari/Edge]
- Device: [Desktop/Mobile/Tablet]
- Screen Size: [1920x1080/etc]
- OS: [Windows/Mac/iOS/Android]

**Additional Notes**: [Any other relevant information]
```
