import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useRole, UserRole } from '@/contexts/RoleContext';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const { setUserRole } = useRole();

  // Helper: persist role to localStorage
  const persistUserRole = (role: UserRole | null) => {
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  // Helper: get cached role
  const getCachedUserRole = (): UserRole => {
    const role = localStorage.getItem('userRole') as UserRole | null;
    if (
      role === 'admin' ||
      role === 'doctor' ||
      role === 'family' ||
      role === 'patient'
    ) {
      return role;
    }
    return 'patient';
  };

  // Fetch role from Supabase profiles table and update context + storage
  const fetchAndSetUserRole = async (user: User) => {
    try {
      // Hardcoded admin email shortcut
      if (user.email === 'malaksalama21@gmail.com') {
        setUserRole('admin');
        persistUserRole('admin');
        return 'admin';
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role, defaulting to patient:', error.message);
        setUserRole('patient');
        persistUserRole('patient');
        return 'patient';
      }

      let finalRole: UserRole = 'patient';

      switch (profile?.role) {
        case 'admin':
        case 'doctor':
        case 'family':
          finalRole = profile.role;
          break;
        case 'user':
        default:
          finalRole = 'patient';
          break;
      }
      setUserRole(finalRole);
      persistUserRole(finalRole);
      return finalRole;
    } catch (error) {
      console.error('Unexpected error fetching role:', error);
      setUserRole('patient');
      persistUserRole('patient');
      return 'patient';
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);

        const currentUser = session?.user ?? null;
        setSession(session);
        setUser(currentUser);

        if (currentUser) {
          await fetchAndSetUserRole(currentUser);
        } else {
          setUserRole(null);
          persistUserRole(null);
        }

        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user && !hasRedirected) {
          setHasRedirected(true);

          setTimeout(() => {
            if (!mounted) return;

            const currentPath = window.location.pathname;
            if (currentPath === '/auth' || currentPath === '/') {
              const role = getCachedUserRole();
              window.location.href = `/dashboard/${role}`;
            }
          }, 100);
        }

        if (event === 'SIGNED_OUT') {
          setHasRedirected(false);
          setUserRole(null);
          persistUserRole(null);
        }
      }
    );

    // Initial session fetch on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setSession(session);
      setUser(currentUser);

      if (currentUser) {
        await fetchAndSetUserRole(currentUser);
      } else {
        setUserRole(null);
        persistUserRole(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUserRole, hasRedirected]);

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { full_name: fullName }
        }
      });

      console.log('Sign up result:', error ? 'Error: ' + error.message : 'Success');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in result:', error ? 'Error: ' + error.message : 'Success');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      setHasRedirected(false);
      setUserRole(null);
      persistUserRole(null);
      await supabase.auth.signOut();
      console.log('User signed out');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
