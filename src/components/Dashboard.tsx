
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
            // If there's an error, default to user
            setUserDbRole('user');
            setUserRole('patient');
          } else if (profile && profile.role) {
            setUserDbRole(profile.role);
            // Map database roles to frontend roles
            switch (profile.role) {
              case 'admin':
                setUserRole('admin');
                break;
              case 'doctor':
                setUserRole('doctor');
                break;
              case 'family':
                setUserRole('family');
                break;
              case 'user':
              default:
                setUserRole('patient');
                break;
            }
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Route based on user role from database
  const roleToRoute = userDbRole || userRole;
  
  console.log('Redirecting user with role:', roleToRoute);
  
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
