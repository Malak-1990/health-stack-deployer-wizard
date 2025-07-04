
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/contexts/RoleContext';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Settings, User, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import PatientDashboard from '@/components/PatientDashboard';
import LogoutButton from '@/components/LogoutButton';

const PatientDashboardPage = () => {
  const { user } = useAuth();
  const { userRole } = useRole();
  const { direction } = useLanguage();
  const { showInstallButton, handleInstallClick } = usePWAInstall();

  return (
    <div className={`min-h-screen bg-gray-50 ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <User className="h-6 w-6 text-red-600" />
              </div>
              <div className={direction === 'rtl' ? 'mr-3' : 'ml-3'}>
                <h1 className="text-xl font-semibold text-gray-900">
                  لوحة تحكم المريض
                </h1>
                <p className="text-sm text-gray-600">مرحباً، {user?.user_metadata?.full_name || user?.email}</p>
                <p className="text-xs text-red-600">نوع الحساب: {userRole === 'patient' ? 'مريض' : userRole}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* PWA Install Button */}
              {showInstallButton && (
                <Button variant="outline" size="sm" onClick={handleInstallClick}>
                  <Download className="h-4 w-4 mr-2" />
                  تحميل التطبيق
                </Button>
              )}
              
              <Link to="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  الإعدادات
                </Button>
              </Link>
              
              {/* Logout Button */}
              <LogoutButton variant="outline" size="sm" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PatientDashboard />
      </div>
    </div>
  );
};

export default PatientDashboardPage;
