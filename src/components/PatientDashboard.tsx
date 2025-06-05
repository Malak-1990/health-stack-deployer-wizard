
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
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
      
      <CurrentHeartRateCard 
        currentHeartRate={currentHeartRate}
        heartRateStatus={heartRateStatus}
      />
      
      <BluetoothConnection onHeartRateUpdate={handleHeartRateUpdate} />
      
      <DeviceManager />
      
      <HealthStatsCards 
        heartRateStats={heartRateStats}
        currentHeartRate={currentHeartRate}
      />
      
      <HeartRateCard onUpdate={loadHeartRateStats} />
      
      <HealthTipsCard />
      
      {/* مدير التنبيهات الفورية */}
      <RealTimeAlertManager />
    </div>
  );
};

export default PatientDashboard;
