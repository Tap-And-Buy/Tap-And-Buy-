import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/db/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types';
import { db } from '@/db/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const profileData = await db.profiles.getCurrent();
      if (profileData) {
        setProfile(profileData);
      } else {
        // Profile doesn't exist, try to create it
        console.log('Profile not found, attempting to create...');
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const newProfile = await db.profiles.create({
            id: user.id,
            email: user.email || '',
            phone: user.phone || '',
            full_name: user.user_metadata?.full_name || '',
            role: 'customer',
          });
          setProfile(newProfile);
          console.log('✅ Profile created successfully');
        }
      }
    } catch (error) {
      console.error('Error fetching/creating profile:', error);
      // Don't block navigation - just set profile to null
      setProfile(null);
      // Don't show error toast - profile is optional for navigation
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('🔐 AuthContext: Initializing...');
    
    // Safety timeout - ensure loading becomes false after 5 seconds max
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('⚠️ Auth initialization timeout - setting loading to false');
        setLoading(false);
      }
    }, 5000);

    // Initial session check
    console.log('🔐 AuthContext: Checking session...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('❌ Error getting session:', error);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      console.log('✅ Session check complete:', session ? 'User logged in' : 'No user');
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('🔐 AuthContext: Fetching profile...');
        refreshProfile().finally(() => {
          if (mounted) {
            console.log('✅ Profile fetch complete, loading = false');
            setLoading(false);
          }
        });
      } else {
        console.log('✅ No user, loading = false');
        setLoading(false);
      }
    }).catch((err) => {
      console.error('❌ Session check failed:', err);
      if (mounted) {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('🔐 Auth state changed:', event);
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await refreshProfile();
      } else {
        setProfile(null);
        
        // Only show toast for unexpected sign outs
        if (event === 'SIGNED_OUT' && user) {
          toast.error('You have been signed out. Please log in again.');
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
