# Tap And Buy eCommerce Website Requirements Document

## 1. Website Overview
### 1.1 Website Name
Tap And Buy\n
### 1.2 Website Description
An eCommerce platform for online shopping, featuring customer-facing frontend and admin management panel. The website enables customers to browse products, make prepaid purchases, track orders, and request returns for damaged items.

### 1.3 Website Logo
Use the provided logo image:1000070948.jpg

### 1.4 Contact Information
Email: tapandbuy.in@gmail.com

---

## 2. User Roles & Access
\n### 2.1 Initial Landing Page & Anonymous Access
**Anonymous Exploration:**
- When opening the website, users are directed straight to the **Home Page** without being forced to register or log in.
- Anonymous users can freely explore the application, browse products, search, view categories, and view product details.
\n**Mandatory Authentication Triggers:**
- Anonymous users must be redirected to the **Welcome Page** (containing Log In and Register options) when attempting any of the following actions:
  - Tapping the 'Buy Now' button
  - Tapping the 'Add to Cart' button
  - Tapping the 'Wishlisting Heart Symbol'
  - Tapping the 'Account Option' in the bottom navigation menu
- The Welcome Page clearly presents options to either Log In (for existing accounts) or Register (for new accounts).

### 2.2 Admin Role\n**Login Credentials:** Embedded in code with bcrypt encryption (credentials to be provided separately)

**Capabilities:**
- Add, edit, and remove product categories with category image upload (one image per category for visual identification)
- Add, edit, and remove products with up to 5 image uploads per product
- Add and manage homepage promotional images (6-7 images upload capacity)
- Change application logo
- View all customer orders with filters (newest, oldest, high price, low price, order ID search)
- Filter orders by status: Processing, Order Placed\n- View order count for each filter status (e.g., 'Processing: 15 orders')
- View order placement timestamp for each order
- Manage return/refund requests with filters (newest, oldest, order ID search, reference number search)
- View return request timestamp for each return request
- Handle customer feedback and support messages
- Enter tracking details and order information manually
- Approve or reject order cancellation requests
- Access order management dashboard with timestamp display for order placement and return requests
- Manage Products (with device-responsive layout: 2 rows on mobile, 4 rows on laptop/desktop/tablet), Manage Returns, and Manage Categories sections displayed in two-row layout
- Send push notifications to customers for order updates and promotional announcements
\n### 2.3 Customer Role
**Registration & Login:**
- Register using email or phone number
- OTP verification via email or phone (customer selects preferred method)
- Registration confirmation email with properly configured links
- Login with registered credentials
- Logout confirmation: When customer clicks logout button, a confirmation popup appears asking'Are you sure you want to logout?' with Yes/No options. Logout only proceeds if Yes is selected.

**Password Recovery and Reset:**
- **Forgot Password Flow:**
  - When a user initiates 'Forgot Current Password' or similar password recovery flow, the application immediately sends a randomly generated temporary password to the user's registered email address.
  - **The application must NOT display or notify the user of the temporary password within the app interface** (i.e., do not show it on the screen, in a push notification, or in an in-app message).
  - Upon successful email transmission, display a clear message to the user:'A temporary password has been sent to your registered email. Please check your inbox to proceed.'
  - User can login with the temporary password received via email and optionally change it by copying the temporary password into the 'current password' field and creating a new password.

**Capabilities:**
- Browse and search products with search history display
- Search icon displayed inside the search bar
- Search recommendations: When searching for products (e.g., 'soap stand'), display recommended search titles (both newly added and older products) related to the query under the search bar
- Intelligent search results: Display products matching search queries (e.g., 'products under 50 rupees' shows items under₹50). If search is unrelated, analyze and display relevant products. If no products found, display message: 'No product was found'\n- Search results display promptly without indefinite loading
- View product details (images, description, price, offers)\n- Product Image Navigation: For products with 2 or more images, display navigation arrows with optimized image loading (transition time under 1 second):\n  - When viewing the first image: Show right arrow at the right center side of the image
  - When viewing middle images (2nd, 3rd, etc.): Show both left and right arrows at the left and right center sides of the image
  - When viewing the last image: Show left arrow at the left center side of the image
- Arrows should be clearly visible and positioned at the vertical center of the image
- Share products via share button on product page
- Add products to wishlist by clicking heart icon on product page (requires login)
- View and manage wishlist items from Account page
- Add products to cart or use'Buy Now' option (requires login)
- Add and manage multiple delivery addresses\n- Select delivery address during checkout\n- Make prepaid payments only\n- View order history and order details with unique Order ID and timestamp
- Track order status\n- Submit return requests for damaged products (within 12 hours of delivery)
- Submit order cancellation requests
- Password Management: Access password management in Account Settings with the following options:
  - Change password by entering current password, new password, and confirm new password\n  - Forgot Password option: Displays below the current password field. When clicked, shows popup message: 'We will send you a changed random password to your email. Do you want to reset your password?'
  - If user confirms, system generates and sends a random password (mix of letters and numbers) to registered email (NOT displayed in-app)
  - User can login with the random password and optionally change it by copying the random password into the 'current password' field and creating a new password
- Update account details with OTP verification
- Use in-app chatbot for order inquiries
- Receive email notifications for all order status changes and account activities
- Receive in-app push notifications for order updates, promotional offers, and important announcements
- Manage notification preferences in Account Settings
\n---

## 3. Website Features

### 3.1 Bottom Navigation Menu
- **Home:** Featured products (30 products displayed vertically in two rows on mobile, four rows on laptop/desktop/tablet), recently viewed products (10 products displayed horizontally with horizontal scrolling)\n- **Categories:** Browse products by category (displayed horizontally with horizontal scrolling, clicking category shows products in 2 rows on mobile, 4 rows on other devices)
- **Cart:** View added items, quantities, and proceed to checkout (requires login if not authenticated)
- **Account:** Login, profile management, order history, saved addresses, wishlist access, password management, notification preferences (requires login if not authenticated)
- **Customer Care:** Order inquiries and support\n\n### 3.2 Product Management
- Admin can add product categories with one category image upload for visual identification
- Admin can add products with up to 5 image uploads per product
- Admin can add images, descriptions, and pricing\n- No pre-populated product list\n- Dummy products for initial testing (to be removed before publishing)
- **Product Listing Layout:**
  - Mobile devices: 2 rows\n  - Laptop/Desktop/Tablet: 4 rows\n  - Applied to all product listing pages (categories, search results, admin manage products, price range results)
