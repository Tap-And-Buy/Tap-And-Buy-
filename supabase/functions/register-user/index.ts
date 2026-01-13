import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple encryption function (matches frontend)
const SECRET_KEY = 'TapAndBuy2024SecureKey!@#$%';

function encryptPassword(password: string): string {
  let encrypted = '';
  for (let i = 0; i < password.length; i++) {
    const charCode = password.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    encrypted += String.fromCharCode(charCode);
  }
  return btoa(encrypted);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      throw new Error('Email, password, and full name are required');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      throw new Error('This email is already registered. Please login instead.');
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // We'll verify manually
      user_metadata: {
        full_name: fullName,
      },
    });

    if (authError) throw authError;

    // Encrypt password
    const encryptedPassword = encryptPassword(password);
    
    // Manually create profile with encrypted password
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        role: 'customer',
        encrypted_password: encryptedPassword,
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Don't throw - user is created, just log the error
    }

    // Generate verification URL
    const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173';
    const verificationUrl = `${siteUrl}/verify-email?token=${authData.user.id}`;
    
    // Call send-verification-email function
    const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
      body: { email, verificationUrl, fullName },
    });

    if (emailError) {
      console.error('Error sending verification email:', emailError);
      // Don't throw - user is created, just log the error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Registration successful. Please check your email to verify your account.',
        user: authData.user 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
