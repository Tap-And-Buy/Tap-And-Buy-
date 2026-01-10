import { useState } from 'react';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import upiQrImg from '/upi-qr.jpg';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { getDeviceFingerprint } from '@/utils/deviceFingerprint';

export default function Payment() {
  useScrollToTop();
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentReference, setPaymentReference] = useState('');
  const [loading, setLoading] = useState(false);

  const { cartItems, address, subtotal, platformFee, deliveryFee, discount, firstOrderDiscount, total, couponCode, discountType } =
    location.state || {};

  if (!cartItems || !address) {
    navigate('/cart');
    return null;
  }

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('gokul-rv@indianbank');
    toast.success('UPI ID copied to clipboard');
  };

  const handleConfirmPayment = async () => {
    if (!paymentReference.trim()) {
      toast.error('Please enter payment reference number');
      return;
    }

    // Validate exactly 12 digits
    const referenceRegex = /^\d{12}$/;
    if (!referenceRegex.test(paymentReference.trim())) {
      toast.error('Reference number must be exactly 12 digits');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        address_id: address.id,
        subtotal,
        platform_fee: platformFee,
        delivery_fee: deliveryFee,
        discount,
        total,
        payment_reference: paymentReference.trim(),
        coupon_code: couponCode || null,
        discount_type: discountType || null,
        items: cartItems.map((item: { product_id: string; quantity: number; product: { price: number; name: string } }) => ({
          product_id: item.product_id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      const order = await db.orders.create(orderData);

      // Record coupon usage if a coupon was applied
      if (couponCode && discountType === 'coupon' && discount > 0) {
        try {
          const coupon = await db.coupons.getByCode(couponCode);
          if (coupon) {
            await db.coupons.recordUsage(coupon.id, order.id, discount);
          }
        } catch (error) {
          console.error('Error recording coupon usage:', error);
          // Don't fail the order if coupon recording fails
        }
      }

      if (firstOrderDiscount && firstOrderDiscount > 0) {
        try {
          const deviceId = await getDeviceFingerprint();
          await db.firstOrderDevices.create(deviceId, order.id, firstOrderDiscount);
        } catch (error) {
          console.error('Error recording first order device:', error);
        }
      }

      await db.cart.clear();

      toast.success('Order placed successfully!');
      navigate(`/order/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      const err = error as Error;
      toast.error(err.message || 'Failed to create order. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-screen-xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Complete Payment</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <Card className="border-primary">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">₹{total.toFixed(2)}</div>
            <p className="text-muted-foreground">Amount to Pay</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Payment Instructions</h2>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">1.</span>
                  <span>Scan the QR code below or use the UPI ID</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">2.</span>
                  <span>The amount will be auto-filled in your payment app</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">3.</span>
                  <span>Complete the payment in your UPI app</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">4.</span>
                  <span>Copy the payment reference number from your app</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">5.</span>
                  <span>Paste the reference number below and confirm</span>
                </li>
              </ol>
            </div>

            <div className="border-t pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-primary">
                  <img
                    src={upiQrImg}
                    alt="UPI QR Code"
                    className="w-64 h-64 object-contain"
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Or use UPI ID</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-4 py-2 rounded font-mono text-sm">
                      gokul-rv@indianbank
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyUPI}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div>
                <Label htmlFor="reference">Payment Reference Number *</Label>
                <Input
                  id="reference"
                  type="text"
                  placeholder="Enter 12-digit reference number"
                  value={paymentReference}
                  onChange={e => setPaymentReference(e.target.value)}
                  className="mt-2"
                  maxLength={12}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter exactly 12 digits from your payment app (e.g., 123456789012)
                </p>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleConfirmPayment}
                disabled={loading || !paymentReference.trim()}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Confirm Payment
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4 text-sm space-y-2">
            <h3 className="font-semibold text-red-900 dark:text-red-100">⚠️ Payment Rules - Please Read Carefully:</h3>
            <ul className="space-y-1 text-red-800 dark:text-red-200">
              <li>• Reference number must be exactly 12 digits</li>
              <li>• Wrong reference number will result in order rejection</li>
              <li>• Wrong amount paid will result in order rejection</li>
              <li>• Ensure you pay the exact amount: ₹{total.toFixed(2)}</li>
              <li>• If payment is made but order fails, contact support immediately</li>
              <li>• Support Email: <strong>tapandbuy.in@gmail.com</strong></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 text-sm space-y-2">
            <h3 className="font-semibold">Important Notes:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Do not refresh or close this page after payment</li>
              <li>• Your order will be confirmed only after entering the reference number</li>
              <li>• Keep your payment receipt for future reference</li>
              <li>• Contact support if you face any issues</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
