
import { useLanguage } from '@/contexts/LanguageContext';
import AdvancedSettings from '@/components/settings/AdvancedSettings';
import LogoutButton from '@/components/LogoutButton';
import { Settings as SettingsIcon, User, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Settings = () => {
  const { direction } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen p-6 ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <SettingsIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
              <p className="text-gray-600">إدارة وتخصيص التطبيق</p>
            </div>
          </div>
          <LogoutButton variant="destructive" />
        </div>

        {/* Account Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              إعدادات الحساب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">تسجيل الخروج</h3>
                <p className="text-sm text-gray-600">إنهاء جلسة العمل الحالية</p>
              </div>
              <LogoutButton showText={false} size="sm" />
            </div>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <AdvancedSettings />
      </div>
    </div>
  );
};

export default Settings;
