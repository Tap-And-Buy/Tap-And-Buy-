import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Log connection info (without exposing sensitive data)
console.log('Initializing Supabase client...');
console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? 'SET (length: ' + supabaseAnonKey.length + ')' : 'MISSING');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'tapandbuy-auth',
  },
  global: {
    headers: {
      'x-application-name': 'tapandbuy',
    },
    fetch: (url, options = {}) => {
      console.log('Supabase fetch:', url);
      return fetch(url, {
        ...options,
        // Add timeout
        signal: AbortSignal.timeout(30000), // 30 second timeout
      }).catch((error: unknown) => {
        const err = error as Error;
        console.error('Supabase fetch error:', err);
        if (err.name === 'AbortError') {
          throw new Error('Request timeout. Please check your internet connection.');
        }
        if (err.message?.includes('Failed to fetch')) {
          throw new Error('Network error. Please check your internet connection or try again later.');
        }
        throw error;
      });
    },
  },
});

// Test connection on initialization
(async () => {
  try {
    const { error } = await supabase
      .from('categories')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      console.error('Please check:');
      console.error('1. Your internet connection');
      console.error('2. Supabase service status');
      console.error('3. Environment variables are correct');
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (error: unknown) {
    console.error('Supabase connection test error:', error);
  }
})();
