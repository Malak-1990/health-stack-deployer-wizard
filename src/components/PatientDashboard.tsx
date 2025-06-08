
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeartRateCard from '@/components/HeartRateCard';
import BluetoothConnection from '@/components/BluetoothConnection';
import EmergencyButton from '@/components/EmergencyButton';
import SmartAlertsCard from '@/components/SmartAlertsCard';
import DeviceManager from '@/components/DeviceManager';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import CurrentHeartRateCard from '@/components/dashboard/CurrentHeartRateCard';
import HealthStatsCards from '@/components/dashboard/HealthStatsCards';
import HealthTipsCard from '@/components/dashboard/HealthTipsCard';
import RealTimeAlertManager from '@/components/alerts/RealTimeAlertManager';
import HealthAnalytics from '@/components/analytics/HealthAnalytics';
import LongTermDataHistory from '@/components/dashboard/LongTermDataHistory';
import PatientProfile from '@/components/patient/PatientProfile';
import AppointmentScheduler from '@/components/appointments/AppointmentScheduler';
import HealthRecommendations from '@/components/recommendations/HealthRecommendations';
import MedicalReports from '@/components/reports/MedicalReports';
import { heartRateDataService } from '@/services/HeartRateDataService';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { direction } = useLanguage();
  const [currentHeartRate, setCurrentHeartRate] = useState<number | null>(null);
  const [heartRateStatus, setHeartRateStatus] = useState<'normal' | 'warning' | 'critical'>('normal');
  const [heartRateStats, setHeartRateStats] = useState({
    average: 0,
    min: 0,
    max: 0,
    trend: 'stable' as 'up' | 'down' | 'stable'
  });

  useEffect(() => {
    if (currentHeartRate) {
      // تحديد حالة معدل ضربات القلب
      if (currentHeartRate < 50 || currentHeartRate > 120) {
        setHeartRateStatus('critical');
      } else if (currentHeartRate < 60 || currentHeartRate > 100) {
        setHeartRateStatus('warning');
      } else {
        setHeartRateStatus('normal');
      }

      // حفظ القراءة الجديدة مع التحليل الذكي
      heartRateDataService.saveHeartRateReading({
        heartRate: currentHeartRate
      });
    }
  }, [currentHeartRate]);

  useEffect(() => {
    if (user) {
      loadHeartRateStats();
    }
  }, [user]);

  const loadHeartRateStats = async () => {
    if (!user) return;
    const stats = await heartRateDataService.getHeartRateStats(user.id);
    setHeartRateStats(stats);
  };

  const handleHeartRateUpdate = (heartRate: number) => {
    setCurrentHeartRate(heartRate);
  };

  return (
    <div className={`space-y-6 ${direction === 'rtl' ? 'font-cairo' : ''}`}>
      <WelcomeHeader />
      
      <EmergencyButton currentHeartRate={currentHeartRate || undefined} />
      
      <SmartAlertsCard />
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="monitoring">المراقبة</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="history">السجل</TabsTrigger>
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="appointments">المواعيد</TabsTrigger>
          <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CurrentHeartRateCard 
            currentHeartRate={currentHeartRate}
            heartRateStatus={heartRateStatus}
          />
          
          <HealthStatsCards 
            heartRateStats={heartRateStats}
            currentHeartRate={currentHeartRate}
          />
          
          <HealthTipsCard />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <BluetoothConnection onHeartRateUpdate={handleHeartRateUpdate} />
          
          <DeviceManager />
          
          <HeartRateCard onUpdate={loadHeartRateStats} />
        </TabsContent>

        <TabsContent value="analytics">
          <HealthAnalytics />
        </TabsContent>

        <TabsContent value="history">
          <LongTermDataHistory />
        </TabsContent>

        <TabsContent value="profile">
          <PatientProfile />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentScheduler />
        </TabsContent>

        <TabsContent value="recommendations">
          <HealthRecommendations />
        </TabsContent>

        <TabsContent value="reports">
          <MedicalReports />
        </TabsContent>
      </Tabs>
      
      {/* مدير التنبيهات الفورية */}
      <RealTimeAlertManager />
    </div>
  );
};

export default PatientDashboard;
