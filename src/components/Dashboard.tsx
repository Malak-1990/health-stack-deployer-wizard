
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
          console.log('Fetching role for user:', user.id, user.email);
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', user.id)
            .single();

          console.log('Profile data:', profile);
          console.log('Profile error:', error);

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
                setUserDbRole('admin');
                setUserRole('admin');
              } else {
                console.error('Error creating admin profile:', insertError);
                setUserDbRole('user');
                setUserRole('patient');
              }
            } else {
              setUserDbRole('user');
              setUserRole('patient');
            }
          } else if (profile && profile.role) {
            console.log('Found user role in database:', profile.role);
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
                setUserDbRole('admin');
                setUserRole('admin');
              } else {
                console.error('Error updating to admin:', updateError);
                setUserDbRole('user');
                setUserRole('patient');
              }
            } else {
              setUserDbRole('user');
              setUserRole('patient');
            }
          }
        } catch (error) {
          console.error('Unexpected error:', error);
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

  // Route based on user role from database
  const roleToRoute = userDbRole || userRole;
  
  console.log('Redirecting user with role:', roleToRoute, 'Email:', user.email);
  
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
