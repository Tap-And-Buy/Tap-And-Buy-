import { createClient } from 'jsr:@supabase/supabase-js@2';

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

    // Send verification email (OTP will be generated in send-verification-email function)
    const { data: emailData, error: emailError } = await supabase.functions.invoke('send-verification-email', {
      body: {
        email,
      },
    });

    if (emailError) {
      console.error('Email sending error:', emailError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send verification email. Please try again.',
          details: emailError.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if email function returned an error
    if (emailData && emailData.error) {
      console.error('Email function error:', emailData.error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send verification email. Please try again.',
          details: emailData.error 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        userId: authData.user.id,
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
