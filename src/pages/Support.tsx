import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, HelpCircle, Phone } from 'lucide-react';

export default function Support() {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Customer Support
          </h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-4">
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="faq">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I track my order?</AccordionTrigger>
                    <AccordionContent>
                      To track your order, go to the Orders page from the bottom navigation. You can view your order status, tracking information, and order placed time there. Each order has a unique Order ID (TAB######).
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>What is the return/refund policy?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>Eligibility:</strong> Only damaged products are eligible for return/refund.</p>
                        <p><strong>Timeline:</strong> Raise a return request within 12 hours after delivery. It will be reviewed and managed within 36 hours.</p>
                        <p><strong>Important:</strong> Delivery charges will NOT be refunded, only the product amount.</p>
                        <p><strong>Damaged Products:</strong> Share an unboxing video of the package to tapandbuy.in@gmail.com with your order ID. This is required if the product is found damaged when taken from the package.</p>
                        <p><strong>Contact:</strong> If your return/refund is approved, the Tap And Buy team will contact you. Please check your inbox for our response.</p>
                        <p><strong>Refund Processing:</strong> Approved refunds go to your original payment method within 7 business days after inspection.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>How long does delivery take?</AccordionTrigger>
                    <AccordionContent>
                      Orders will be delivered within 6 to 8 days after order confirmation. If not delivered within 8 days, it may take an extra 1 to 3 days to be delivered.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p>We accept prepaid payments via UPI only:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li><strong>UPI:</strong> Google Pay (GPay), Paytm, PhonePe, and other UPI payment applications</li>
                        </ul>
                        <p className="mt-2">Your order will be confirmed automatically after successful payment.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>What are the all-time offers?</AccordionTrigger>
                    <AccordionContent>
                      • ₹40 off on 10+ products & ₹500+ order<br />
                      • ₹80 off on 20+ products & ₹1000+ order<br />
                      • ₹150 off on 35+ products & ₹1500+ order<br />
                      • First order discount: 2% off!<br />
                      Note: Only one discount applies (coupon OR offer).
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger>How do I use coupon codes?</AccordionTrigger>
                    <AccordionContent>
                      Check available coupons during checkout! Click "View all available coupons" to see eligible discounts. Only one discount (coupon OR offer) can be applied per order.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger>What if I receive a damaged product?</AccordionTrigger>
                    <AccordionContent>
                      Share an unboxing video to our Gmail account (tapandbuy.in@gmail.com) with the order ID. This helps us process your claim quickly and accurately.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger>Can I cancel my order?</AccordionTrigger>
                    <AccordionContent>
                      You can request order cancellation from the Order Details page. The request will be sent to admin for approval. Cancellation is only available for orders in "processing" status.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-9">
                    <AccordionTrigger>What are the platform and delivery fees?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>Platform Fee:</strong> ₹10 (applied to all orders)</p>
                        <p><strong>Delivery Fee:</strong> ₹60 (standard delivery)</p>
                        <p className="text-primary font-semibold mt-3">🎉 Free Delivery Available!</p>
                        <p>Enjoy FREE delivery on orders above ₹999 rupees and 7+ products. The delivery fee will be automatically waived at checkout when your order meets both conditions.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-10">
                    <AccordionTrigger>How do I change my password?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>From Account Page:</strong></p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Go to your Account page from the bottom navigation</li>
                          <li>Scroll to the Security section</li>
                          <li>Click "Change Password" button</li>
                          <li>Enter your current password</li>
                          <li>Enter and confirm your new password</li>
                          <li>Click "Change Password" to save</li>
                        </ol>
                        <p className="mt-3"><strong>Note:</strong> Your new password must be at least 6 characters long.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-11">
                    <AccordionTrigger>I forgot my password. How do I reset it?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>Password Reset Process:</strong></p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Click "Forgot Password?" on the login page</li>
                          <li>Enter your registered email address</li>
                          <li>Check your email for a 4-digit OTP code</li>
                          <li>Enter the OTP code (valid for 10 minutes)</li>
                          <li>Set your new password</li>
                          <li>Confirm your new password</li>
                          <li>Click "Reset Password" to complete</li>
                        </ol>
                        <p className="mt-3"><strong>Alternative:</strong> You can also access "Forgot Password?" from the Change Password dialog in your Account settings if you're already logged in but forgot your current password.</p>
                        <p className="mt-2"><strong>Tip:</strong> If you don't receive the OTP email, check your spam/junk folder or click "Resend Code" to request a new one.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-12">
                    <AccordionTrigger>What is OTP and how does it work?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>OTP (One-Time Password):</strong> A 4-digit security code sent to your email for verification purposes.</p>
                        <p className="mt-2"><strong>When you'll receive OTP:</strong></p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>During account registration (to verify your email)</li>
                          <li>When resetting your forgotten password</li>
                        </ul>
                        <p className="mt-2"><strong>Important:</strong></p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>OTP codes expire after 10 minutes</li>
                          <li>Each OTP can only be used once</li>
                          <li>You can request a new OTP if the previous one expired</li>
                          <li>OTP emails are sent from tapandbuy.in@gmail.com</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    For any queries, complaints, or assistance, please email us at:
                  </p>
                  <a
                    href="mailto:tapandbuy.in@gmail.com"
                    className="text-primary hover:underline font-semibold text-lg block"
                  >
                    tapandbuy.in@gmail.com
                  </a>
                  <p className="text-xs text-muted-foreground mt-4">
                    We typically respond within 24 hours
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold">Monday - Saturday</p>
                    <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM IST</p>
                  </div>
                  <div>
                    <p className="font-semibold">Sunday</p>
                    <p className="text-sm text-muted-foreground">Closed</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Live chat is available during business hours
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold text-sm">For Damaged/Missing Products:</p>
                  <p className="text-sm text-muted-foreground">
                    Please share an unboxing video with your order ID to tapandbuy.in@gmail.com
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm">For Password Reset:</p>
                  <p className="text-sm text-muted-foreground">
                    Contact us with your registered email address
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm">For Order Issues:</p>
                  <p className="text-sm text-muted-foreground">
                    Include your Order ID (TAB######) in all communications
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
