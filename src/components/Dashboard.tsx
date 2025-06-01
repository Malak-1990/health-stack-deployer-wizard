
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, Settings, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole } from '@/contexts/RoleContext';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import FamilyDashboard from './FamilyDashboard';
import RoleSelector from './RoleSelector';
import ProjectInfo from './ProjectInfo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { userRole } = useRole();
  const { toast } = useToast();
  const { language, setLanguage, t, direction } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: t('success'),
      description: "تم تسجيل الخروج بنجاح",
    });
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const renderDashboardContent = () => {
    switch (userRole) {
      case 'doctor':
        return <DoctorDashboard />;
      case 'family':
        return <FamilyDashboard />;
      case 'patient':
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className={direction === 'rtl' ? 'mr-3' : 'ml-3'}>
                <h1 className="text-xl font-semibold text-gray-900">
                  نظام مراقبة مرضى القلب
                </h1>
                <p className="text-sm text-gray-600">جامعة الزاوية</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {t('welcome')}، {user?.email}
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    {t('settings')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={toggleLanguage}>
                    <Globe className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'English' : 'العربية'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Selector */}
        <div className="mb-8">
          <RoleSelector />
        </div>

        {/* Dashboard Content */}
        <div className="mb-8">
          {renderDashboardContent()}
        </div>

        {/* Project Information */}
        <div className="mt-12">
          <ProjectInfo />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
