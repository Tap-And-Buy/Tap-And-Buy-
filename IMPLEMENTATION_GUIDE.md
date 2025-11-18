# Implementation Guide for Tap And Buy

This guide provides detailed instructions for implementing the remaining features of the Tap And Buy eCommerce platform.

## Current State

✅ **Working:**
- Database schema and API layer
- Authentication (login, register, OTP)
- Home page with product display
- Bottom navigation
- Routing structure

⚠️ **Needs Implementation:**
- All customer shopping flow pages
- All admin management pages
- Image upload functionality
- Payment processing
- Order tracking
- Return management
- Customer support chatbot

## Implementation Order

### Phase 1: Core Shopping Flow (CRITICAL)

#### 1. Product Detail Page (`src/pages/ProductDetail.tsx`)
```typescript
// Key features to implement:
- Get product ID from URL params
- Fetch product details from db.products.getById()
- Display image gallery (use Carousel component)
- Show product name, description, price
- Add to Cart button → db.cart.addItem()
- Buy Now button → navigate to /checkout with product
- Track view → db.recentlyViewed.add()
```

#### 2. Cart Page (`src/pages/Cart.tsx`)
```typescript
// Key features:
- Fetch cart items from db.cart.getItems()
- Display each item with image, name, price, quantity
- Quantity controls → db.cart.updateQuantity()
- Remove button → db.cart.removeItem()
- Calculate subtotal
- Show platform fee (₹10) and delivery fee (₹60 or FREE)
- Proceed to Checkout button
```

#### 3. Checkout Page (`src/pages/Checkout.tsx`)
```typescript
// Key features:
- Fetch addresses from db.addresses.getAll()
- Select delivery address (radio buttons)
- Link to add new address
- Display order summary with all items
- Calculate:
  * Subtotal
  * Platform fee: ₹10
  * Delivery fee: ₹60 (FREE if subtotal > ₹500)
  * Available discounts:
    - ₹40 off if > ₹700
    - ₹100 off if > ₹1200
    - ₹150 off if > ₹2500
  * Final total
- Offer selection (checkbox for discount)
- Proceed to Payment button
```

#### 4. Payment Page (`src/pages/Payment.tsx`)
```typescript
// Key features:
- Receive order details from navigation state
- Display UPI QR code (/upi-qr.jpg)
- Show UPI ID: gokul-rv@indianbank
- Display total amount prominently
- Instructions:
  1. Scan QR code or use UPI ID
  2. Amount will auto-fill
  3. Complete payment in your app
  4. Copy payment reference number
  5. Paste reference number here
- Input field for reference number
- Confirm Payment button
- On confirm:
  * Create order with db.orders.create()
  * Clear cart with db.cart.clear()
  * Navigate to /order/{orderId}
```

### Phase 2: User Management

#### 5. Addresses Page (`src/pages/Addresses.tsx`)
```typescript
// Key features:
- List all addresses from db.addresses.getAll()
- Add New Address button → Dialog with form
- Edit button for each address
- Delete button with confirmation
- Set as Default button
- Form fields:
  * Full name
  * Phone number
  * Address line 1
  * Address line 2
  * City
  * State
  * PIN code
  * Address type (Home/Work/Other)
```

#### 6. Account Page (`src/pages/Account.tsx`)
```typescript
// Key features:
- Display user profile info
- Edit profile button
- Change password button (requires OTP)
- Navigation cards:
  * My Orders
  * My Addresses
  * Customer Support
- Logout button
```

#### 7. Orders Page (`src/pages/Orders.tsx`)
```typescript
// Key features:
- Fetch orders from db.orders.getAll()
- Display order cards with:
  * Order ID (TAB######)
  * Order date
  * Total amount
  * Status badge (processing/shipped/delivered)
  * View Details button
- Search by Order ID
- Filter by status
```

#### 8. Order Detail Page (`src/pages/OrderDetail.tsx`)
```typescript
// Key features:
- Get order ID from URL params
- Fetch order details from db.orders.getById()
- Display:
  * Order ID
  * Order date
  * Status with timeline
  * All items with images
  * Delivery address
  * Payment details
  * Tracking information (if available)
- Action buttons:
  * Cancel Order (if status = processing)
  * Request Return (if delivered < 12 hours ago AND total > ₹200)
```

### Phase 3: Admin Management

#### 9. Admin Dashboard (`src/pages/admin/Dashboard.tsx`)
```typescript
// Key features:
- Check if user is admin (useAuth hook)
- Display statistics:
  * Total orders
  * Pending orders
  * Total products
  * Pending returns
- Recent orders list
- Quick action buttons
```

#### 10. Admin Products (`src/pages/admin/Products.tsx`)
```typescript
// Key features:
- Product list with images
- Add Product button → Dialog with form
- Edit/Delete buttons
- Form fields:
  * Product name
  * Description
  * Price
  * Category (dropdown)
  * Images (multiple upload)
  * Stock quantity
- Image upload to Supabase Storage:
  * Bucket: app-7mweu0a82wap_images
  * Path: products/{productId}/{filename}
  * Get public URL and store in image_urls array
```

#### 11. Admin Categories (`src/pages/admin/Categories.tsx`)
```typescript
// Key features:
- Category list
- Add Category button
- Edit/Delete buttons
- Simple form: name and description
```

#### 12. Admin Orders (`src/pages/admin/Orders.tsx`)
```typescript
// Key features:
- All orders list
- Filter by:
  * Status
  * Date (newest/oldest)
  * Price (high/low)
- Search by Order ID
- View Details button
- Update Status button
- Add Tracking Info button
- Approve/Reject Cancellation requests
```

