import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/db/api';
import type { Order, OrderStatus, OrderWithDetails } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ShoppingCart, Search, Package, ChevronDown, MapPin, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AdminHeader } from '@/components/common/AdminHeader';

const trackingSchema = z.object({
  tracking_info: z.string().min(5, 'Tracking info must be at least 5 characters'),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
});

type TrackingFormData = z.infer<typeof trackingSchema>;

export default function AdminOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, OrderWithDetails>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});

  const form = useForm<TrackingFormData>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      tracking_info: '',
      status: 'processing',
    },
  });

  useEffect(() => {
    checkAdminAndLoadData();
  }, [user]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, filterStatus]);

  const checkAdminAndLoadData = async () => {
    try {
      const profile = await db.profiles.getCurrent();
      if (profile?.role !== 'admin') {
        navigate('/');
        toast.error('Access denied');
        return;
      }
      await loadOrders();
    } catch (error) {
      console.error('Error checking admin:', error);
      navigate('/');
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await db.orders.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.payment_reference?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus === 'cancellation_requested') {
      filtered = filtered.filter(order => order.cancellation_requested === true);
    } else if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    setFilteredOrders(filtered);
  };

  const handleUpdateTracking = async (data: TrackingFormData) => {
    if (!selectedOrder) return;

    try {
      await db.orders.update(selectedOrder.id, {
        tracking_info: data.tracking_info,
        status: data.status as OrderStatus,
      });
      toast.success('Order updated successfully');
      setDialogOpen(false);
      form.reset();
      setSelectedOrder(null);
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const openTrackingDialog = (order: Order) => {
    setSelectedOrder(order);
    form.reset({
      tracking_info: order.tracking_info || '',
      status: order.status,
    });
    setDialogOpen(true);
  };

  const handleCancellationAction = async (orderId: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await db.orders.approveCancellation(orderId);
        toast.success('Order cancelled successfully');
      } else {
        await db.orders.rejectCancellation(orderId);
        toast.success('Cancellation request rejected');
      }
      loadOrders();
    } catch (error) {
      console.error('Error handling cancellation:', error);
      toast.error(`Failed to ${action} cancellation request`);
    }
  };

  const loadOrderDetails = async (orderId: string) => {
    if (expandedOrders[orderId]) {
      return;
    }

    try {
      setLoadingDetails(prev => ({ ...prev, [orderId]: true }));
      const details = await db.orders.getById(orderId);
      if (details) {
        setExpandedOrders(prev => ({ ...prev, [orderId]: details }));
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoadingDetails(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      processing: 'secondary',
      shipped: 'default',
      delivered: 'outline',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AdminHeader title="Manage Orders" />

      <div className="max-w-screen-xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID or Reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="cancellation_requested">Cancellation Requests</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders found</h2>
              <p className="text-muted-foreground">
                {searchQuery || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Orders will appear here'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className={order.cancellation_requested ? 'border-yellow-500 border-2' : ''}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-base sm:text-lg">Order #{order.order_id || order.id.slice(0, 8)}</CardTitle>
                      {order.cancellation_requested && (
                        <Badge variant="destructive" className="mt-1">Cancellation Requested</Badge>
                      )}
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {order.cancellation_requested && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-semibold text-yellow-900 mb-2">Cancellation Reason:</p>
                      <p className="text-sm text-yellow-800">{order.cancellation_reason || 'No reason provided'}</p>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleCancellationAction(order.id, 'approve')}
                        >
                          Approve Cancellation
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCancellationAction(order.id, 'reject')}
                        >
                          Reject Request
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Reference</p>
                      <p className="font-semibold text-sm">{order.payment_reference || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Info</p>
                      <p className="font-semibold text-sm">{order.tracking_info || 'Not assigned'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-semibold text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Collapsible onOpenChange={(open) => open && loadOrderDetails(order.id)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full mb-3">
                        <ChevronDown className="mr-2 h-4 w-4" />
                        View Order Details
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 pt-4 border-t">
                      {loadingDetails[order.id] ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                      ) : expandedOrders[order.id] ? (
                        <>
                          {expandedOrders[order.id].address && (
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <MapPin className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold">Delivery Address</h3>
                              </div>
                              <div className="space-y-1 text-sm">
                                <p className="font-medium">{expandedOrders[order.id].address.full_name}</p>
                                <p>{expandedOrders[order.id].address.address_line1}</p>
                                {expandedOrders[order.id].address.address_line2 && (
                                  <p>{expandedOrders[order.id].address.address_line2}</p>
                                )}
                                <p>
                                  {expandedOrders[order.id].address.city}, {expandedOrders[order.id].address.state} - {expandedOrders[order.id].address.pincode}
                                </p>
                                <p className="text-muted-foreground">Phone: {expandedOrders[order.id].address.phone}</p>
                              </div>
                            </div>
                          )}

                          {expandedOrders[order.id].items && expandedOrders[order.id].items.length > 0 && (
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <ShoppingBag className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold">Order Items</h3>
                              </div>
                              <div className="space-y-3">
                                {expandedOrders[order.id].items.map((item) => (
                                  <div 
                                    key={item.id} 
                                    className="flex justify-between items-start p-3 bg-background rounded border cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => item.product_id && navigate(`/product/${item.product_id}`)}
                                  >
                                    <div className="flex-1">
                                      <p className="font-medium hover:text-primary transition-colors">{item.product_name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Quantity: {item.quantity} × ₹{item.product_price.toFixed(2)}
                                      </p>
                                    </div>
                                    <p className="font-semibold">₹{item.subtotal.toFixed(2)}</p>
                                  </div>
                                ))}
                                <div className="pt-3 border-t space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>₹{order.subtotal.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Platform Fee</span>
                                    <span>₹{order.platform_fee.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery Fee</span>
                                    <span>₹{order.delivery_fee.toFixed(2)}</span>
                                  </div>
                                  {order.discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                      <span>Discount</span>
                                      <span>-₹{order.discount.toFixed(2)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between font-semibold text-base pt-2 border-t">
                                    <span>Total</span>
                                    <span>₹{order.total.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : null}
                    </CollapsibleContent>
                  </Collapsible>

                  <Button onClick={() => openTrackingDialog(order)} className="w-full sm:w-auto">
                    <Package className="mr-2 h-4 w-4" />
                    Update Tracking
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Tracking</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateTracking)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tracking_info"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tracking Information *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter tracking number and notes..." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">Update</Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
