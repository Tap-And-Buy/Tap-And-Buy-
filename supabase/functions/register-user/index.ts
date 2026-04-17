import { createClient } from 'jsr:@supabase/supabase-js@2';
import { crypto } from 'jsr:@std/crypto@1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, password, fullName }: RegisterRequest = await req.json();

    if (!email || !password || !fullName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Create user with Supabase Auth (email confirmation disabled)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // We'll handle verification ourselves
      user_metadata: {
        full_name: fullName,
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      if (authError.message.includes('already registered') || authError.message.includes('duplicate')) {
        return new Response(
          JSON.stringify({ error: 'This email is already registered' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        email: email,
        role: 'customer',
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't fail registration if profile creation fails
    }

    // Generate verification token
    const tokenData = new TextEncoder().encode(`${email}-${Date.now()}-${crypto.randomUUID()}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', tokenData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Send verification email (OTP will be generated in send-verification-email function)
    const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
      body: {
        email,
      },
    });

    if (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail registration if email fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        verificationUrl: `${verificationUrl}?token=${token}&email=${encodeURIComponent(email)}`,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Registration failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
