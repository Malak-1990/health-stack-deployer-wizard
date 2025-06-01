
import { useRole } from '@/contexts/RoleContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { userRole } = useRole();

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
