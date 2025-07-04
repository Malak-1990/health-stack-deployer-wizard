import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useRole, UserRole } from '@/contexts/RoleContext';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: any }>;
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

  // Persist user role in localStorage for quick access
  const persistUserRole = (role: UserRole | null) => {
    if (role) localStorage.setItem('userRole', role);
    else localStorage.removeItem('userRole');
  };

  // Fetch user role from profiles table or fallback default
  const fetchAndSetUserRole = async (user: User): Promise<UserRole> => {
    try {
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

      if (error || !profile) {
        console.error('Failed to fetch role, defaulting to patient:', error?.message);
        setUserRole('patient');
        persistUserRole('patient');
        return 'patient';
      }

      const role = ['admin', 'doctor', 'family'].includes(profile.role) ? profile.role : 'patient';
      setUserRole(role);
      persistUserRole(role);
      return role;
    } catch (err) {
      console.error('Unexpected error fetching role:', err);
      setUserRole('patient');
      persistUserRole('patient');
      return 'patient';
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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

      if (event === 'SIGNED_IN' && currentUser && !hasRedirected) {
        setHasRedirected(true);
        setTimeout(() => {
          if (!mounted) return;
          const path = window.location.pathname;
          if (path === '/' || path === '/auth') {
            window.location.href = '/dashboard'; // RoleRouter should redirect accordingly
          }
        }, 100);
      }

      if (event === 'SIGNED_OUT') {
        setHasRedirected(false);
        setUserRole(null);
        persistUserRole(null);
      }
    });

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
  }, [setUserRole]);

  const signUp = async (email: string, password: string, fullName: string, role?: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { full_name: fullName, role: role ?? 'patient' }
        }
      });
      console.log('Sign up result:', error ? `Error: ${error.message}` : 'Success');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      console.log('Sign in result:', error ? `Error: ${error.message}` : 'Success');
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
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
