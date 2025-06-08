
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import AdvancedSettings from '@/components/settings/AdvancedSettings';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Heart } from 'lucide-react';

const Settings = () => {
  const { direction } = useLanguage();

  return (
    <div className={`min-h-screen p-6 ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
            <p className="text-gray-600">إدارة وتخصيص التطبيق</p>
          </div>
        </div>

        {/* Settings Content */}
        <AdvancedSettings />
      </div>
    </div>
  );
};

export default Settings;
