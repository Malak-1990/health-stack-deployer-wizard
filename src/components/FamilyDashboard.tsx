import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Phone, AlertTriangle, Calendar, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EmergencyAlertReceiver from '@/components/EmergencyAlertReceiver';

interface PatientData {
  id: string;
  full_name: string;
  latest_heart_rate: number | null;
  last_reading: string | null;
  status: 'normal' | 'warning' | 'critical';
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
}

const FamilyDashboard = () => {
  const { t, direction } = useLanguage();
  const { toast } = useToast();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      // In a real app, this would be based on family relationship
      // For demo, we'll show the first patient's data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, emergency_contact_name, emergency_contact_phone')
        .limit(1)
        .single();

      if (profileData) {
        // Get the latest heart rate reading for this profile
        const { data: heartRateData } = await supabase
          .from('heart_rate_readings')
          .select('heart_rate, recorded_at')
          .eq('user_id', profileData.id)
          .order('recorded_at', { ascending: false })
          .limit(1);

        const latestReading = heartRateData?.[0];
        const heartRate = latestReading?.heart_rate || null;
        
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        if (heartRate) {
          if (heartRate > 120 || heartRate < 50) {
            status = 'critical';
            setIsEmergencyMode(true);
          } else if (heartRate > 100 || heartRate < 60) {
            status = 'warning';
          }
        }

        setPatientData({
          id: profileData.id,
          full_name: profileData.full_name || 'المريض',
          latest_heart_rate: heartRate,
          last_reading: latestReading?.recorded_at || null,
          status,
          emergency_contact_name: profileData.emergency_contact_name,
          emergency_contact_phone: profileData.emergency_contact_phone
        });
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
      toast({
        title: t('error'),
        description: 'فشل في تحميل بيانات المريض',
        variant: 'destructive'
      });
    }
  };

  const handleEmergencyCall = () => {
    if (patientData?.emergency_contact_phone) {
      // In a real app, this would initiate a call
      toast({
        title: 'اتصال طوارئ',
        description: `جاري الاتصال بـ ${patientData.emergency_contact_name}`,
      });
    } else {
      toast({
        title: 'تحذير',
        description: 'لم يتم تعيين رقم الطوارئ',
        variant: 'destructive'
      });
    }
  };

  const handleDoctorCall = () => {
    toast({
      title: 'اتصال بالطبيب',
      description: 'جاري الاتصال بالطبيب المعالج',
    });
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
      default: return 'مستقر';
    }
  };

  return (
    <div className={`space-y-6 ${direction === 'rtl' ? 'font-cairo' : ''}`}>
      {/* Emergency Alerts */}
      <EmergencyAlertReceiver />

      {/* Welcome Message */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          لوحة تحكم العائلة
        </h1>
        <p className="text-gray-600">متابعة حالة {patientData?.full_name || 'المريض'}</p>
      </div>

      {/* Emergency Alert */}
      {isEmergencyMode && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="mr-3">
                  <h3 className="text-lg font-semibold text-red-800">
                    تحذير: حالة طوارئ
                  </h3>
                  <p className="text-red-700">
                    تم رصد قراءات غير طبيعية لمعدل ضربات القلب
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleEmergencyCall}
                  className="bg-red-600 hover:bg-red-700 mr-2"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  اتصال طوارئ
                </Button>
                <Button 
                  onClick={handleDoctorCall}
                  variant="outline"
                  className="border-red-600 text-red-600"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  اتصل بالطبيب
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={patientData ? getStatusColor(patientData.status) : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الحالة الحالية</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patientData ? getStatusText(patientData.status) : t('loading')}
            </div>
            {patientData?.latest_heart_rate && (
              <p className="text-sm text-gray-600">
                {patientData.latest_heart_rate} نبضة/دقيقة
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">آخر قراءة</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {patientData?.last_reading ? (
                new Date(patientData.last_reading).toLocaleString('ar-EG')
              ) : (
                'لا توجد قراءات'
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">جهة الاتصال</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {patientData?.emergency_contact_name ? (
                <>
                  <p className="font-medium">{patientData.emergency_contact_name}</p>
                  <p className="text-gray-600">{patientData.emergency_contact_phone}</p>
                </>
              ) : (
                'لم يتم تعيين جهة اتصال'
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات المريض</CardTitle>
        </CardHeader>
        <CardContent>
          {patientData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">الاسم</h4>
                  <p className="text-gray-900">{patientData.full_name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">آخر معدل ضربات القلب</h4>
                  <p className="text-gray-900">
                    {patientData.latest_heart_rate ? 
                      `${patientData.latest_heart_rate} نبضة/دقيقة` : 
                      'لا توجد قراءات'
                    }
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-700 mb-3">إجراءات سريعة</h4>
                <div className="flex space-x-3">
                  <Button onClick={handleDoctorCall} className="mr-3">
                    <Phone className="h-4 w-4 mr-2" />
                    اتصل بالطبيب
                  </Button>
                  <Button onClick={handleEmergencyCall} variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    اتصال طوارئ
                  </Button>
                  <Button variant="outline" onClick={loadPatientData}>
                    تحديث البيانات
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              {t('loading')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات هامة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2">معدل طبيعي</h4>
              <p className="text-sm text-gray-600">
                معدل ضربات القلب الطبيعي: 60-100 نبضة/دقيقة
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-red-700 mb-2">علامات الخطر</h4>
              <p className="text-sm text-gray-600">
                أكثر من 120 أو أقل من 50 نبضة/دقيقة
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyDashboard;