\n### 3.3 Promotional Content Management
- Admin can upload 6-7 promotional images for homepage display
- **Auto-Rotating Promotional Images:** Promotional images automatically rotate on the homepage with the following behavior:
  - First image displays initially
  - After 5 seconds, automatically transitions to the second image
  - After another 5 seconds, transitions to the third image
  - Continues rotating through all promotional images with5-second intervals
  - Cycles back to the first image after displaying the last image
- Promotional images managed through'Manage Promotions' section
\n### 3.4 Product Interaction Features
- **Share Button:** Each product displays a share button allowing customers to share product details via social media, messaging apps, or copy link
- **Wishlist Heart Icon:** Each product displays a heart icon that customers can click to add/remove products from their wishlist (requires login)
- Heart icon fills with color when product is added to wishlist
- Wishlist items persist across sessions for logged-in users
\n### 3.5 Wishlist Page
- Wishlist option is located within the Account page
- When customer clicks on Wishlist option in Account page, a dedicated wishlist page displays all wishlisted products
- Wishlist page shows product images, names, prices, and heart icons
- Customers can remove items from wishlist by clicking the filled heart icon
- Customers can add wishlisted products to cart directly from wishlist page

### 3.6 Search & Recommendations
- Search functionality with search history display and search icon
- Search recommendations displayed under search bar when typing (e.g., searching'soap stand' shows related title suggestions including both new and old products)
- Click on search history to repeat searches
- Intelligent search results: Display products matching search criteria (e.g., 'products under 50 rupees' shows items under ₹50). Analyze unrelated searches and display relevant products.\n- Display'No product was found' message when search yields no results
- Optimized search performance - eliminate continuous loading issue
- Recently visited products displayed on homepage (10 products horizontally)
- Related product recommendations displayed under product details page

### 3.7 Price Range Exploration
- 'Explore Products by Price' section displayed on homepage under attractive offers section
- **Horizontal scrolling layout** for price range options
- Also displayed in Categories section horizontally
- **Updated Price Ranges:**
  - Under ₹20\n  - ₹20 - ₹50
  - ₹50 - ₹100
  - ₹100 - ₹200
  - ₹200 - ₹500
  - ₹500 - ₹800
  - ₹800 - ₹1000
  - Above ₹1000
- Clicking each price range displays products within that specific range in **horizontal scrolling layout**
- Products displayed in horizontal scrolling format for price range results only
- All other product listings (categories, search results, admin manage products) maintain vertical layout (2 rows mobile, 4 rows other devices)

### 3.8 Offers Display
- **All-Time Offers:**
  - 10+ products in order: ₹40 discount
  - 20+ products in order: ₹80 discount
  - 35+ products in order: ₹150 discount
  - Orders above ₹499: Free delivery
- Offers section positioned prominently with impressive visual design
- Offers displayed before'Explore Products by Price' section
\n### 3.9 Shopping Cart & Checkout
- Add multiple products to cart (requires login)
- View cart summary with quantities and prices
- Direct'Buy Now' option for immediate purchase (requires login)
- Select delivery address from saved addresses
- Apply available offers during checkout
- **Important Instructions Display:** Show order placement guidelines to customers during checkout process
\n### 3.10 In-App Notification System
- **Notification Bell Icon:** Display notification bell icon in top navigation bar with unread count badge
- **Notification Center:** Clicking bell icon opens notification center showing all notifications
- **Notification Types:**
  - Order status updates (Processing, Order Placed, Shipped, Delivered, Cancelled)
  - Return request status updates (Received, Approved, Rejected)
  - Refund processing updates\n  - Promotional offers and discounts
  - New product arrivals
  - Price drop alerts for wishlisted items
  - Admin announcements
- **Notification Display:**
  - Show notification icon, title, message preview, and timestamp
  - Unread notifications highlighted with different background color
  - Mark as read when clicked
  - Delete individual notifications or clear all
- **Real-Time Notifications:** Use WebSocket or Server-Sent Events for instant notification delivery
- **Notification Preferences:** Customers can manage notification settings in Account page:\n  - Enable/disable specific notification types
  - Choose notification delivery method (in-app only, in-app + email)\n  - Set quiet hours (no notifications during specified time)
- **Notification Persistence:** Store notifications in database for 30 days
- **Admin Notification Management:**
  - Send bulk notifications to all customers
  - Send targeted notifications to specific customer segments
  - Schedule notifications for future delivery
  - View notification delivery status and read rates

---

## 4. Payment System

### 4.1 Payment Methods
- Prepaid payments only (no Cash on Delivery)
- Supported methods: Paytm, GPay, UPI, Debit Card, Credit Card\n- Payment gateway integration required\n\n### 4.2 Payment Process
- Use provided UPI QR code (1000074194.jpg) with UPI ID: gokul-rv@indianbank\n- Order amount automatically displayed in selected payment app
- Customer completes payment in payment app
- Customer copies reference number from payment app
- Customer pastes reference number in final payment step
- Order confirmed only after successful payment
- Unique Order ID generated automatically upon payment confirmation
- **Timestamp recorded at order placement** (displayed in both customer order view and admin order management)
- **Push notification sent to customer upon successful order placement**

### 4.3 Pricing & Fees
- Platform fee: ₹10 (applied to all orders)
- Delivery fee: ₹60 (waived for orders above ₹499)
- Free delivery for orders above ₹499
\n### 4.4 Automatic Offers
- Orders with10+ products: ₹40 discount (automatically applied)
- Orders with 20+ products: ₹80 discount (automatically applied)
- Orders with 35+ products: ₹150 discount (automatically applied)\n- Orders above ₹499: Free delivery (automatically applied)

### 4.5 First Order Discount
- **First-time customers only:** 2% discount on first order
- **Device-based restriction:** Discount can only be claimed once per mobile device, even if customer changes email ID
- System tracks device identifier to prevent multiple claims
- Discount automatically applied at checkout for eligible first orders

---

## 5. Order Management

### 5.1 Order Tracking
- Each order assigned unique Order ID
- **Order placement timestamp recorded and displayed** in both customer order view and admin manage orders section
- Order status tracking: Processing, Order Placed, Shipped, Delivered\n- Admin enters tracking details manually\n- Customers can view order status in account section
- **Push notification sent for each order status change**

### 5.2 Delivery Timeline
- Orders will be delivered within 6to 8 days after order confirmation
- If not delivered within 8 days, it may take an extra 1to 3 days to be delivered
\n### 5.3 Order Cancellation
- Customer submits cancellation request\n- Request sent to admin for approval
- Admin approves or rejects cancellation\n- Automated notification of cancellation status via email and push notification
- Order activities tracked automatically with timestamps

---

## 6. Returns & Refund Policy

