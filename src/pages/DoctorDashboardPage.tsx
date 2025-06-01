
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import DoctorDashboard from '@/components/DoctorDashboard';

const DoctorDashboardPage = () => {
  const { user } = useAuth();
  const { direction } = useLanguage();

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
                  لوحة تحكم الطبيب
                </h1>
                <p className="text-sm text-gray-600">د. {user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  الإعدادات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DoctorDashboard />
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
