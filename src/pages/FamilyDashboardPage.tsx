
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/contexts/RoleContext';
import { Navigate } from 'react-router-dom';
import { Settings, LogOut, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import FamilyDashboard from '@/components/FamilyDashboard';

const FamilyDashboardPage = () => {
  const { user, signOut } = useAuth();
  const { userRole } = useRole();
  const { direction } = useLanguage();

  // Redirect if not family member
  if (userRole !== 'family') {
    return <Navigate to="/patient-dashboard" replace />;
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className={direction === 'rtl' ? 'mr-3' : 'ml-3'}>
                <h1 className="text-xl font-semibold text-gray-900">
                  لوحة تحكم العائلة
                </h1>
                <p className="text-sm text-gray-600">مرحباً، {user?.user_metadata?.full_name || user?.email}</p>
                <p className="text-xs text-green-600">صلاحيات: متابعة أفراد العائلة</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  الإعدادات
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FamilyDashboard />
      </div>
    </div>
  );
};

export default FamilyDashboardPage;
