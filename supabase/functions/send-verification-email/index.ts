import { createClient } from 'jsr:@supabase/supabase-js@2';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  email: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email }: EmailRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
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

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Email content with OTP
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account - Tap And Buy</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Tap And Buy</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Welcome to our community!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Thank you for registering with Tap And Buy! To complete your registration and start shopping, please use the verification code below:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #22c55e; border-radius: 12px; padding: 30px; display: inline-block;">
                      <p style="color: #166534; font-size: 14px; font-weight: 600; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                      <p style="color: #15803d; font-size: 48px; font-weight: 700; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                    </div>
                  </td>
                </tr>
              </table>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <strong style="color: #92400e;">⏰ Important:</strong> This verification code will expire in <strong>10 minutes</strong>. Please enter it soon to verify your account.
              </p>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                If you didn't create an account with Tap And Buy, please ignore this email.
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

    // Plain text version
    const textContent = `
Welcome to Tap And Buy!

Thank you for registering with Tap And Buy. To complete your registration and start shopping, please use the verification code below:

YOUR VERIFICATION CODE: ${otp}

This verification code will expire in 10 minutes.

If you didn't create an account with Tap And Buy, please ignore this email.

Need help? Contact us at tapandbuy.in@gmail.com

© 2026 Tap And Buy. All rights reserved.
    `.trim();

    // Store the OTP in the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Delete old OTPs for this email
    await supabase
      .from('email_verifications')
      .delete()
      .eq('email', email);

    // Insert new OTP
    const { error: dbError } = await supabase
      .from('email_verifications')
      .insert({
        email,
        otp,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      });

    if (dbError) {
      console.error('Error storing OTP:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate verification code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
        subject: 'Verify Your Account - Tap And Buy',
        content: textContent,
        html: emailContent,
      });

      await client.close();

      console.log('Verification email sent successfully to:', email);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Verification email sent successfully',
          emailSent: true,
          recipient: email
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send verification email',
          details: emailError.message || 'Email sending failed'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Verification email error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send verification email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
