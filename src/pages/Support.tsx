import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Mail } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Support() {
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
      return 'Return Policy: Returns are accepted only for damaged products within 12 hours of delivery. Orders below ₹200 are not eligible for return or refund. The refund covers product price only (delivery fee excluded).';
    }

    if (lower.includes('track') || lower.includes('order')) {
      return 'To track your order, please go to the Orders page from the bottom navigation. You can view your order status and tracking information there. Each order has a unique Order ID (TAB######).';
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

    if (lower.includes('discount') || lower.includes('offer')) {
      return 'Automatic discounts available: ₹40 off on orders above ₹700, ₹100 off on orders above ₹1200, ₹150 off on orders above ₹2500. Free delivery on orders above ₹500!';
    }

    if (lower.includes('fee') || lower.includes('charge')) {
      return 'Platform fee: ₹10 (applied to all orders). Delivery fee: ₹60 (waived for orders above ₹500).';
    }

    if (lower.includes('contact') || lower.includes('email') || lower.includes('help')) {
      return 'For further assistance, please contact us at: tapandbuy.in@gmail.com';
    }

    return 'I can help you with: order tracking, return policy, delivery timeline, cancellations, payment methods, discounts, and fees. For other queries, please contact us at tapandbuy.in@gmail.com';
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
        <Card className="h-[calc(100vh-200px)] flex flex-col">
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

        <Card className="mt-4 bg-muted/50">
          <CardContent className="p-4 text-center">
            <Mail className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="font-semibold mb-1">Need More Help?</p>
            <p className="text-sm text-muted-foreground">
              Contact us at:{' '}
              <a href="mailto:tapandbuy.in@gmail.com" className="text-primary hover:underline">
                tapandbuy.in@gmail.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
