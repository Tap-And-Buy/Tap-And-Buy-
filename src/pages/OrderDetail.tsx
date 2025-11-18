import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '@/db/api';
import type { OrderWithDetails } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Package, MapPin, CreditCard, Truck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const cancellationSchema = z.object({
  reason: z.string().min(10, 'Please provide a detailed reason (minimum 10 characters)'),
});

const returnSchema = z.object({
  reason: z.string().min(20, 'Please provide a detailed description of the damage (minimum 20 characters)'),
});

type CancellationFormData = z.infer<typeof cancellationSchema>;
type ReturnFormData = z.infer<typeof returnSchema>;

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);

  const form = useForm<CancellationFormData>({
    resolver: zodResolver(cancellationSchema),
    defaultValues: {
      reason: '',
    },
  });

  const returnForm = useForm<ReturnFormData>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      reason: '',
    },
  });

  useEffect(() => {
    if (user && id) {
      loadOrder();
    } else if (!user) {
      navigate('/login');
    }
  }, [user, id]);

  const loadOrder = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await db.orders.getById(id);
      if (!data) {
        toast.error('Order not found');
        navigate('/orders');
        return;
      }
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (data: CancellationFormData) => {
    if (!order) return;
    try {
      await db.orders.requestCancellation(order.id, data.reason);
      toast.success('Cancellation request submitted');
      setCancelDialogOpen(false);
      form.reset();
      loadOrder();
    } catch (error) {
      console.error('Error requesting cancellation:', error);
      toast.error('Failed to submit cancellation request');
    }
  };

  const handleReturnRequest = async (data: ReturnFormData) => {
    if (!order) return;
    try {
      await db.returns.create({
        order_id: order.id,
        user_id: user!.id,
        reason: data.reason,
        images: null,
        status: 'pending',
        admin_notes: null,
        refund_amount: null,
      });
      toast.success('Return request submitted successfully. Admin will review your request.');
      setReturnDialogOpen(false);
      returnForm.reset();
      loadOrder();
    } catch (error) {
      console.error('Error submitting return request:', error);
      toast.error('Failed to submit return request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-yellow-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-muted';
    }
  };

  const canRequestCancellation = () => {
    if (!order) return false;
    // Can only cancel if order is pending or processing (before shipped)
    if (order.status !== 'pending' && order.status !== 'processing') return false;
    // Cannot cancel if already requested
    if (order.cancellation_requested) return false;
    return true;
  };

  const canRequestReturn = () => {
    if (!order) return false;
    // Can only return if order is delivered
    if (order.status !== 'delivered') return false;
    // Cannot return orders below ₹200
    if (order.total < 200) return false;
    // Check if delivered_at exists and within 12 hours
    if (!order.delivered_at) {
      console.log('No delivered_at timestamp found');
      return false;
    }
    const deliveredDate = new Date(order.delivered_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60);
    console.log('Delivered at:', deliveredDate, 'Now:', now, 'Hours diff:', hoursDiff);
    return hoursDiff >= 0 && hoursDiff <= 12;
  };

  const getReturnWindowInfo = () => {
    if (!order || !order.delivered_at) return null;
    const deliveredDate = new Date(order.delivered_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60);
    const hoursRemaining = 12 - hoursDiff;
    
    if (hoursRemaining > 0) {
      const hours = Math.floor(hoursRemaining);
      const minutes = Math.floor((hoursRemaining - hours) * 60);
      return `${hours}h ${minutes}m remaining`;
    }
    return 'Expired';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-screen-xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/orders')}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Order #{order.order_id}</h1>
            <p className="text-sm opacity-90">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-4 space-y-4">
        {order.cancellation_requested && (
          <Card className="border-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Cancellation Requested</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    Your cancellation request is pending admin approval.
                  </p>
                  {order.cancellation_reason && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Reason: {order.cancellation_reason}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.product_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × ₹{item.product_price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.subtotal.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.address && (
              <div className="text-sm space-y-1">
                <p className="font-semibold">{order.address.full_name}</p>
                <p>{order.address.address_line1}</p>
                {order.address.address_line2 && <p>{order.address.address_line2}</p>}
                <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                <p>Phone: {order.address.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{order.platform_fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee.toFixed(2)}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">₹{order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground pt-2">
                <span>Payment Reference</span>
                <span className="font-mono text-xs">{order.payment_reference}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {order.tracking_info && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Tracking Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{order.tracking_info}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          {canRequestCancellation() && (
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  Request Cancellation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Order Cancellation</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCancelRequest)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for Cancellation *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide a detailed reason for cancellation"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1">
                        Submit Request
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCancelDialogOpen(false);
                          form.reset();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}

          {canRequestReturn() && (
            <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  Request Return
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Product Return</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-900">
                      <strong>Return Window:</strong> {getReturnWindowInfo()}
                    </p>
                    <p className="text-sm text-amber-700 mt-2">
                      Returns are only accepted for damaged products. Please provide detailed information about the damage.
                    </p>
                  </div>
                  <Form {...returnForm}>
                    <form onSubmit={returnForm.handleSubmit(handleReturnRequest)} className="space-y-4">
                      <FormField
                        control={returnForm.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Describe the Damage *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide detailed information about the damage (e.g., broken parts, defects, wrong item received)"
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-3">
                        <Button type="submit" className="flex-1">
                          Submit Return Request
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setReturnDialogOpen(false);
                            returnForm.reset();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Show info messages when actions are not available */}
        {order.status === 'delivered' && canRequestReturn() && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-900">
                <p className="font-semibold">Return Window Active</p>
                <p className="text-green-700">
                  You can request a return for damaged products. Time remaining: {getReturnWindowInfo()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {order.status === 'shipped' && !canRequestCancellation() && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold">Order Already Shipped</p>
                <p className="text-blue-700">Cancellation is not available once the order has been shipped.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {order.status === 'delivered' && order.total < 200 && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-900">
                <p className="font-semibold">Return Not Available</p>
                <p className="text-red-700">
                  Your order is under ₹200, so it cannot be returned. Returns are only available for orders above ₹200.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {order.status === 'delivered' && order.total >= 200 && !canRequestReturn() && order.delivered_at && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-semibold">Return Window Expired</p>
                <p className="text-amber-700">
                  Returns are only accepted within 12 hours of delivery. Your order was delivered on{' '}
                  {new Date(order.delivered_at).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {order.cancellation_requested && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-900">
                <p className="font-semibold">Cancellation Request Pending</p>
                <p className="text-yellow-700">
                  Your cancellation request is under review by our admin team.
                  {order.cancellation_reason && (
                    <span className="block mt-1">Reason: {order.cancellation_reason}</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted/50">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Delivery Information:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Orders will be delivered within 6 to 8 days</li>
              <li>If not delivered within 8 days, it may take an extra 1 to 3 days</li>
              <li>Returns accepted only for damaged products within 12 hours of delivery</li>
              <li>Orders below ₹200 are not eligible for return or refund</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