### 6.1 Return Eligibility
- Only damaged or missing items eligible for return/refund
- Orders below ₹200 not eligible for return or refund
- Return request must be submitted within 12 hours after delivery
- **Return request timestamp recorded and displayed** in both customer return view and admin manage returns section
- Return requests reviewed and managed within 36 hours after submission
- No general returns accepted\n
### 6.2 Return Process for Damaged/Missing Items
- Customer must share unboxing video to tapandbuy.in@gmail.com with Order ID\n- Admin verifies damaged/missing product claim through video evidence
- Products must be unused and in original packaging
- Return requests managed within 36 hours\n- **Push notification sent when return request is received, approved, or rejected**
\n### 6.3 Refund Process
- Refund covers product price only (delivery fee excluded)
- Admin verifies damaged product claim\n- Refunds (if approved) processed to original payment method within 7 business days after inspection
- Admin manages return requests with filtering options (newest, oldest, order ID search, reference number search)
- **Push notification sent when refund is processed**

### 6.4 Rejected Parcel Policy
- If customer denies delivery at doorstep, deductions apply:\n  - 2x shipping fee\n  - 10% packing fee
- Remaining amount refunded to original payment method
\n---

## 7. Customer Care Module

### 7.1 In-App Chatbot
- Automated responses for application-related queries
- Return policy information
- Order tracking by Order ID
- Delivery date inquiries
- Non-application queries receive standard message
\n### 7.2 Agent Support
- For complex issues, customers directed to contact email
- Email support: tapandbuy.in@gmail.com
\n---

## 8. Email Notification System

### 8.1 Automated Email Notifications
Customers receive email notifications for the following events:
\n**Registration & Account Management:**
- Registration confirmation with account details
- Password change confirmation
- Forgot password - random password delivery (temporary password sent via email only, NOT displayed in-app)
\n**Order Lifecycle:**
- **Order Received (Processing):** 'Your order has been received. Order ID: [ID]. Order placed at: [Timestamp]. Please wait for admin to confirm your order.'
- **Order Placed:** 'Your order has been successfully placed. Order ID: [ID]. Order placed at: [Timestamp].' + Admin description from order management
- **Order Shipped:** Shipping confirmation with tracking details and timestamp
- **Order Delivered:** Delivery confirmation with timestamp\n- **Order Cancelled:** Cancellation confirmation with reason (if provided) and timestamp
\n**Returns & Refunds:**
- Return request received confirmation with Order ID and return request timestamp
- Return request approved/rejected notification with timestamps
- Refund processed confirmation with amount and processing date

### 8.2 Email Content Requirements
- Include Order ID in all order-related emails
- **Include timestamp for order placement in all order-related emails**
- **Include timestamp for return request submission in all return-related emails**\n- Include admin-entered descriptions for order placed emails
- Professional formatting with Tap And Buy branding

---

## 9. Technical Requirements

### 9.1 Authentication & Security
- JWT or session-based user authentication
- OTP verification for registration and password updates
- Bcrypt encryption for admin credentials
- Secure admin login embedded in code
- Logout confirmation popup to prevent accidental logout
- Random password generation for forgot password functionality (alphanumeric mix)
- **Temporary password delivery via email only (NOT displayed in-app)**
- Device identifier tracking for first-order discount enforcement
- **Anonymous access to Home Page without forced login**
- **Mandatory login triggers for: Buy Now, Add to Cart, Wishlist, Account access**

### 9.2 Database Structure
- Users (customers and admin)
- Products and categories (with multiple image support)
- Category images (one per category)
- Orders and order tracking with **order placement timestamps**
- Addresses\n- Wishlist items
- Feedback and support tickets
- Search history
- Return/refund requests with **return request timestamps**
- Promotional images (6-7 images)\n- Password reset tokens and temporary passwords
- Device identifiers for first-order tracking
- Email notification logs
- **Push notifications (notification ID, user ID, type, title, message, read status, timestamp)**
- **Notification preferences (user ID, notification type, enabled status, delivery method)**

### 9.3 Admin Dashboard
- Product and category management (up to 5 images per product, 1 image per category)
- Manage Products with device-responsive layout (2 rows mobile, 4 rows laptop/desktop/tablet)
- Manage Returns with filters (newest, oldest, order ID, reference number) and **return request timestamp display**
- Manage Categories displayed in two-row layout
- Order management with filtering (newest, oldest, high price, low price, order ID, Processing, Order Placed)\n- Order count display for each filter status (e.g., 'Processing: 15 orders')
- **Order placement timestamp display** for each order in admin order management
- Return request management\n- Homepage content management\n- Promotional images management (6-7 images upload)
- Customer support interface
- **Notification management: Send bulk/targeted notifications, schedule notifications, view delivery statistics**

### 9.4 Payment Integration
- UPI payment gateway\n- Paytm, GPay integration
- Razorpay or similar payment processor\n- Reference number verification system
\n### 9.5 Search & Recommendation System
- Intelligent search with query analysis
- Search icon display in search bar
- Search recommendations under search bar (including both new and old products)
- Related product recommendations on product detail pages
- Price range filtering with horizontal scrolling display for price range results
- Search history tracking
- 'No product found' message display
- Optimized search performance (eliminate continuous loading)

### 9.6 Responsive Design
- Mobile-friendly interface
- Responsive layout for all screen sizes
- Device-specific product listing layouts:\n  - Mobile: 2 rows (for categories, search results, admin manage products)\n  - Laptop/Desktop/Tablet: 4 rows (for categories, search results, admin manage products)
  - Price range results: Horizontal scrolling layout on all devices
- Optimized navigation for mobile devices
\n### 9.7 Image Navigation System
- Dynamic arrow display based on current image position
- **Optimized image loading:** Transition time under 1 second between images
- Touch/swipe support for mobile devices
- Arrow positioning at vertical center of images
\n### 9.8 Email System
- Reliable email delivery for registration confirmations\n- Proper URL configuration in email templates
- Random password generation and delivery for forgot password requests (email only, NOT in-app)
- Email verification and link validation
- **Automated email notifications for all order status changes with timestamps**
- **Automated email notifications for all return status changes with timestamps**
- Email templates for all notification types

### 9.9 Promotional Image Carousel
- Auto-rotation functionality with 5-second intervals
- Smooth transitions between promotional images
- Automatic cycling through all uploaded promotional images
- Loop back to first image after displaying last image
\n### 9.10 Timestamp Tracking System
- **Record timestamp for order placement**
- **Record timestamp for return request submission**
- **Display order placement timestamp in customer order view**
- **Display order placement timestamp in admin order management**\n- **Display return request timestamp in customer return view**
- **Display return request timestamp in admin return management**
- **Include timestamps in all order-related email notifications**
- **Include timestamps in all return-related email notifications**
- Timezone handling for accurate time display

