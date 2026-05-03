import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PasswordRequest {
  userId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId }: PasswordRequest = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user password from user_passwords table
    const { data: passwordData, error: passwordError } = await supabase
      .from('user_passwords')
      .select('password')
      .eq('user_id', userId)
      .maybeSingle();

    if (passwordError) {
      console.error('Error fetching password:', passwordError);
      throw passwordError;
    }

    if (!passwordData) {
      return new Response(
        JSON.stringify({ 
          error: 'Password not found',
          message: 'This user account was created before password storage was enabled, or the password was not stored.'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        password: passwordData.password,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get password error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to retrieve password' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
