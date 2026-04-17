import { createClient } from 'jsr:@supabase/supabase-js@2';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

interface OrderConfirmationRequest {
  email: string;
  orderId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  platformFee: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customerName?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      email,
      orderId,
      orderNumber,
      items,
      subtotal,
      platformFee,
      deliveryFee,
      discount,
      total,
      customerName,
    }: OrderConfirmationRequest = await req.json();

    if (!email || !orderNumber || !items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GMAIL_USER = Deno.env.get('GMAIL_USER');
    const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD');

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.error('Gmail credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate order items HTML
    const orderItemsHTML = items.map(item => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #1f2937; font-weight: 600; font-size: 15px;">${item.product_name}</p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 13px;">Quantity: ${item.quantity}</p>
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          <p style="margin: 0; color: #1f2937; font-weight: 600; font-size: 15px;">₹${item.product_price.toFixed(2)}</p>
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          <p style="margin: 0; color: #1f2937; font-weight: 700; font-size: 15px;">₹${item.subtotal.toFixed(2)}</p>
        </td>
      </tr>
    `).join('');

    // Email content
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Tap And Buy</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="650" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Tap And Buy</h1>
              <p style="color: #ffffff; margin: 15px 0 0 0; font-size: 18px; opacity: 0.95;">Thank you for your order!</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 26px; font-weight: 600;">Order Confirmed! 🎉</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                ${customerName ? `Hi ${customerName},<br><br>` : ''}Thank you for shopping with Tap And Buy! We're excited to process your order and get it delivered to you soon.
              </p>
              
              <!-- Order Info Box -->
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #22c55e; border-radius: 10px; padding: 20px; margin: 25px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 5px 0;">
                      <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 600;">Order Number</p>
                      <p style="margin: 5px 0 0 0; color: #15803d; font-size: 20px; font-weight: 700; font-family: 'Courier New', monospace;">${orderNumber}</p>
                    </td>
                    <td style="padding: 5px 0; text-align: right;">
                      <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 600;">Order Date</p>
                      <p style="margin: 5px 0 0 0; color: #15803d; font-size: 16px; font-weight: 600;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Order Items -->
              <h3 style="color: #1f2937; margin: 30px 0 15px 0; font-size: 20px; font-weight: 600;">Order Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px 15px; text-align: left; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                    <th style="padding: 12px 15px; text-align: right; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                    <th style="padding: 12px 15px; text-align: right; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItemsHTML}
                </tbody>
              </table>

              <!-- Order Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 15px;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right; color: #1f2937; font-size: 15px; font-weight: 600;">₹${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 15px;">Platform Fee</td>
                  <td style="padding: 8px 0; text-align: right; color: #1f2937; font-size: 15px; font-weight: 600;">₹${platformFee.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 15px;">Delivery Fee</td>
                  <td style="padding: 8px 0; text-align: right; color: #1f2937; font-size: 15px; font-weight: 600;">${deliveryFee === 0 ? '<span style="color: #22c55e;">FREE</span>' : `₹${deliveryFee.toFixed(2)}`}</td>
                </tr>
                ${discount > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #22c55e; font-size: 15px; font-weight: 600;">Discount Applied</td>
                  <td style="padding: 8px 0; text-align: right; color: #22c55e; font-size: 15px; font-weight: 700;">-₹${discount.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr style="border-top: 2px solid #e5e7eb;">
                  <td style="padding: 15px 0 0 0; color: #1f2937; font-size: 18px; font-weight: 700;">Total Amount</td>
                  <td style="padding: 15px 0 0 0; text-align: right; color: #22c55e; font-size: 22px; font-weight: 700;">₹${total.toFixed(2)}</td>
                </tr>
              </table>

              <!-- Delivery Info -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.6;">
                  <strong style="font-size: 16px;">📦 Delivery Information</strong><br>
                  Your order will be delivered within <strong>6 to 8 business days</strong>. If not delivered within 8 days, it may take an additional 1 to 3 days.
                </p>
              </div>

              <!-- Track Order CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 15px;">Track your order status anytime from your account</p>
                  </td>
                </tr>
              </table>

              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                If you have any questions about your order, please don't hesitate to contact us.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                Need help? Contact us at <a href="mailto:tapandbuy.in@gmail.com" style="color: #22c55e; text-decoration: none; font-weight: 600;">tapandbuy.in@gmail.com</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                © 2026 Tap And Buy. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // Plain text version
    const textContent = `
Thank you for your order!

${customerName ? `Hi ${customerName},\n\n` : ''}Thank you for shopping with Tap And Buy! We're excited to process your order and get it delivered to you soon.

ORDER DETAILS
Order Number: ${orderNumber}
Order Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}

ITEMS ORDERED:
${items.map(item => `- ${item.product_name} (Qty: ${item.quantity}) - ₹${item.product_price.toFixed(2)} each = ₹${item.subtotal.toFixed(2)}`).join('\n')}

ORDER SUMMARY:
Subtotal: ₹${subtotal.toFixed(2)}
Platform Fee: ₹${platformFee.toFixed(2)}
Delivery Fee: ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
${discount > 0 ? `Discount Applied: -₹${discount.toFixed(2)}\n` : ''}Total Amount: ₹${total.toFixed(2)}

DELIVERY INFORMATION:
Your order will be delivered within 6 to 8 business days. If not delivered within 8 days, it may take an additional 1 to 3 days.

Track your order status anytime from your account.

If you have any questions about your order, please contact us at tapandbuy.in@gmail.com

© 2026 Tap And Buy. All rights reserved.
    `.trim();

    // Send email using Gmail SMTP
    try {
      const client = new SmtpClient();

      await client.connectTLS({
        hostname: 'smtp.gmail.com',
        port: 465,
        username: GMAIL_USER,
        password: GMAIL_APP_PASSWORD,
      });

      await client.send({
        from: `Tap And Buy <${GMAIL_USER}>`,
        to: email,
        subject: `Order Confirmation - ${orderNumber} - Tap And Buy`,
        content: textContent,
        html: emailContent,
      });

      await client.close();

      console.log('Order confirmation email sent successfully to:', email);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Order confirmation email sent successfully',
          emailSent: true,
          recipient: email
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send order confirmation email',
          details: emailError.message || 'Email sending failed'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Order confirmation email error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send order confirmation email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