### 9.11 Push Notification System
- **Real-time notification delivery using WebSocket or Server-Sent Events (SSE)**
- **Notification badge counter on notification bell icon**
- **Browser notification API integration for desktop notifications (with user permission)**
- **Notification sound alerts (optional, user-configurable)**
- **Notification grouping by type and date**
- **Notification expiration after 30 days**
- **Notification delivery tracking and analytics**
- **Fallback to polling mechanism if WebSocket connection fails**
- **Support for notification deep linking (clicking notification navigates to relevant page)**

---

## 10. Testing & Deployment

### 10.1 Initial Testing Phase
- Dummy admin login credentials provided
- Dummy customer login credentials provided
- Sample products and data for testing
- Owner verification before publishing
- Test registration email links and accessibility
- Test password management and forgot password functionality (verify temporary password NOT displayed in-app)
- Test product image navigation arrows and loading speed
- Test promotional image auto-rotation
- Test search functionality (including old and new products, loading performance)
- Test device-responsive product layouts (2 rows mobile, 4 rows other devices for categories/search/admin; horizontal scrolling for price ranges)
- **Test timestamp recording and display for orders**
- **Test timestamp recording and display for return requests**
- **Test email notification delivery for all scenarios with timestamps**
- Test first-order discount and device tracking
- Test admin filter options and order count display
- **Test price range horizontal scrolling layout**
- **Test order and return filtering options**
- **Test push notification delivery for all scenarios**
- **Test notification preferences management**
- **Test real-time notification updates**
- **Test notification bell icon and unread count**
- **Test notification center functionality**
- **Test admin notification management (bulk send, targeted send, scheduling)**
- **Test browser notification permissions and display**
- **Test notification deep linking**
- **Test anonymous access to Home Page**
- **Test mandatory login triggers (Buy Now, Add to Cart, Wishlist, Account)**
- **Test Welcome Page redirection for unauthenticated users**
\n### 10.2 Production Deployment
- Remove all dummy data after approval
- Remove dummy customer login\n- Retain secure admin login
- Verify all email links are accessible
- Verify email notification system is operational with timestamps
- **Verify push notification system is operational**
- **Configure WebSocket/SSE server for production**
- Ready for real-world publishing

---

## 11. Design Style\n
### 11.1 Color Scheme
- Primary colors: White and Green (matching logo green tone)
- Clean, fresh appearance with green accents for CTAs and highlights
- **Notification bell icon in green with red badge for unread count**
\n### 11.2 Visual Elements
- Use provided logo (1000070948.jpg) consistently across pages
- Card-based layout for product displays
- Clear visual hierarchy with green highlights for important actions
- Rounded corners for buttons and cards for modern feel
- Subtle shadows for depth and element separation
- Heart icon in green when product is wishlisted, outlined when not
- Share icon positioned consistently on all product cards
- Search icon displayed inside search bar
- Attractive and impressive offers display section on homepage
- Horizontal scrolling layout for price range exploration, categories, and recently viewed products
- **Navigation arrows:** Green-colored arrows with semi-transparent white background, positioned at vertical center of product images
- **Promotional image transitions:** Smooth fade or slide transitions between images
- **Notification bell icon with animated badge for new notifications**
- **Notification center with clean card-based layout**
- **Unread notifications highlighted with light green background**
\n### 11.3 Layout Style
- Grid-based product layout for easy browsing
- Device-responsive product grids:\n  - Mobile: 2 rows (for categories, search results, admin manage products)
  - Laptop/Desktop/Tablet: 4 rows (for categories, search results, admin manage products)
  - **Price range results: Horizontal scrolling layout on all devices**
- Bottom navigation bar for mobile-first experience
- Clean white backgrounds with green interactive elements
- Spacious layout with adequate padding for readability
- Featured products:30products vertically in two rows (mobile) or four rows (other devices)
- Recently viewed products: 10 products horizontally with scrolling
- Price range options: horizontal scrolling layout\n- Two-row layout for admin management sections (Manage Products, Manage Returns, Manage Categories)
- **Notification center: Dropdown panel from notification bell icon with scrollable list**

---

## 12. Reference Images
- Logo: 1000070948.jpg\n- UPI Payment QR Code: 1000074194.jpg (UPI ID: gokul-rv@indianbank)
- Screenshot References: 1000074574.png, 1000074575.png, 1000074573.png, 1000077497.png, 1000077496.png, 1000077505.png, 1000077504.png\n- Build Error Screenshot: 1000083161.png
\n---

## 13. Implementation Changes Summary

### Modified Files and Features:
\n**1. Returns & Refund Policy (Multiple Files)**
- Updated return policy to require unboxing video submission
- Added 36-hour review timeline for return requests
- Implemented rejected parcel deduction logic (2x shipping + 10% packing fee)
- Added product condition requirements (unused, original packaging)
- Updated refund timeline to 7 business days after inspection
- **Added return request timestamp recording and display**

**2. Search Functionality (SearchBar.js / SearchBar.tsx, SearchResults.js / SearchResults.tsx)**
- Added search icon to search bar
- Fixed search algorithm to include both newly added and older products in suggestions
- Implemented 'No product found' message display\n- Optimized search performance to eliminate continuous loading issue
- Enhanced search result relevance algorithm

**3. Homepage Offers Section (HomePage.js / HomePage.tsx,OffersDisplay.js / OffersDisplay.tsx)**
- Updated offers to quantity-based discounts:\n  - 10+ products: ₹40 off
  - 20+ products: ₹80 off
  - 35+ products: ₹150 off
- Changed free delivery threshold to₹499
- Updated offer display design and messaging
\n**4. Product Listing Layout (ProductList.js / ProductList.tsx, CategoryView.js / CategoryView.tsx, PriceRangeView.js / PriceRangeView.tsx)**
- Implemented responsive grid layout:\n  - Mobile: 2 columns (for categories, search results, admin manage products)
  - Laptop/Desktop/Tablet: 4 columns (for categories, search results, admin manage products)
- **Implemented horizontal scrolling layout for price range results only**
- Applied layout to all product listing pages

**5. Timestamp System (Order.js / Order.tsx, ReturnRequest.js / ReturnRequest.tsx)**
- **Added timestamp recording for order placement**
- **Added timestamp recording for return request submission**
- **Implemented timestamp display in customer order view**
- **Implemented timestamp display in admin order management**
- **Implemented timestamp display in customer return view**
- **Implemented timestamp display in admin return management**
- Added timezone handling\n
**6. Admin Order Management (AdminOrders.js / AdminOrders.tsx)**
- Added 'Order Placed' filter option after 'Processing'\n- Implemented order count display for each filter status
- Enhanced filter UI to show count (e.g., 'Processing: 15 orders')
- Added combined filtering (status + sort by newest/oldest)
- **Added order placement timestamp display for each order**
\n**7. Admin Return Management (AdminReturns.js / AdminReturns.tsx)**
- Added newest/oldest sorting options
- Added order ID search functionality
- Added reference number search functionality
- Enhanced filter UI consistency
- **Added return request timestamp display for each return request**

