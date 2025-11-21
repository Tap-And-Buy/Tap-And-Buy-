import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package, RefreshCw, Shield, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function Policies() {
  useScrollToTop();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Policies & Information</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Return & Refund Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Return Eligibility</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Products can be returned within 7 days of delivery</li>
                <li>Items must be unused, unwashed, and in original packaging</li>
                <li>Tags and labels must be intact</li>
                <li>Return request must be initiated through your account</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Non-Returnable Items</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Perishable goods (food, flowers, etc.)</li>
                <li>Personal care items (cosmetics, undergarments)</li>
                <li>Custom or personalized products</li>
                <li>Items marked as "non-returnable" on product page</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Return Process</h3>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Go to "My Orders" and select the order you want to return</li>
                <li>Click "Request Return" and provide reason with images</li>
                <li>Our team will review your request within 24-48 hours</li>
                <li>Once approved, you'll receive pickup instructions</li>
                <li>Refund will be processed within 5-7 business days after pickup</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Refund Policy</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Refunds are processed to the original payment method</li>
                <li>Delivery charges are non-refundable (except for defective items)</li>
                <li>Platform fee is non-refundable</li>
                <li>Refund amount = Product price - Platform fee - Delivery charges</li>
                <li>Bank processing may take 5-7 business days</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Shipping & Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Delivery Timeline</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Standard delivery: 5-7 business days</li>
                <li>Metro cities: 3-5 business days</li>
                <li>Remote areas: 7-10 business days</li>
                <li>Delivery times may vary during peak seasons</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Shipping Charges</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Delivery charge: ₹60 (applicable on all orders)</li>
                <li>Platform fee: ₹10 (applicable on all orders)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Order Tracking</h3>
              <p className="text-muted-foreground">
                You can track your order status in the "My Orders" section. You'll receive notifications
                for each status update: Order Placed → Processing → Shipped → Out for Delivery → Delivered.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Offers & Discounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Quantity-Based Discounts</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>10+ products: ₹40 OFF on your order</li>
                <li>20+ products: ₹80 OFF on your order</li>
                <li>35+ products: ₹150 OFF on your order</li>
                <li>Discounts are automatically applied at checkout</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">First Order Discount</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Get 2% OFF on your first order</li>
                <li>One-time discount per device</li>
                <li>Automatically applied at checkout for eligible orders</li>
                <li>Cannot be combined with other promotional codes</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Terms & Conditions</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Offers are subject to availability</li>
                <li>Discounts cannot be redeemed for cash</li>
                <li>We reserve the right to modify or cancel offers</li>
                <li>Only one discount can be applied per order</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Data Protection</h3>
              <p className="text-muted-foreground">
                We take your privacy seriously. Your personal information is encrypted and stored securely.
                We never share your data with third parties without your consent.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Payment Security</h3>
              <p className="text-muted-foreground">
                All payment transactions are processed through secure payment gateways. We do not store
                your credit card or banking information on our servers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Account Security</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Use a strong, unique password for your account</li>
                <li>Never share your password with anyone</li>
                <li>Log out after using shared devices</li>
                <li>Contact support immediately if you notice suspicious activity</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              For any questions or concerns regarding our policies, please contact our customer support team:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>Support Page:</strong> <Link to="/support" className="text-primary hover:underline">Visit Support</Link></li>
              <li><strong>Response Time:</strong> Within 24-48 hours</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
