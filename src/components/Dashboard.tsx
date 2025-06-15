
import { useRole } from '@/contexts/RoleContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { userRole } = useRole();

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">تحديد الصلاحيات...</p>
        </div>
      </div>
    );
  }

  let redirectPath = '/patient-dashboard';
  switch (userRole) {
    case 'admin':
      redirectPath = '/admin-dashboard';
      break;
    case 'doctor':
      redirectPath = '/doctor-dashboard';
      break;
    case 'family':
      redirectPath = '/family-dashboard';
      break;
    case 'patient':
    default:
      redirectPath = '/patient-dashboard';
      break;
  }
  
  return <Navigate to={redirectPath} replace />;
};

export default Dashboard;