#### 13. Admin Returns (`src/pages/admin/Returns.tsx`)
```typescript
// Key features:
- Return requests list
- Filter by date (newest/oldest)
- View request details
- Approve/Reject buttons
- On approve:
  * Calculate refund (product price only, no delivery fee)
  * Update return status
  * Send notification
```

#### 14. Admin Promotions (`src/pages/admin/Promotions.tsx`)
```typescript
// Key features:
- Promotional images list
- Add Promotion button
- Edit/Delete buttons
- Form fields:
  * Title
  * Image upload
  * Active status
- Image upload to Supabase Storage:
  * Bucket: app-7mweu0a82wap_images
  * Path: promotions/{promoId}/{filename}
```

### Phase 4: Additional Features

#### 15. Categories Page (`src/pages/Categories.tsx`)
```typescript
// Key features:
- Fetch categories from db.categories.getAll()
- Display category cards
- On click → show products in that category
- Search functionality
- Product grid with filters
```

#### 16. Support Page (`src/pages/Support.tsx`)
```typescript
// Key features:
- Simple chatbot interface
- Predefined responses:
  * "Track my order" → Ask for Order ID → Show status
  * "Return policy" → Display policy text
  * "Delivery time" → Show 6-8 days info
  * Other queries → Show contact email
- Message history
- Input field for user messages
```

## Image Upload Implementation

### Using Supabase Storage

```typescript
// Example: Upload product image
async function uploadProductImage(file: File, productId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `products/${productId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('app-7mweu0a82wap_images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('app-7mweu0a82wap_images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
```

### File Input Component

```typescript
// Use native input for file uploads (not shadcn components)
<input
  type="file"
  accept="image/*"
  multiple
  onChange={handleFileChange}
  className="block w-full text-sm text-slate-500
    file:mr-4 file:py-2 file:px-4
    file:rounded-full file:border-0
    file:text-sm file:font-semibold
    file:bg-primary file:text-primary-foreground
    hover:file:bg-primary/90"
/>
```

## Business Logic Implementation

### Fee Calculation

```typescript
function calculateFees(subtotal: number, selectedDiscount?: number) {
  const platformFee = 10;
  let deliveryFee = subtotal > 500 ? 0 : 60;
  let discount = 0;

  if (selectedDiscount) {
    if (subtotal > 2500) discount = 150;
    else if (subtotal > 1200) discount = 100;
    else if (subtotal > 700) discount = 40;
  }

  const total = subtotal + platformFee + deliveryFee - discount;

  return { platformFee, deliveryFee, discount, total };
}
```

### Return Eligibility Check

```typescript
function canRequestReturn(order: Order): boolean {
  if (order.status !== 'delivered') return false;
  if (order.total_amount <= 200) return false;

  const deliveredAt = new Date(order.delivered_at || '');
  const now = new Date();
  const hoursSinceDelivery = (now.getTime() - deliveredAt.getTime()) / (1000 * 60 * 60);

  return hoursSinceDelivery <= 12;
}
```

## Form Validation Examples

### Address Form

```typescript
const addressSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number'),
  address_line1: z.string().min(5, 'Address is required'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pin_code: z.string().regex(/^[0-9]{6}$/, 'Invalid PIN code'),
  address_type: z.enum(['home', 'work', 'other']),
});
```

### Product Form

```typescript
const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price must be greater than 0'),
  category_id: z.string().uuid('Please select a category'),
  stock_quantity: z.number().int().min(0, 'Stock cannot be negative'),
});
```

## Testing Checklist

### Customer Flow
- [ ] Register new account with email OTP
- [ ] Register new account with phone OTP
- [ ] Login with email
- [ ] Login with phone
- [ ] Browse products on home page
- [ ] View product details
- [ ] Add product to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Add delivery address
- [ ] Complete checkout
- [ ] Make payment with reference number
- [ ] View order in order history
- [ ] Track order status
- [ ] Request order cancellation
- [ ] Request return (within 12 hours)
- [ ] Use customer support

### Admin Flow
- [ ] Login as admin
- [ ] Add new category
- [ ] Add new product with images
- [ ] Edit product
- [ ] Delete product
- [ ] View all orders
- [ ] Update order status
- [ ] Add tracking information
- [ ] Approve/reject cancellation
- [ ] View return requests
- [ ] Approve/reject return
- [ ] Add promotional image
- [ ] Manage promotions

## Common Patterns

### Loading State

```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadData();
}, []);

async function loadData() {
  try {
    setLoading(true);
    const data = await db.products.getAll();
    setProducts(data);
  } catch (error) {
    toast.error('Failed to load data');
  } finally {
    setLoading(false);
  }
}

if (loading) {
  return <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>;
}
```

### Error Handling

```typescript
try {
  await db.products.create(productData);
  toast.success('Product added successfully!');
  navigate('/admin/products');
} catch (error) {
  console.error('Error adding product:', error);
  toast.error('Failed to add product. Please try again.');
}
```

### Confirmation Dialog

```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Environment Variables

Already configured in `.env`:
```
VITE_SUPABASE_URL=https://ehzkzzayehzcuhwdpolg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_ID=app-7mweu0a82wap
```

## Resources

- Supabase Docs: https://supabase.com/docs
- shadcn/ui Components: https://ui.shadcn.com
- React Router: https://reactrouter.com
- Zod Validation: https://zod.dev

## Support

For questions or issues:
- Email: tapandbuy.in@gmail.com
- Check PROJECT_STATUS.md for current implementation status
- Review src/db/api.ts for available database functions
- Check src/types/index.ts for TypeScript interfaces
