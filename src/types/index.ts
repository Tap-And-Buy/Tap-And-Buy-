export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type UserRole = 'customer' | 'admin';
export type OrderStatus = 'pending' | 'processing' | 'order_placed' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed';
export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'refunded';
export type SupportStatus = 'open' | 'responded' | 'closed';
export type NotificationType = 'order' | 'system' | 'promotion';

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_urls: string[] | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  address_type: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_id: string;
  user_id: string;
  address_id: string | null;
  subtotal: number;
  platform_fee: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_reference: string;
  status: OrderStatus;
  tracking_info: string | null;
  cancellation_requested: boolean;
  cancellation_reason: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

export interface ReturnRequest {
  id: string;
  order_id: string;
  user_id: string;
  reason: string;
  images: string[] | null;
  status: ReturnStatus;
  admin_notes: string | null;
  refund_amount: number | null;
  created_at: string;
  updated_at: string;
}

export interface FirstOrderDevice {
  id: string;
  device_id: string;
  user_id: string;
  order_id: string;
  discount_applied: boolean;
  created_at: string;
}

export interface SearchHistory {
  id: string;
  user_id: string;
  search_term: string;
  created_at: string;
}

export interface PromotionalImage {
  id: string;
  title: string | null;
  image_url: string;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  user_id: string;
  order_id: string | null;
  message: string;
  response: string | null;
  status: SupportStatus;
  created_at: string;
  updated_at: string;
}

export interface RecentlyViewed {
  id: string;
  user_id: string;
  product_id: string;
  viewed_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface OrderWithDetails extends Order {
  items: OrderItem[];
  address: Address | null;
}

export interface ProductWithCategory extends Product {
  category: Category | null;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface WishlistWithProduct extends Wishlist {
  product: Product;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  related_id: string | null;
  is_read: boolean;
  created_at: string;
}
