import { supabase } from '@/db/supabase';

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    supabaseUrl: string;
    hasAnonKey: boolean;
    canConnect: boolean;
    error?: string;
  };
}

export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Check environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      success: false,
      message: 'Missing Supabase environment variables',
      details: {
        supabaseUrl: supabaseUrl || 'MISSING',
        hasAnonKey: !!supabaseAnonKey,
        canConnect: false,
        error: 'Environment variables not configured',
      },
    };
  }

  // Test connection
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1);

    if (error) {
      return {
        success: false,
        message: 'Failed to connect to Supabase',
        details: {
          supabaseUrl,
          hasAnonKey: true,
          canConnect: false,
          error: error.message,
        },
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase',
      details: {
        supabaseUrl,
        hasAnonKey: true,
        canConnect: true,
      },
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      message: 'Network error or Supabase unreachable',
      details: {
        supabaseUrl,
        hasAnonKey: true,
        canConnect: false,
        error: err.message || 'Unknown error',
      },
    };
  }
}

export async function testAuth(): Promise<ConnectionTestResult> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return {
        success: false,
        message: 'Auth error',
        details: {
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
          hasAnonKey: true,
          canConnect: true,
          error: error.message,
        },
      };
    }

    return {
      success: true,
      message: data.session ? 'User is logged in' : 'No active session',
      details: {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: true,
        canConnect: true,
      },
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      message: 'Failed to check auth status',
      details: {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: true,
        canConnect: false,
        error: err.message,
      },
    };
  }
}
