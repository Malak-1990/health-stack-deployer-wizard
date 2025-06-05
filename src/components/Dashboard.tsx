
import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const { userRole } = useRole();
  const { user, loading } = useAuth();

  // Show loading while auth is being determined
  if (loading) {
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

  // Route based on user role
  switch (userRole) {
    case 'doctor':
      return <Navigate to="/doctor-dashboard" replace />;
    case 'family':
      return <Navigate to="/family-dashboard" replace />;
    case 'patient':
    default:
      return <Navigate to="/patient-dashboard" replace />;
  }
};

export default Dashboard;
