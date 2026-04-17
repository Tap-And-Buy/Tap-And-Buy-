import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return new Response(
        JSON.stringify({ error: 'Missing email or token' }),
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

    // Verify the token exists and is valid
    const { data: verification, error: verifyError } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('token', token)
      .eq('email', email)
      .eq('verified', true)
      .single();

    if (verifyError || !verification) {
      return new Response(
        JSON.stringify({ error: 'Invalid verification' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update the user's email_confirmed_at in auth.users
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers();

    if (getUserError) {
      console.error('Error listing users:', getUserError);
      return new Response(
        JSON.stringify({ error: 'Failed to confirm email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const user = users.users.find(u => u.email === email);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update user's email_confirmed_at
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      email_confirm: true,
    });

    if (updateError) {
      console.error('Error updating user:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to confirm email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email confirmed successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error confirming email:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to confirm email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
