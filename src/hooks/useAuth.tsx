
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

  const fetchAndSetUserRole = async (user: User) => {
    try {
      const isAdminEmail = user.email === 'malaksalama21@gmail.com';
      if (isAdminEmail) {
        setUserRole('admin');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role, defaulting to patient:', error.message);
        setUserRole('patient');
        return;
      }

      const dbRole = profile?.role;
      let finalRole: UserRole = 'patient';

      switch (dbRole) {
        case 'admin':
        case 'doctor':
        case 'family':
          finalRole = dbRole;
          break;
        case 'user':
        default:
          finalRole = 'patient';
          break;
      }
      setUserRole(finalRole);
    } catch (error) {
      console.error('Unexpected error fetching role:', error);
      setUserRole('patient');
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);
        const currentUser = session?.user ?? null;
        setSession(session);
        setUser(currentUser);

        const rolePromise = currentUser ? fetchAndSetUserRole(currentUser) : Promise.resolve(setUserRole(null));
        
        rolePromise.finally(() => {
            if (mounted) setLoading(false);
        });

        if (event === 'SIGNED_IN' && session?.user && !hasRedirected) {
          console.log('User signed in, redirecting to dashboard...');
          setHasRedirected(true);
          setTimeout(() => {
            if (mounted) {
              const currentPath = window.location.pathname;
              if (currentPath === '/auth' || currentPath === '/') {
                window.location.href = '/dashboard';
              }
            }
          }, 100);
        }

        if (event === 'SIGNED_OUT') {
          setHasRedirected(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
        if (!mounted) return;
        const currentUser = session?.user ?? null;
        setSession(session);
        setUser(currentUser);
        const rolePromise = currentUser ? fetchAndSetUserRole(currentUser) : Promise.resolve(setUserRole(null));
        rolePromise.finally(() => {
            if (mounted) setLoading(false);
        });
    });


    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUserRole]);

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
      await supabase.auth.signOut();
      console.log('User signed out');
      // Redirect to landing page
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
    }}>
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
