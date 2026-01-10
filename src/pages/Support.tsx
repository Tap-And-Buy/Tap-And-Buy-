import { useState, useRef, useEffect } from 'react';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Send, Mail, HelpCircle, Phone } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Support() {
  useScrollToTop();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Tap And Buy Customer Support. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getChatbotResponse = (message: string): string => {
    const lower = message.toLowerCase();

    if (lower.includes('return') || lower.includes('refund')) {
      return 'Returns/Refunds Policy: Raise a request within 12 hours after delivery. It will be reviewed and managed within 36 hours after return request. Refunds (if approved) go to your original payment method within 7 business days after inspection. Products must be unused, in original packaging.';
    }

    if (lower.includes('damaged') || lower.includes('missing') || lower.includes('defect')) {
      return 'Damaged/Missing Products: Share an unboxing video to our Gmail account (tapandbuy.in@gmail.com) with the order ID. This helps us process your claim quickly and accurately.';
    }

    if (lower.includes('reject') || lower.includes('denied') || lower.includes('refuse')) {
      return 'Rejected Parcels: If you deny delivery, we deduct 2x shipping + 10% packing fee before refund. Please ensure you want to receive the order before it arrives.';
    }

    if (lower.includes('password') || lower.includes('forgot') || lower.includes('reset')) {
      return 'Forgot Password: Please contact our support team at tapandbuy.in@gmail.com with your registered email. Admin will reset your password and provide you with a new one.';
    }

    if (lower.includes('track') || lower.includes('order')) {
      return 'To track your order, please go to the Orders page from the bottom navigation. You can view your order status, tracking information, and order placed time there. Each order has a unique Order ID (TAB######).';
    }

    if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('days')) {
      return 'Orders will be delivered within 6 to 8 days after order confirmation. If not delivered within 8 days, it may take an extra 1 to 3 days to be delivered.';
    }

    if (lower.includes('cancel')) {
      return 'You can request order cancellation from the Order Details page. The request will be sent to admin for approval. Cancellation is only available for orders in "processing" status.';
    }

    if (lower.includes('payment') || lower.includes('pay')) {
      return 'We accept prepaid payments only via UPI, Paytm, GPay, Debit Card, and Credit Card. After payment, please enter the payment reference number to confirm your order.';
    }

    if (lower.includes('coupon') || lower.includes('code')) {
      return 'Coupon Codes: Check available coupons during checkout! Click "View all available coupons" to see eligible discounts. Only one discount (coupon OR offer) can be applied per order.';
    }

    if (lower.includes('discount') || lower.includes('offer')) {
      return 'All-Time Offers: ₹40 off on 10+ products & ₹500+ order, ₹80 off on 20+ products & ₹1000+ order, ₹150 off on 35+ products & ₹1500+ order. First order discount: 2% off! Note: Only one discount applies (coupon OR offer).';
    }

    if (lower.includes('fee') || lower.includes('charge')) {
      return 'Platform fee: ₹10 (applied to all orders). Delivery fee: ₹60 (applied to all orders).';
    }

    if (lower.includes('contact') || lower.includes('email') || lower.includes('help')) {
      return 'For further assistance, please contact us at: tapandbuy.in@gmail.com';
    }

    return 'I can help you with: order tracking, returns/refunds, damaged/missing products, rejected parcels, password reset, delivery timeline, cancellations, payment methods, coupons, discounts, and fees. For other queries, please contact us at tapandbuy.in@gmail.com';
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getChatbotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);

    setInputMessage('');
  };

  const handleQuickReply = (text: string) => {
    setInputMessage(text);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Customer Support
          </h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-4">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">
              <MessageCircle className="h-4 w-4 mr-2" />
              Live Chat
            </TabsTrigger>
            <TabsTrigger value="faq">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-4">
            <Card className="h-[calc(100vh-280px)] flex flex-col">
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              <div className="p-4 border-t space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply('How do I track my order?')}
                  >
                    Track Order
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply('What is the return policy?')}
                  >
                    Return Policy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply('Delivery timeline?')}
                  >
                    Delivery Time
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply('Available discounts?')}
                  >
                    Discounts
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

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
                      You can raise a return request within 12 hours after delivery. It will be reviewed and managed within 36 hours after the return request. Refunds (if approved) go to your original payment method within 7 business days after inspection. Products must be unused and in original packaging.
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
                      We accept prepaid payments only via UPI, Paytm, GPay, Debit Card, and Credit Card. After payment, please enter the payment reference number to confirm your order.
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
                      Platform fee: ₹10 (applied to all orders)<br />
                      Delivery fee: ₹60 (applied to all orders)
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-10">
                    <AccordionTrigger>I forgot my password. How do I reset it?</AccordionTrigger>
                    <AccordionContent>
                      Please contact our support team at tapandbuy.in@gmail.com with your registered email. Admin will reset your password and provide you with a new one.
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
