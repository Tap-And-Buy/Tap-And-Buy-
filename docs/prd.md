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
\n### 2.1 Initial Landing Page
When opening the website, three options are displayed:
- Admin Login
- Customer Registration
- Customer Login
\n### 2.2 Admin Role
**Login Credentials:** Embedded in code with bcrypt encryption (credentials to be provided separately)

**Capabilities:**
- Add, edit, and remove product categories and products
- Add and manage homepage promotional images
- Change application logo
- View all customer orders with filters (newest, oldest, high price, low price, order ID search)
- Manage return/refund requests with filters (newest, oldest)\n- Handle customer feedback and support messages
- Enter tracking details and order information manually
- Approve or reject order cancellation requests
- Access order management dashboard

### 2.3 Customer Role
**Registration & Login:**
- Register using email or phone number
- OTP verification via email or phone (customer selects preferred method)
- Login with registered credentials

**Capabilities:**
- Browse and search products with search history display
- View product details (images, description, price, offers)
- Share products via share button on product page
- Add products to wishlist by clicking heart icon on product page
- View and manage wishlist items from Account page
- Add products to cart or use'Buy Now' option
- Add and manage multiple delivery addresses
- Select delivery address during checkout
- Make prepaid payments only
- View order history and order details with unique Order ID
- Track order status\n- Submit return requests for damaged products (within 12 hours of delivery)
- Submit order cancellation requests
- Update password and account details with OTP verification
- Use in-app chatbot for order inquiries

---

## 3. Website Features

### 3.1 Bottom Navigation Menu
- **Home:** Featured products, trending items, recently visited products
- **Categories:** Browse products by category\n- **Cart:** View added items, quantities, and proceed to checkout
- **Account:** Login, profile management, order history, saved addresses, wishlist access
- **Customer Care:** Order inquiries and support\n\n### 3.2 Product Management
- Admin can add product categories\n- Admin can add products with images, descriptions, and pricing
- No pre-populated product list
- Dummy products for initial testing (to be removed before publishing)

### 3.3 Product Interaction Features
- **Share Button:** Each product displays a share button allowing customers to share product details via social media, messaging apps, or copy link
- **Wishlist Heart Icon:** Each product displays a heart icon that customers can click to add/remove products from their wishlist
- Heart icon fills with color when product is added to wishlist
- Wishlist items persist across sessions for logged-in users
\n### 3.4 Wishlist Page
- Wishlist option is located within the Account page
- When customer clicks on Wishlist option in Account page, a dedicated wishlist page displays all wishlisted products
- Wishlist page shows product images, names, prices, and heart icons
- Customers can remove items from wishlist by clicking the filled heart icon
- Customers can add wishlisted products to cart directly from wishlist page

### 3.5 Search & History
- Search functionality with search history display
- Click on search history to repeat searches
- Recently visited products displayed on homepage
\n### 3.6 Shopping Cart & Checkout
- Add multiple products to cart
- View cart summary with quantities and prices
- Direct'Buy Now' option for immediate purchase
- Select delivery address from saved addresses
- Apply available offers during checkout
\n---

## 4. Payment System

### 4.1 Payment Methods
- Prepaid payments only (no Cash on Delivery)
- Supported methods: Paytm, GPay, UPI, Debit Card, Credit Card\n- Payment gateway integration required

### 4.2 Payment Process
- Use provided UPI QR code (1000074194.jpg) with UPI ID: gokul-rv@indianbank\n- Order amount automatically displayed in selected payment app
- Customer completes payment in payment app
- Customer copies reference number from payment app
- Customer pastes reference number in final payment step
- Order confirmed only after successful payment
- Unique Order ID generated automatically upon payment confirmation

### 4.3 Pricing & Fees
- Platform fee: ₹10 (applied to all orders)
- Delivery fee: ₹60 (waived for orders above ₹500)
- Free delivery for orders above ₹500
\n### 4.4 Automatic Offers
- Orders above ₹700:₹40 discount (if offer selected)
- Orders above ₹1200: ₹100 discount (if offer selected)
- Orders above ₹2500: ₹150 discount (if offer selected)
- Discounts applied only when customer selects the offer

---

## 5. Order Management

### 5.1 Order Tracking\n- Each order assigned unique Order ID
- Order status tracking: processing, shipped, delivered\n- Admin enters tracking details manually
- Customers can view order status in account section

### 5.2 Delivery Timeline
- Orders will be delivered within 6to 8 days after order confirmation
- If not delivered within 8 days, it may take an extra 1to 3 days to be delivered
\n### 5.3 Order Cancellation
- Customer submits cancellation request\n- Request sent to admin for approval
- Admin approves or rejects cancellation
- Automated notification of cancellation status
- Order activities tracked automatically

---

## 6. Returns & Refund Policy

### 6.1 Return Eligibility
- Only damaged products eligible for return/refund
- Orders below ₹200 not eligible for return or refund
- Return request must be submitted within 12 hours after delivery
- No general returns accepted

### 6.2 Refund Process
- Refund covers product price only (delivery fee excluded)
- Admin verifies damaged product claim
- Refund processed after verification
- Admin manages return requests with filtering options
\n---

## 7. Customer Care Module

### 7.1 In-App Chatbot
- Automated responses for application-related queries
- Return policy information
- Order tracking by Order ID
- Delivery date inquiries
- Non-application queries receive standard message

### 7.2 Agent Support
- For complex issues, customers directed to contact email
- Email support: tapandbuy.in@gmail.com
\n---

## 8. Technical Requirements

### 8.1 Authentication & Security
- JWT or session-based user authentication
- OTP verification for registration and password updates
- Bcrypt encryption for admin credentials
- Secure admin login embedded in code

### 8.2 Database Structure
- Users (customers and admin)
- Products and categories
- Orders and order tracking
- Addresses\n- Wishlist items
- Feedback and support tickets
- Search history
- Return/refund requests

### 8.3 Admin Dashboard
- Product and category management
- Order management with filtering
- Return request management
- Homepage content management
- Customer support interface

### 8.4 Payment Integration
- UPI payment gateway\n- Paytm, GPay integration
- Razorpay or similar payment processor
- Reference number verification system

### 8.5 Responsive Design
- Mobile-friendly interface\n- Responsive layout for all screen sizes
- Optimized navigation for mobile devices
\n---

## 9. Testing & Deployment

### 9.1 Initial Testing Phase
- Dummy admin login credentials provided
- Dummy customer login credentials provided
- Sample products and data for testing
- Owner verification before publishing

### 9.2 Production Deployment
- Remove all dummy data after approval
- Remove dummy customer login\n- Retain secure admin login
- Ready for real-world publishing

---

## 10. Design Style\n
### 10.1 Color Scheme
- Primary colors: White and Green (matching logo green tone)
- Clean, fresh appearance with green accents for CTAs and highlights
\n### 10.2 Visual Elements
- Use provided logo (1000070948.jpg) consistently across pages
- Card-based layout for product displays
- Clear visual hierarchy with green highlights for important actions
- Rounded corners for buttons and cards for modern feel
- Subtle shadows for depth and element separation
- Heart icon in green when product is wishlisted, outlined when not
- Share icon positioned consistently on all product cards

### 10.3 Layout Style
- Grid-based product layout for easy browsing
- Bottom navigation bar for mobile-first experience
- Clean white backgrounds with green interactive elements
- Spacious layout with adequate padding for readability
\n---

## 11. Reference Images
- Logo: 1000070948.jpg\n- UPI Payment QR Code: 1000074194.jpg (UPI ID: gokul-rv@indianbank)
- Screenshot References: 1000074574.png, 1000074575.png, 1000074573.png
