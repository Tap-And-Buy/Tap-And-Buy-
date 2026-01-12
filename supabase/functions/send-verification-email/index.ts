import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple decryption function
const SECRET_KEY = 'TapAndBuy2024SecureKey!@#$%';

function decryptPassword(encryptedPassword: string): string {
  const encrypted = atob(encryptedPassword);
  let decrypted = '';
  for (let i = 0; i < encrypted.length; i++) {
    const charCode = encrypted.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    decrypted += String.fromCharCode(charCode);
  }
  return decrypted;
}

// Encrypted credentials
const ENCRYPTED_GMAIL = 'IAAAIAAAIAAAHFlcdDQIAhweSygKFA==';
const ENCRYPTED_PASSWORD = 'Mw4bNAJWcUBIAwQFAGc=';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, verificationUrl, fullName } = await req.json();

    if (!email || !verificationUrl) {
      throw new Error('Email and verification URL are required');
    }

    // Decrypt Gmail credentials
    const gmailEmail = decryptPassword(ENCRYPTED_GMAIL);
    const gmailPassword = decryptPassword(ENCRYPTED_PASSWORD);

    // Create SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: 'smtp.gmail.com',
        port: 465,
        tls: true,
        auth: {
          username: gmailEmail,
          password: gmailPassword,
        },
      },
    });

    // Send email
    await client.send({
      from: `Tap And Buy <${gmailEmail}>`,
      to: email,
      subject: 'Welcome to Tap And Buy - Verify Your Email',
      content: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Tap And Buy! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${fullName || 'there'},</p>
              <p>Thank you for registering with <strong>Tap And Buy</strong>! We're excited to have you join our community.</p>
              <p>To complete your registration and start shopping, please verify your email address by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify My Email</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              <p>If you didn't create an account with Tap And Buy, please ignore this email.</p>
              <p>Happy shopping!</p>
              <p><strong>The Tap And Buy Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2024 Tap And Buy. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      html: true,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: 'Verification email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
