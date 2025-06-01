
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Bluetooth, Bell, Globe, User, Shield, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { language, setLanguage, t, direction } = useLanguage();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    bluetoothEnabled: true,
    alertsEnabled: true,
    emergencyAlerts: true,
    dataSharing: false
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast({
      title: 'تم تحديث الإعدادات',
      description: 'تم حفظ التغييرات بنجاح',
    });
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: t('success'),
      description: "تم تسجيل الخروج بنجاح",
    });
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                العودة
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Device Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bluetooth className="h-5 w-5 mr-2" />
                إعدادات الجهاز
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">اتصال البلوتوث</h3>
                  <p className="text-sm text-gray-500">تمكين الاتصال بأجهزة مراقبة القلب</p>
                </div>
                <Switch
                  checked={settings.bluetoothEnabled}
                  onCheckedChange={() => handleSettingChange('bluetoothEnabled')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                إعدادات التنبيهات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">التنبيهات العامة</h3>
                  <p className="text-sm text-gray-500">تلقي تنبيهات حول القراءات الطبيعية</p>
                </div>
                <Switch
                  checked={settings.alertsEnabled}
                  onCheckedChange={() => handleSettingChange('alertsEnabled')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">تنبيهات الطوارئ</h3>
                  <p className="text-sm text-gray-500">تنبيهات فورية للحالات الحرجة</p>
                </div>
                <Switch
                  checked={settings.emergencyAlerts}
                  onCheckedChange={() => handleSettingChange('emergencyAlerts')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                إعدادات اللغة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">لغة التطبيق</h3>
                  <p className="text-sm text-gray-500">اختر اللغة المفضلة</p>
                </div>
                <Button variant="outline" onClick={toggleLanguage}>
                  {language === 'ar' ? 'English' : 'العربية'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                الخصوصية والأمان
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">مشاركة البيانات</h3>
                  <p className="text-sm text-gray-500">السماح بمشاركة البيانات المجهولة للبحث الطبي</p>
                </div>
                <Switch
                  checked={settings.dataSharing}
                  onCheckedChange={() => handleSettingChange('dataSharing')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                إعدادات الحساب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">البريد الإلكتروني</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <Button variant="outline" size="sm">
                  تعديل
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="destructive" onClick={handleSignOut}>
                  تسجيل الخروج
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
