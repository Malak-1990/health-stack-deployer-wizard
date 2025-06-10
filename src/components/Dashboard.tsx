
import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { userRole, setUserRole } = useRole();
  const { user, loading } = useAuth();
  const [userDbRole, setUserDbRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user role:', error);
            // If role column doesn't exist yet, default to user
            setUserDbRole('user');
            setUserRole('patient');
          } else if (profile && (profile as any).role) {
            setUserDbRole((profile as any).role);
            setUserRole((profile as any).role as any);
          } else {
            // Fallback to user if no role found
            setUserDbRole('user');
            setUserRole('patient');
          }
        } catch (error) {
          console.error('Error:', error);
          setUserDbRole('user');
          setUserRole('patient');
        }
      }
      setCheckingRole(false);
    };

    fetchUserRole();
  }, [user, setUserRole]);

  // Show loading while auth is being determined
  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no user, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Route based on user role from database
  const roleToRoute = userDbRole || userRole;
  
  switch (roleToRoute) {
    case 'admin':
      return <Navigate to="/admin-dashboard" replace />;
    case 'doctor':
      return <Navigate to="/doctor-dashboard" replace />;
    case 'family':
      return <Navigate to="/family-dashboard" replace />;
    case 'patient':
    case 'user':
    default:
      return <Navigate to="/patient-dashboard" replace />;
  }
};

export default Dashboard;
