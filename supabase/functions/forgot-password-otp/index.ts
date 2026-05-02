import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ForgotPasswordRequest {
  email: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email }: ForgotPasswordRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error checking user:', userError);
      // Don't reveal if user exists or not for security
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'If an account exists with this email, you will receive a password reset code.' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userExists = userData.users.some(u => u.email === email);

    if (!userExists) {
      // Don't reveal if user exists or not for security
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'If an account exists with this email, you will receive a password reset code.' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
    const SMTP_USER = Deno.env.get('SMTP_USER') || 'tapandbuy.in@gmail.com';

    if (!BREVO_API_KEY) {
      console.error('Brevo API key not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email content with OTP
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - Tap And Buy</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Tap And Buy</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Password Reset Request</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                We received a request to reset your password. Use the verification code below to proceed with resetting your password:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #22c55e; border-radius: 12px; padding: 30px; display: inline-block;">
                      <p style="color: #166534; font-size: 14px; font-weight: 600; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Reset Code</p>
                      <p style="color: #15803d; font-size: 48px; font-weight: 700; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                    </div>
                  </td>
                </tr>
              </table>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <strong style="color: #92400e;">⏰ Important:</strong> This reset code will expire in <strong>10 minutes</strong>. Please enter it soon to reset your password.
              </p>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                If you didn't request a password reset, please ignore this email and your password will remain unchanged.
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
Password Reset Request - Tap And Buy

We received a request to reset your password. Use the verification code below to proceed with resetting your password:

YOUR RESET CODE: ${otp}

This reset code will expire in 10 minutes.

If you didn't request a password reset, please ignore this email and your password will remain unchanged.

Need help? Contact us at tapandbuy.in@gmail.com

© 2026 Tap And Buy. All rights reserved.
    `.trim();

    // Delete old OTPs for this email
    await supabase
      .from('password_reset_otps')
      .delete()
      .eq('email', email);

    // Insert new OTP
    const { error: dbError } = await supabase
      .from('password_reset_otps')
      .insert({
        email,
        otp,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      });

    if (dbError) {
      console.error('Error storing OTP:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate reset code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email using Brevo API
    try {
      console.log('Attempting to send password reset email to:', email);
      console.log('Using Brevo API');
      
      const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: 'Tap And Buy',
            email: SMTP_USER,
          },
          to: [
            {
              email: email,
            },
          ],
          subject: 'Password Reset Code - Tap And Buy',
          htmlContent: emailContent,
          textContent: textContent,
        }),
      });

      if (!brevoResponse.ok) {
        const errorData = await brevoResponse.text();
        console.error('Brevo API error:', errorData);
        throw new Error(`Brevo API error: ${brevoResponse.status} - ${errorData}`);
      }

      const result = await brevoResponse.json();
      console.log('Password reset email sent successfully via Brevo API:', result);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Password reset code sent to your email',
          emailSent: true
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      console.error('Error details:', JSON.stringify(emailError, null, 2));
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send password reset email',
          details: emailError.message || 'Email sending failed',
          errorType: emailError.constructor.name
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process password reset request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