**8. Product Image Navigation (ProductDetail.js / ProductDetail.tsx)**
- Optimized image loading performance (target: under 1 second transition)
- Implemented image preloading for adjacent images
- Enhanced arrow click handlers for faster response
- Added loading state management
\n**9. Checkout Instructions (Checkout.js / Checkout.tsx)**
- Added prominent display of order placement guidelines
- Included return policy summary
- Added rejected parcel policy notice
- Implemented collapsible instructions section
\n**10. Email Notification System (services/emailService.js, email-templates/)**
- Created email templates for all notification types:\n  - Registration confirmation
  - Password change\n  - Order received (processing) **with order placement timestamp**
  - Order placed (with admin description) **with order placement timestamp**
  - Order shipped **with timestamp**
  - Order delivered **with timestamp**
  - Order cancelled **with timestamp**
  - Return request received **with return request timestamp**
  - Return approved/rejected **with timestamps**
  - Refund processed **with processing date**
- Implemented automated email sending for all events
- **Added Order ID and timestamp to all order-related emails**
- **Added return request timestamp to all return-related emails**

**11. First Order Discount System (Checkout.js / Checkout.tsx, models/User.js, models/Device.js)**
- Implemented device identifier tracking\n- Added 2% first-order discount logic
- Created device-based restriction to prevent multiple claims
- Added discount display in checkout summary
- Implemented database schema for device tracking

**12. Homepage Layout (HomePage.js / HomePage.tsx, PriceRangeExplorer.js / PriceRangeExplorer.tsx)**
- **Updated price range options to: Under ₹20, ₹20-₹50, ₹50-₹100, ₹100-₹200, ₹200-₹500, ₹500-₹800, ₹800-₹1000, Above ₹1000**
- Ensured horizontal scrolling for:\n  - Price range exploration section
  - Recently viewed products section
- **Ensured price range results display in horizontal scrolling layout**
- Maintained vertical two-row layout for featured products on mobile
- Maintained vertical four-row layout for featured products on other devices

**13. Database Schema Updates (models/)**
- **Added order_placed_timestamp field to Order model**
- **Added return_requested_timestamp field to ReturnRequest model**
- Created Device model for first-order tracking
- Added email notification log table
- Updated User model for device association
- **Added Notification model (notification_id, user_id, type, title, message, read_status, created_at)**
- **Added NotificationPreference model (user_id, notification_type, enabled, delivery_method)**
\n**14. Backend API Endpoints (routes/, controllers/)**
- **Updated order creation endpoint to record order placement timestamp**
- **Updated return request endpoint to record return request timestamp**
- Added device tracking endpoints
- Added first-order discount validation endpoint
- Enhanced search endpoint for improved performance
- **Added email notification trigger endpoints with timestamp inclusion**
- **Added push notification endpoints:**
  - POST /api/notifications/send (admin sends notification)
  - GET /api/notifications (customer fetches notifications)
  - PUT /api/notifications/:id/read (mark notification as read)
  - DELETE /api/notifications/:id (delete notification)
  - DELETE /api/notifications/clear-all (clear all notifications)
  - GET /api/notifications/preferences (get notification preferences)
  - PUT /api/notifications/preferences (update notification preferences)

**15. Push Notification System (NEW)**
- **Created NotificationBell.js / NotificationBell.tsx component**
  - Display bell icon with unread count badge
  - Open notification center dropdown on click
  - Real-time badge update\n- **Created NotificationCenter.js / NotificationCenter.tsx component**\n  - Display all notifications in scrollable list
  - Show notification icon, title, message preview, timestamp
  - Highlight unread notifications\n  - Mark as read on click
  - Delete individual notifications
  - Clear all notifications button
- **Created NotificationPreferences.js / NotificationPreferences.tsx component**
  - Toggle notification types on/off
  - Select delivery method (in-app only, in-app + email)\n  - Set quiet hours\n- **Created WebSocket/SSE service (services/notificationService.js)**
  - Establish real-time connection
  - Listen for notification events
  - Update notification state
  - Handle connection errors and reconnection
- **Created notification trigger functions (utils/notificationTriggers.js)**
  - Trigger notifications for order status changes
  - Trigger notifications for return status changes
  - Trigger notifications for promotional offers
  - Trigger notifications for admin announcements
- **Created AdminNotificationPanel.js / AdminNotificationPanel.tsx**
  - Send bulk notifications to all customers
  - Send targeted notifications to customer segments
  - Schedule notifications for future delivery
  - View notification delivery statistics
- **Integrated browser notification API**
  - Request notification permission on first login
  - Display desktop notifications for important events
  - Handle notification click to navigate to relevant page
\n**16. Password Recovery System (NEW - services/passwordService.js, components/ForgotPassword.js / ForgotPassword.tsx)**\n- **Modified forgot password flow to send temporary password via email only**
- **Removed in-app display of temporary password**
- **Added user feedback message: 'A temporary password has been sent to your registered email. Please check your inbox to proceed.'**
- **Updated email template for temporary password delivery**
- **Ensured temporary password is NOT shown in push notifications or in-app messages**

**17. Anonymous Access & Mandatory Login System (NEW - App.js / App.tsx, AuthGuard.js / AuthGuard.tsx, WelcomePage.js / WelcomePage.tsx)**
- **Implemented anonymous access to Home Page without forced login**
- **Created Welcome Page with Log In and Register options**
- **Added authentication guards for specific actions:**
  - Buy Now button click\n  - Add to Cart button click
  - Wishlist heart icon click
  - Account option in bottom navigation
- **Implemented redirection to Welcome Page for unauthenticated users attempting protected actions**
- **Updated navigation logic to allow free exploration before authentication**
- **Modified HomePage.js / HomePage.tsx to allow anonymous browsing**
- **Modified ProductDetail.js / ProductDetail.tsx to trigger login for Buy Now, Add to Cart, Wishlist**
- **Modified BottomNavigation.js / BottomNavigation.tsx to trigger login for Account access**

---

## 14. Complete Application Testing Checklist

