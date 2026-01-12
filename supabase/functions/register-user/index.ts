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

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // We'll send custom verification email
      user_metadata: {
        full_name: fullName,
      },
    });

    if (authError) throw authError;

    // Encrypt and store password in profiles
    const encryptedPassword = encryptPassword(password);
    
    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update profile with encrypted password
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ encrypted_password: encryptedPassword })
      .eq('id', authData.user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
    }

    // Send custom verification email
    const verificationUrl = `${Deno.env.get('SITE_URL')}/verify-email?token=${authData.user.id}`;
    
    // Call send-verification-email function
    const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
      body: { email, verificationUrl, fullName },
    });

    if (emailError) {
      console.error('Error sending verification email:', emailError);
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
