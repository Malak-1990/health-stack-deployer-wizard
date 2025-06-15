
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
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          console.log('Fetching role for user:', user.id, user.email);
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', user.id)
            .single();

          console.log('Profile data:', profile);
          console.log('Profile error:', error);

          let finalRole = 'user';

          if (error) {
            console.error('Error fetching user role:', error);
            // If there's an error, create the profile with admin role for your email
            if (user.email === 'malaksalama21@gmail.com') {
              console.log('Creating admin profile for:', user.email);
              const { error: insertError } = await supabase
                .from('profiles')
                .upsert([
                  {
                    id: user.id,
                    full_name: user.user_metadata?.full_name || 'Malak',
                    role: 'admin'
                  }
                ]);
              
              if (!insertError) {
                finalRole = 'admin';
              }
            }
          } else if (profile && profile.role) {
            console.log('Found user role in database:', profile.role);
            finalRole = profile.role;
          } else {
            // If no role found, but this is your email, make admin
            if (user.email === 'malaksalama21@gmail.com') {
              console.log('No role found, creating admin for:', user.email);
              const { error: updateError } = await supabase
                .from('profiles')
                .upsert([
                  {
                    id: user.id,
                    full_name: user.user_metadata?.full_name || 'Malak',
                    role: 'admin'
                  }
                ]);
              
              if (!updateError) {
                finalRole = 'admin';
              }
            }
          }

          setUserDbRole(finalRole);
          
          // Map database roles to frontend roles and set redirect path
          let frontendRole: 'patient' | 'doctor' | 'family' | 'admin' = 'patient';
          let targetPath = '/patient-dashboard';
          
          switch (finalRole) {
            case 'admin':
              frontendRole = 'admin';
              targetPath = '/admin-dashboard';
              break;
            case 'doctor':
              frontendRole = 'doctor';
              targetPath = '/doctor-dashboard';
              break;
            case 'family':
              frontendRole = 'family';
              targetPath = '/family-dashboard';
              break;
            case 'user':
            default:
              frontendRole = 'patient';
              targetPath = '/patient-dashboard';
              break;
          }
          
          setUserRole(frontendRole);
          setRedirectPath(targetPath);
          
        } catch (error) {
          console.error('Unexpected error:', error);
          setUserDbRole('user');
          setUserRole('patient');
          setRedirectPath('/patient-dashboard');
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
          {user && (
            <div className="mt-4 text-sm text-gray-500">
              <p>البريد الإلكتروني: {user.email}</p>
              <p>معرف المستخدم: {user.id}</p>
              <p>الدور من قاعدة البيانات: {userDbRole || 'جاري التحميل...'}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If no user, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If we have a redirect path, use it
  if (redirectPath) {
    console.log('Redirecting user with role:', userDbRole, 'to:', redirectPath, 'Email:', user.email);
    return <Navigate to={redirectPath} replace />;
  }

  // Fallback to patient dashboard
  return <Navigate to="/patient-dashboard" replace />;
};

export default Dashboard;