### 14.1 User Authentication & Registration
- [ ] **Anonymous user can access Home Page without login**
- [ ] **Anonymous user can browse products, categories, and search**
- [ ] **Anonymous user redirected to Welcome Page when clicking Buy Now**
- [ ] **Anonymous user redirected to Welcome Page when clicking Add to Cart**
- [ ] **Anonymous user redirected to Welcome Page when clicking Wishlist heart icon**
- [ ] **Anonymous user redirected to Welcome Page when clicking Account option**
- [ ] **Welcome Page displays Log In and Register options clearly**
- [ ] Customer registration with email\n- [ ] Customer registration with phone number
- [ ] OTP verification for email registration
- [ ] OTP verification for phone registration
- [ ] Registration confirmation email delivery and link accessibility
- [ ] Customer login with valid credentials
- [ ] Customer login with invalid credentials (error handling)
- [ ] Admin login with valid credentials
- [ ] Admin login with invalid credentials (error handling)
- [ ] Logout confirmation popup functionality
- [ ] Logout cancellation (clicking'No')
- [ ] Successful logout (clicking 'Yes')
- [ ] Session persistence across page refreshes
\n### 14.2 Password Management
- [ ] Change password with correct current password
- [ ] Change password with incorrect current password (error handling)
- [ ] Password confirmation validation
- [ ] Forgot password popup display
- [ ] **Random password generation and email delivery (NOT displayed in-app)**
- [ ] **User feedback message displayed: 'A temporary password has been sent to your registered email. Please check your inbox to proceed.'**
- [ ] **Verify temporary password is NOT shown in push notifications**
- [ ] **Verify temporary password is NOT shown in any in-app message**
- [ ] Login with random password received via email
- [ ] Change random password to custom password
- [ ] Password change confirmation email\n\n### 14.3 Product Browsing & Search
- [ ] Homepage featured products display (30 products, correct layout per device)
- [ ] Recently viewed products display (10 products, horizontal scrolling)
- [ ] Search icon display in search bar
- [ ] Search functionality with valid product names
- [ ] Search suggestions display (including old and new products)
- [ ] Search history tracking and display
- [ ] Click on search history to repeat search
- [ ] Intelligent search (e.g., 'products under50 rupees')
- [ ] 'No product found' message for invalid searches
- [ ] Search performance (no continuous loading)
- [ ] Category browsing (horizontal scrolling)
- [ ] Category product listing (2 rows mobile, 4 rows other devices)\n- [ ] **Price range exploration (horizontal scrolling with updated ranges: Under ₹20, ₹20-₹50, ₹50-₹100, ₹100-₹200, ₹200-₹500, ₹500-₹800, ₹800-₹1000, Above ₹1000)**
- [ ] **Price range filtering accuracy with horizontal scrolling display**
- [ ] Product detail page display\n- [ ] Product image navigation arrows display
- [ ] Product image transition speed (under 1 second)
- [ ] Product image navigation on mobile (swipe support)
- [ ] Related product recommendations\n\n### 14.4 Wishlist & Sharing
- [ ] **Anonymous user redirected to Welcome Page when clicking wishlist heart icon**
- [ ] Add product to wishlist (heart icon) after login
- [ ] Remove product from wishlist\n- [ ] Wishlist persistence across sessions
- [ ] Wishlist page display from Account section
- [ ] Add to cart from wishlist page
- [ ] Share product functionality (social media, messaging, copy link)
- [ ] **Push notification for price drop on wishlisted items**
\n### 14.5 Shopping Cart & Checkout
- [ ] **Anonymous user redirected to Welcome Page when clicking Add to Cart**\n- [ ] **Anonymous user redirected to Welcome Page when clicking Buy Now**
- [ ] Add product to cart after login
- [ ] Update product quantity in cart
- [ ] Remove product from cart
- [ ] Cart summary accuracy
- [ ] 'Buy Now' direct purchase option after login
- [ ] Add delivery address\n- [ ] Edit delivery address
- [ ] Delete delivery address
- [ ] Select delivery address during checkout
- [ ] Platform fee calculation (₹10)\n- [ ] Delivery fee calculation (₹60or free above ₹499)
- [ ] Quantity-based discount application:\n  - [ ] 10+ products: ₹40 off
  - [ ] 20+ products: ₹80 off
  - [ ] 35+ products: ₹150 off
- [ ] Free delivery for orders above ₹499
- [ ] First-order discount (2% for first-time customers)
- [ ] Device-based first-order restriction (one per device)
- [ ] Order placement instructions display
- [ ] Checkout summary accuracy
\n### 14.6 Payment Processing
- [ ] UPI QR code display (1000074194.jpg)
- [ ] UPI ID display (gokul-rv@indianbank)
- [ ] Order amount display in payment app
- [ ] Reference number input field
- [ ] Payment confirmation with valid reference number
- [ ] Payment rejection with invalid reference number
- [ ] Order ID generation after successful payment
- [ ] **Timestamp recording at order placement**
- [ ] **Order confirmation email delivery with timestamp**
- [ ] **Push notification sent upon successful order placement**
\n### 14.7 Order Management (Customer)
- [ ] Order history display
- [ ] Order details display with Order ID
- [ ] **Order timestamp display in customer order view**
- [ ] Order status tracking (Processing, Order Placed, Shipped, Delivered)\n- [ ] Order cancellation request submission
- [ ] Order cancellation confirmation email
- [ ] Tracking details display (when provided by admin)
- [ ] **Push notification for each order status change**
\n### 14.8 Order Management (Admin)
- [ ] View all orders
- [ ] Filter orders by newest\n- [ ] Filter orders by oldest
- [ ] Filter orders by high price
- [ ] Filter orders by low price
- [ ] Filter orders by Processing status
- [ ] Filter orders by Order Placed status
- [ ] Order count display for each filter
- [ ] Search orders by Order ID
- [ ] **Order placement timestamp display in admin order management**
- [ ] Enter tracking details\n- [ ] Update order status
- [ ] Approve order cancellation
- [ ] Reject order cancellation
- [ ] **Send order status update emails with timestamps**
- [ ] **Send push notifications for order status updates**

### 14.9 Returns & Refunds (Customer)
- [ ] Submit return request within 12 hours of delivery
- [ ] Return request blocked after 12 hours
- [ ] Return request blocked for orders below ₹200
- [ ] **Return request timestamp recording**
- [ ] **Return request confirmation email with timestamp**
- [ ] Unboxing video submission instructions
- [ ] Return status tracking\n- [ ] **Refund confirmation email with processing date**
- [ ] **Push notification when return request is received, approved, or rejected**
- [ ] **Push notification when refund is processed**\n
### 14.10 Returns & Refunds (Admin)
- [ ] View all return requests\n- [ ] Filter returns by newest
- [ ] Filter returns by oldest
- [ ] Search returns by Order ID
- [ ] Search returns by reference number
- [ ] **Return request timestamp display in admin return management**
- [ ] Approve return request
- [ ] Reject return request
- [ ] Process refund (product price only, excluding delivery fee)
- [ ] Refund timeline (7 business days after inspection)
- [ ] **Send return status update emails with timestamps**
- [ ] **Send push notifications for return status updates**

