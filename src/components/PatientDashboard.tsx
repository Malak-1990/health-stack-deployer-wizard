
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Activity, Calendar, TrendingUp } from 'lucide-react';
import HeartRateCard from '@/components/HeartRateCard';
import BluetoothConnection from '@/components/BluetoothConnection';
import EmergencyButton from '@/components/EmergencyButton';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { t, direction } = useLanguage();
  const [currentHeartRate, setCurrentHeartRate] = useState<number | null>(null);
  const [heartRateStatus, setHeartRateStatus] = useState<'normal' | 'warning' | 'critical'>('normal');

  useEffect(() => {
    if (currentHeartRate) {
      // Determine heart rate status
      if (currentHeartRate < 50 || currentHeartRate > 120) {
        setHeartRateStatus('critical');
      } else if (currentHeartRate < 60 || currentHeartRate > 100) {
        setHeartRateStatus('warning');
      } else {
        setHeartRateStatus('normal');
      }
    }
  }, [currentHeartRate]);

  const handleHeartRateUpdate = (heartRate: number) => {
    setCurrentHeartRate(heartRate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'critical': return 'حالة حرجة';
      case 'warning': return 'تحتاج متابعة';
      default: return 'طبيعي';
    }
  };

  return (
    <div className={`space-y-6 ${direction === 'rtl' ? 'font-cairo' : ''}`}>
      {/* Welcome Message */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          مرحباً، {user?.email}
        </h1>
        <p className="text-gray-600">لوحة تحكم المريض - متابعة الحالة الصحية</p>
      </div>

      {/* Emergency Button - Only for patients */}
      <EmergencyButton currentHeartRate={currentHeartRate || undefined} />

      {/* Real-time Heart Rate Status */}
      <Card className={currentHeartRate ? getStatusColor(heartRateStatus) : ''}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">معدل النبض الحالي</CardTitle>
          <Heart className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currentHeartRate ? `${currentHeartRate} نبضة/دقيقة` : 'غير متصل'}
          </div>
          {currentHeartRate && (
            <p className="text-sm text-gray-600">
              الحالة: {getStatusText(heartRateStatus)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Bluetooth Connection */}
      <BluetoothConnection onHeartRateUpdate={handleHeartRateUpdate} />

      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط النبض</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82</div>
            <p className="text-xs text-gray-600">نبضة/دقيقة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">آخر قراءة</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentHeartRate ? 'الآن' : '--'}
            </div>
            <p className="text-xs text-gray-600">
              {currentHeartRate ? new Date().toLocaleTimeString('ar-EG') : 'لا توجد قراءات'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الاتجاه</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">مستقر</div>
            <p className="text-xs text-gray-600">آخر 24 ساعة</p>
          </CardContent>
        </Card>
      </div>

      {/* Heart Rate History */}
      <HeartRateCard onUpdate={() => {}} />

      {/* Health Tips */}
      <Card>
        <CardHeader>
          <CardTitle>نصائح صحية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2">معدل طبيعي</h4>
              <p className="text-sm text-gray-600">
                معدل ضربات القلب الطبيعي في الراحة: 60-100 نبضة/دقيقة
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">نصائح مهمة</h4>
              <p className="text-sm text-gray-600">
                تناول الأدوية في مواعيدها وتجنب الإجهاد الزائد
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;
