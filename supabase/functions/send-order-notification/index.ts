import { createClient } from 'jsr:@supabase/supabase-js@2';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  email: string;
  userName: string;
  orderId: string;
  type: 'order_placed' | 'order_delivered' | 'return_approved' | 'cancellation_approved';
  orderTotal?: string;
  trackingInfo?: string;
  refundAmount?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, userName, orderId, type, orderTotal, trackingInfo, refundAmount }: NotificationRequest = await req.json();

    if (!email || !userName || !orderId || !type) {
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

    let subject = '';
    let emailContent = '';

    switch (type) {
      case 'order_placed':
        subject = `Order Confirmed - ${orderId} - Tap And Buy`;
        emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Tap And Buy</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Order Confirmed!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Hi ${userName},</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Thank you for your order! We're excited to confirm that we've received your order and it's being processed.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #22c55e; border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <p style="color: #166534; font-size: 14px; font-weight: 600; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Order Details</p>
                    <p style="color: #15803d; font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">Order ID: ${orderId}</p>
                    ${orderTotal ? `<p style="color: #15803d; font-size: 18px; font-weight: 700; margin: 0;">Total: ₹${orderTotal}</p>` : ''}
                  </td>
                </tr>
              </table>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <strong style="color: #92400e;">📦 Delivery Timeline:</strong> Your order will be delivered within 6-8 business days. You can track your order status in the Orders section of your account.
              </p>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                If you have any questions, please don't hesitate to contact us.
              </p>
            </td>
          </tr>
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
        break;

      case 'order_delivered':
        subject = `Order Delivered - ${orderId} - Tap And Buy`;
        emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Delivered</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Tap And Buy</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Order Delivered!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Hi ${userName},</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Great news! Your order has been successfully delivered. We hope you enjoy your purchase!
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #22c55e; border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <p style="color: #166534; font-size: 14px; font-weight: 600; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Order ID</p>
                    <p style="color: #15803d; font-size: 18px; font-weight: 700; margin: 0;">${orderId}</p>
                  </td>
                </tr>
              </table>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; padding: 15px; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <strong style="color: #1e40af;">💡 Tip:</strong> If you received a damaged product, please share an unboxing video to tapandbuy.in@gmail.com with your order ID within 12 hours to request a return.
              </p>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                Thank you for shopping with Tap And Buy! We hope to serve you again soon.
              </p>
            </td>
          </tr>
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
        break;

      case 'return_approved':
        subject = `Return Request Approved - ${orderId} - Tap And Buy`;
        emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Return Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Tap And Buy</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Return Request Approved</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Hi ${userName},</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Your return request has been approved. We will process your refund shortly.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #22c55e; border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <p style="color: #166534; font-size: 14px; font-weight: 600; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Return Details</p>
                    <p style="color: #15803d; font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">Order ID: ${orderId}</p>
                    ${refundAmount ? `<p style="color: #15803d; font-size: 18px; font-weight: 700; margin: 0;">Refund Amount: ₹${refundAmount}</p>` : ''}
                  </td>
                </tr>
              </table>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <strong style="color: #92400e;">⏰ Refund Timeline:</strong> Your refund will be processed to your original payment method within 7 business days. Please note that delivery charges are not refundable.
              </p>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                Thank you for your patience and understanding.
              </p>
            </td>
          </tr>
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
        break;

      case 'cancellation_approved':
        subject = `Order Cancellation Approved - ${orderId} - Tap And Buy`;
        emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cancellation Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Tap And Buy</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Order Cancellation Approved</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Hi ${userName},</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Your order cancellation request has been approved. We will process your refund shortly.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #22c55e; border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <p style="color: #166534; font-size: 14px; font-weight: 600; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Order ID</p>
                    <p style="color: #15803d; font-size: 18px; font-weight: 700; margin: 0;">${orderId}</p>
                  </td>
                </tr>
              </table>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <strong style="color: #92400e;">⏰ Refund Timeline:</strong> Your refund will be processed to your original payment method within 7 business days.
              </p>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                We're sorry to see you cancel this order. We hope to serve you better in the future!
              </p>
            </td>
          </tr>
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
        break;
    }

    // Plain text version
    const textContent = emailContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

    // Send email using SMTP
    const client = new SmtpClient();

    await client.connectTLS({
      hostname: 'smtp.gmail.com',
      port: 465,
      username: GMAIL_USER,
      password: GMAIL_APP_PASSWORD,
    });

    await client.send({
      from: GMAIL_USER,
      to: email,
      subject: subject,
      content: textContent,
      html: emailContent,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
