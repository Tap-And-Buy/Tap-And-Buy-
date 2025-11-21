import { supabase } from './supabase';
import type {
  Profile,
  Category,
  Product,
  Address,
  Order,
  OrderItem,
  OrderStatus,
  ReturnRequest,
  ReturnStatus,
  SearchHistory,
  PromotionalImage,
  SupportMessage,
  RecentlyViewed,
  CartItem,
  CartItemWithProduct,
  OrderWithDetails,
  ProductWithCategory,
  Wishlist,
  WishlistWithProduct,
  FirstOrderDevice,
  Notification,
} from '@/types';

export const db = {
  profiles: {
    async getCurrent(): Promise<Profile | null> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<Profile>): Promise<Profile> {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Profile not found');
      return data;
    },

    async getAll(): Promise<Profile[]> {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },
  },

  categories: {
    async getAll(): Promise<Category[]> {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getById(id: string): Promise<Category | null> {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Failed to create category');
      return data;
    },

    async update(id: string, updates: Partial<Category>): Promise<Category> {
      const { data, error } = await supabase
        .from('categories')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Category not found');
      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
  },

  products: {
    async getAll(categoryId?: string): Promise<Product[]> {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getAllWithCategory(): Promise<ProductWithCategory[]> {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getById(id: string): Promise<Product | null> {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async search(searchTerm: string): Promise<Product[]> {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Failed to create product');
      return data;
    },

    async update(id: string, updates: Partial<Product>): Promise<Product> {
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Product not found');
      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
  },

  addresses: {
    async getAll(): Promise<Address[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getById(id: string): Promise<Address | null> {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async create(address: Omit<Address, 'id' | 'created_at' | 'updated_at'>): Promise<Address> {
      const { data, error } = await supabase
        .from('addresses')
        .insert(address)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Failed to create address');
      return data;
    },

    async update(id: string, updates: Partial<Address>): Promise<Address> {
      const { data, error } = await supabase
        .from('addresses')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Address not found');
      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    async setDefault(id: string): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
    },
  },

  orders: {
    async getAll(filters?: { status?: string; search?: string }): Promise<Order[]> {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.eq('order_id', filters.search);
      }

      const { data, error } = await query;

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getMyOrders(): Promise<Order[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getById(id: string): Promise<OrderWithDetails | null> {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*), address:addresses(*)')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async getByOrderId(orderId: string): Promise<OrderWithDetails | null> {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*), address:addresses(*)')
        .eq('order_id', orderId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async create(orderData: {
      address_id: string;
      subtotal: number;
      platform_fee: number;
      delivery_fee: number;
      discount: number;
      total: number;
      payment_reference: string;
      items: Array<{ product_id: string; product_name: string; quantity: number; price: number }>;
    }): Promise<Order> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const order = {
        user_id: user.id,
        address_id: orderData.address_id,
        subtotal: orderData.subtotal,
        platform_fee: orderData.platform_fee,
        delivery_fee: orderData.delivery_fee,
        discount: orderData.discount,
        total: orderData.total,
        payment_reference: orderData.payment_reference,
        status: 'processing' as OrderStatus,
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Failed to create order');

      const orderItems = orderData.items.map(item => ({
        order_id: data.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return data;
    },

    async update(id: string, updates: Partial<Order>): Promise<Order> {
      const { data, error } = await supabase
        .from('orders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Order not found');
      return data;
    },

    async requestCancellation(id: string, reason: string): Promise<Order> {
      const { data, error } = await supabase
        .from('orders')
        .update({
          cancellation_requested: true,
          cancellation_reason: reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Order not found');
      return data;
    },

    async approveCancellation(id: string): Promise<Order> {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          cancellation_requested: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Order not found');
      return data;
    },

    async rejectCancellation(id: string): Promise<Order> {
      const { data, error } = await supabase
        .from('orders')
        .update({
          cancellation_requested: false,
          cancellation_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Order not found');
      return data;
    },
  },

  orderItems: {
    async create(items: Omit<OrderItem, 'id' | 'created_at'>[]): Promise<OrderItem[]> {
      const { data, error } = await supabase
        .from('order_items')
        .insert(items)
        .select();

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getByOrderId(orderId: string): Promise<OrderItem[]> {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },
  },

  returnRequests: {
    async getAll(filters?: { status?: string }): Promise<ReturnRequest[]> {
      let query = supabase
        .from('return_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getMyRequests(): Promise<ReturnRequest[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('return_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async create(request: Omit<ReturnRequest, 'id' | 'created_at' | 'updated_at'>): Promise<ReturnRequest> {
      const { data, error } = await supabase
        .from('return_requests')
        .insert(request)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Failed to create return request');
      return data;
    },

    async update(id: string, updates: Partial<ReturnRequest>): Promise<ReturnRequest> {
      const { data, error } = await supabase
        .from('return_requests')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Return request not found');
      return data;
    },
  },

  searchHistory: {
    async getRecent(limit = 10): Promise<SearchHistory[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async add(searchTerm: string): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('search_history')
        .insert({ user_id: user.id, search_term: searchTerm });

      if (error) throw error;
    },

    async clear(): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
  },

  promotionalImages: {
    async getActive(): Promise<PromotionalImage[]> {
      const { data, error } = await supabase
        .from('promotional_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getAll(): Promise<PromotionalImage[]> {
      const { data, error } = await supabase
        .from('promotional_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async create(image: Omit<PromotionalImage, 'id' | 'created_at' | 'updated_at'>): Promise<PromotionalImage> {
      const { data, error } = await supabase
        .from('promotional_images')
        .insert(image)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Failed to create promotional image');
      return data;
    },

    async update(id: string, updates: Partial<PromotionalImage>): Promise<PromotionalImage> {
      const { data, error } = await supabase
        .from('promotional_images')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Promotional image not found');
      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('promotional_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
  },

  supportMessages: {
    async getAll(): Promise<SupportMessage[]> {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getMyMessages(): Promise<SupportMessage[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async create(message: Omit<SupportMessage, 'id' | 'created_at' | 'updated_at'>): Promise<SupportMessage> {
      const { data, error } = await supabase
        .from('support_messages')
        .insert(message)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Failed to create support message');
      return data;
    },

    async update(id: string, updates: Partial<SupportMessage>): Promise<SupportMessage> {
      const { data, error } = await supabase
        .from('support_messages')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Support message not found');
      return data;
    },
  },

  recentlyViewed: {
    async getRecent(limit = 10): Promise<Product[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('recently_viewed')
        .select('product:products(*)')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      if (!Array.isArray(data)) return [];
      
      const products: Product[] = [];
      for (const item of data) {
        if (item.product && typeof item.product === 'object' && !Array.isArray(item.product)) {
          products.push(item.product as unknown as Product);
        }
      }
      return products;
    },

    async add(productId: string): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('recently_viewed')
        .upsert(
          { user_id: user.id, product_id: productId, viewed_at: new Date().toISOString() },
          { onConflict: 'user_id,product_id' }
        );

      if (error) throw error;
    },
  },

  cart: {
    async getItems(): Promise<CartItemWithProduct[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async addItem(productId: string, quantity = 1): Promise<CartItem> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('cart_items')
          .update({
            quantity: existing.quantity + quantity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Failed to update cart item');
        return data;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert({ user_id: user.id, product_id: productId, quantity })
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Failed to add to cart');
      return data;
    },

    async updateQuantity(id: string, quantity: number): Promise<CartItem> {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Cart item not found');
      return data;
    },

    async removeItem(id: string): Promise<void> {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    async clear(): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
  },

  storage: {
    async uploadImage(file: File, path: string): Promise<string> {
      const { data, error } = await supabase.storage
        .from('app-7mweu0a82wap_images')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('app-7mweu0a82wap_images')
        .getPublicUrl(data.path);

      return publicUrl;
    },

    async deleteImage(path: string): Promise<void> {
      const { error } = await supabase.storage
        .from('app-7mweu0a82wap_images')
        .remove([path]);

      if (error) throw error;
    },

    async uploadProductImage(file: File): Promise<string> {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    },

    async deleteProductImage(url: string): Promise<void> {
      const path = url.split('/product_images/')[1];
      if (!path) return;

      const { error } = await supabase.storage
        .from('product_images')
        .remove([path]);

      if (error) throw error;
    },
  },

  returns: {
    async getAll(): Promise<ReturnRequest[]> {
      const { data, error } = await supabase
        .from('return_requests')
        .select('*')
        .order('created_at', { ascending: false});

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getById(id: string): Promise<ReturnRequest | null> {
      const { data, error } = await supabase
        .from('return_requests')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async create(returnData: Omit<ReturnRequest, 'id' | 'created_at' | 'updated_at'>): Promise<ReturnRequest> {
      const { data, error } = await supabase
        .from('return_requests')
        .insert(returnData)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Failed to create return');
      return data;
    },

    async updateStatus(id: string, status: ReturnStatus, adminNotes?: string): Promise<ReturnRequest> {
      const updates: Partial<ReturnRequest> = { status };
      if (adminNotes) updates.admin_notes = adminNotes;

      const { data, error } = await supabase
        .from('return_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Failed to update return');
      return data;
    },
  },

  wishlist: {
    async getAll(): Promise<WishlistWithProduct[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getProductIds(): Promise<string[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return Array.isArray(data) ? data.map(item => item.product_id) : [];
    },

    async isInWishlist(productId: string): Promise<boolean> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },

    async add(productId: string): Promise<Wishlist> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: productId,
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Failed to add to wishlist');
      return data;
    },

    async remove(productId: string): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
    },

    async toggle(productId: string): Promise<boolean> {
      const isInWishlist = await this.isInWishlist(productId);
      
      if (isInWishlist) {
        await this.remove(productId);
        return false;
      } else {
        await this.add(productId);
        return true;
      }
    },
  },

  firstOrderDevices: {
    async checkDevice(deviceId: string): Promise<boolean> {
      const { data, error } = await supabase
        .from('first_order_devices')
        .select('id')
        .eq('device_id', deviceId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },

    async create(deviceId: string, orderId: string, discountApplied: number): Promise<FirstOrderDevice> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('first_order_devices')
        .insert({
          device_id: deviceId,
          user_id: user.id,
          order_id: orderId,
          discount_applied: discountApplied,
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Failed to create first order device record');
      return data;
    },

    async getByDevice(deviceId: string): Promise<FirstOrderDevice | null> {
      const { data, error } = await supabase
        .from('first_order_devices')
        .select('*')
        .eq('device_id', deviceId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  },

  notifications: {
    async getAll(): Promise<Notification[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getUnread(): Promise<Notification[]> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    async getUnreadCount(): Promise<number> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data, error } = await supabase
        .rpc('get_unread_count');

      if (error) throw error;
      return data || 0;
    },

    async markAsRead(notificationId: string): Promise<void> {
      const { error } = await supabase
        .rpc('mark_notification_read', { notification_id: notificationId });

      if (error) throw error;
    },

    async markAllAsRead(): Promise<void> {
      const { error } = await supabase
        .rpc('mark_all_notifications_read');

      if (error) throw error;
    },

    async delete(notificationId: string): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
  },
};