### 14.11 Rejected Parcel Handling
- [ ] Deduction calculation (2x shipping + 10% packing fee)
- [ ] Refund calculation for rejected parcels
- [ ] Rejected parcel notification email
\n### 14.12 Email Notification System
- [ ] Registration confirmation email
- [ ] Password change confirmation email
- [ ] **Forgot password email (random password) - verify NOT displayed in-app**
- [ ] **Order received email (Processing status) with order placement timestamp**
- [ ] **Order placed email (with admin description) with order placement timestamp**
- [ ] **Order shipped email with timestamp**
- [ ] **Order delivered email with timestamp**
- [ ] **Order cancelled email with timestamp**
- [ ] **Return request received email with return request timestamp**
- [ ] **Return approved email with timestamps**
- [ ] **Return rejected email with timestamps**
- [ ] **Refund processed email with processing date**
- [ ] **Email content accuracy (Order ID, timestamps, descriptions)**
- [ ] Email formatting and branding
\n### 14.13 Push Notification System
- [ ] **Notification bell icon display in top navigation**
- [ ] **Unread notification count badge display**
- [ ] **Notification center opens on bell icon click**
- [ ] **All notifications display in notification center**
- [ ] **Unread notifications highlighted**
- [ ] **Mark notification as read on click**
- [ ] **Delete individual notification**
- [ ] **Clear all notifications**
- [ ] **Real-time notification delivery (WebSocket/SSE)**
- [ ] **Push notification for order placement**
- [ ] **Push notification for order status changes**
- [ ] **Push notification for return request status**
- [ ] **Push notification for refund processing**
- [ ] **Push notification for promotional offers**
- [ ] **Push notification for new product arrivals**
- [ ] **Push notification for price drop on wishlisted items**\n- [ ] **Push notification for admin announcements**
- [ ] **Verify temporary password is NOT sent via push notification**
- [ ] **Notification preferences page access from Account**
- [ ] **Enable/disable specific notification types**
- [ ] **Choose notification delivery method (in-app only, in-app + email)**
- [ ] **Set quiet hours for notifications**
- [ ] **Browser notification permission request**
- [ ] **Desktop notification display (with user permission)**
- [ ] **Notification click navigates to relevant page (deep linking)**
- [ ] **Notification sound alerts (optional, user-configurable)**
- [ ] **Notification persistence (30 days)**
- [ ] **Notification grouping by type and date**
- [ ] **Admin bulk notification sending**
- [ ] **Admin targeted notification sending (customer segments)**
- [ ] **Admin notification scheduling**
- [ ] **Admin notification delivery statistics**
- [ ] **WebSocket connection error handling and reconnection**
- [ ] **Fallback to polling if WebSocket fails**
\n### 14.14 Admin Product Management
- [ ] Add product category with image
- [ ] Edit product category
- [ ] Delete product category
- [ ] Add product with up to 5 images
- [ ] Edit product details
- [ ] Delete product\n- [ ] Product listing layout (2 rows mobile, 4 rows other devices)
- [ ] Upload promotional images (6-7 images)
- [ ] Edit promotional images
- [ ] Delete promotional images
- [ ] Promotional image auto-rotation (5-second intervals)
- [ ] Change application logo
\n### 14.15 Customer Care & Chatbot
- [ ] Chatbot access from bottom navigation
- [ ] Automated responses for application queries
- [ ] Return policy information in chatbot
- [ ] Order tracking by Order ID in chatbot
- [ ] Delivery date inquiries in chatbot
- [ ] Standard message for non-application queries
- [ ] Email support contact display
\n### 14.16 Responsive Design
- [ ] Mobile layout (all pages)
- [ ] Tablet layout (all pages)
- [ ] Laptop layout (all pages)
- [ ] Desktop layout (all pages)\n- [ ] Product listing: 2 rows on mobile (categories, search, admin)\n- [ ] Product listing: 4 rows on laptop/desktop/tablet (categories, search, admin)
- [ ] **Price range results: Horizontal scrolling on all devices**
- [ ] Horizontal scrolling sections (categories, price ranges, recently viewed)
- [ ] Bottom navigation functionality on mobile
- [ ] Touch/swipe support for image navigation
- [ ] **Notification bell icon responsive display**
- [ ] **Notification center responsive layout**
\n### 14.17 Performance & Optimization
- [ ] Page load times (under 3 seconds)
- [ ] Image loading optimization
- [ ] Product image transition speed (under 1 second)
- [ ] Search performance (no continuous loading)
- [ ] Promotional image carousel smooth transitions
- [ ] Database query optimization
- [ ] API response times
- [ ] **WebSocket/SSE connection performance**
- [ ] **Notification delivery latency (under 2 seconds)**
\n### 14.18 Security & Data Protection
- [ ] Admin credentials encryption (bcrypt)
- [ ] JWT/session token security
- [ ] OTP expiration handling
- [ ] Password strength validation
- [ ] SQL injection prevention
- [ ] XSS attack prevention
- [ ] CSRF protection
- [ ] Secure payment reference number handling
- [ ] Device identifier privacy compliance
- [ ] **WebSocket connection authentication**
- [ ] **Notification data encryption**
- [ ] **Temporary password secure generation and transmission**
\n### 14.19 Edge Cases & Error Handling
- [ ] Empty cart checkout attempt
- [ ] Invalid delivery address
- [ ] Payment failure handling
- [ ] Network error handling
- [ ] Session timeout handling
- [ ] Duplicate order prevention
- [ ] Concurrent order modification handling
- [ ] Image upload size limits
- [ ] Invalid file type uploads
- [ ] Database connection failures
- [ ] **WebSocket connection failure handling**
- [ ] **Notification delivery failure handling**
- [ ] **Browser notification permission denial**
- [ ] **Anonymous user attempting protected actions**

### 14.20 Cross-Browser Compatibility
- [ ] Chrome (desktop and mobile)
- [ ] Firefox (desktop and mobile)
- [ ] Safari (desktop and mobile)
- [ ] Edge (desktop)\n- [ ] Opera (desktop and mobile)
- [ ] **Browser notification API compatibility**
\n### 14.21 Final Pre-Launch Checks
- [ ] Remove all dummy data
- [ ] Remove dummy customer login
- [ ] Verify admin login credentials
- [ ] Verify email configuration
- [ ] Verify payment gateway configuration
- [ ] Verify UPI QR code and ID\n- [ ] Verify all email links accessibility
- [ ] Verify logo display (1000070948.jpg)
- [ ] Verify contact email (tapandbuy.in@gmail.com)
- [ ] Verify all reference images
- [ ] Database backup\n- [ ] SSL certificate installation
- [ ] Domain configuration
- [ ] Privacy policy and terms of service
- [ ] GDPR compliance (if applicable)
- [ ] **WebSocket/SSE server configuration for production**
- [ ] **Notification system load testing**
- [ ] **Verify anonymous access and mandatory login triggers**
- [ ] **Verify temporary password is NOT displayed in-app**
- [ ] Owner final approval\n
---

**End of Requirements Document**

---\n
# CHANGES_SUMMARY.md

## Summary of Changes Made to Requirements Document

### Change Request 1: Password Recovery and Reset (Off-App Temporary Password Delivery)

**What Changed:**
- Modified the password recovery flow to ensure temporary passwords are sent ONLY via email and are NOT displayed within the application interface.\n- Added explicit user feedback message:'A temporary password has been sent to your registered email. Please check your inbox to proceed.'
- Ensured temporary passwords are NOT shown in push notifications or any in-app messages.

**Files Modified:**
1. **Section 2.3 Customer Role - Password Recovery and Reset**
   - Added new subsection detailing off-app temporary password delivery
   - Specified that temporary password must NOT be displayed in-app
   - Added user feedback message requirement

2. **Section 9.1 Authentication & Security**
   - Added requirement:'Temporary password delivery via email only (NOT displayed in-app)'
\n3. **Section 13Implementation Changes Summary - Item 16(NEW)**
   - Added new entry: 'Password Recovery System'
   - Listed modified files: services/passwordService.js, components/ForgotPassword.js / ForgotPassword.tsx
   - Detailed changes: Modified forgot password flow, removed in-app display, added user feedback message, updated email template

4. **Section 14.2 Password Management (Testing Checklist)**
   - Added test cases:\n     - Random password generation and email delivery (NOT displayed in-app)
     - User feedback message displayed\n     - Verify temporary password is NOT shown in push notifications
     - Verify temporary password is NOT shown in any in-app message
\n5. **Section 14.13 Push Notification System (Testing Checklist)**
   - Added test case: 'Verify temporary password is NOT sent via push notification'

6. **Section 14.18 Security & Data Protection (Testing Checklist)**
   - Added test case: 'Temporary password secure generation and transmission'

---

### Change Request 2: Anonymous Access and Mandatory Login Triggers\n
**What Changed:**\n- Implemented anonymous access to the Home Page without forced login/registration
- Users can freely explore products, categories, and search without authentication
- Mandatory login is triggered only when users attempt specific actions: Buy Now, Add to Cart, Wishlist, or Account access
- Users are redirected to a Welcome Page (with Log In and Register options) when attempting protected actions

**Files Modified:**
1. **Section 2.1 Initial Landing Page & Anonymous Access (NEW)**
   - Replaced previous'Initial Landing Page' section\n   - Added 'Anonymous Exploration' subsection: Users directed to Home Page without forced login
   - Added 'Mandatory Authentication Triggers' subsection: Listed four protected actions (Buy Now, Add to Cart, Wishlist, Account)\n   - Specified redirection to Welcome Page for unauthenticated users
\n2. **Section 3.1 Bottom Navigation Menu**
   - Updated Cart description: Added '(requires login if not authenticated)'\n   - Updated Account description: Added '(requires login if not authenticated)'
\n3. **Section 3.4 Product Interaction Features**
   - Updated Wishlist Heart Icon description: Added '(requires login)'
\n4. **Section 3.9 Shopping Cart & Checkout**
   - Updated 'Add multiple products to cart': Added '(requires login)'
   - Updated 'Direct Buy Now option': Added '(requires login)'\n\n5. **Section 9.1 Authentication & Security**\n   - Added requirements:\n     - 'Anonymous access to Home Page without forced login'\n     - 'Mandatory login triggers for: Buy Now, Add to Cart, Wishlist, Account access'
\n6. **Section 13 Implementation Changes Summary - Item 17 (NEW)**
   - Added new entry: 'Anonymous Access & Mandatory Login System'
   - Listed modified files: App.js / App.tsx, AuthGuard.js / AuthGuard.tsx, WelcomePage.js / WelcomePage.tsx, HomePage.js / HomePage.tsx, ProductDetail.js / ProductDetail.tsx,BottomNavigation.js / BottomNavigation.tsx\n   - Detailed changes: Implemented anonymous access, created Welcome Page, added authentication guards, implemented redirection logic, modified navigation logic

7. **Section 14.1 User Authentication & Registration (Testing Checklist)**
   - Added test cases at the beginning:\n     - Anonymous user can access Home Page without login
     - Anonymous user can browse products, categories, and search
     - Anonymous user redirected to Welcome Page when clicking Buy Now
     - Anonymous user redirected to Welcome Page when clicking Add to Cart
     - Anonymous user redirected to Welcome Page when clicking Wishlist heart icon
     - Anonymous user redirected to Welcome Page when clicking Account option
     - Welcome Page displays Log In and Register options clearly
\n8. **Section 14.4 Wishlist & Sharing (Testing Checklist)**
   - Added test case: 'Anonymous user redirected to Welcome Page when clicking wishlist heart icon'

9. **Section 14.5 Shopping Cart & Checkout (Testing Checklist)**
   - Added test cases:
     - Anonymous user redirected to Welcome Page when clicking Add to Cart
     - Anonymous user redirected to Welcome Page when clicking Buy Now
\n10. **Section 14.19 Edge Cases & Error Handling (Testing Checklist)**
    - Added test case: 'Anonymous user attempting protected actions'

11. **Section 14.21 Final Pre-Launch Checks (Testing Checklist)**
    - Added test cases:
      - Verify anonymous access and mandatory login triggers\n      - Verify temporary password is NOT displayed in-app
\n---

### Additional Changes:\n- **Section 12Reference Images**: Added new reference image '1000083161.png' (Build Error Screenshot)
\n---

## Files Modified Summary:\n
### Password Recovery Changes:
- services/passwordService.js
- components/ForgotPassword.js / ForgotPassword.tsx\n- email-templates/ (temporary password email template)

### Anonymous Access & Mandatory Login Changes:
- App.js / App.tsx
- AuthGuard.js / AuthGuard.tsx (NEW)
- WelcomePage.js / WelcomePage.tsx (NEW)
- HomePage.js / HomePage.tsx\n- ProductDetail.js / ProductDetail.tsx
- BottomNavigation.js / BottomNavigation.tsx\n\n---

**End of Changes Summary**