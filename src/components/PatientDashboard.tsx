
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import HeartRateCard from './HeartRateCard';
import DailyLogCard from './DailyLogCard';
import AppointmentsCard from './AppointmentsCard';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { t, direction } = useLanguage();
  const [stats, setStats] = useState({
    currentHeartRate: null as number | null,
    averageHeartRate: null as number | null,
    todayReadings: 0,
    upcomingAppointments: 0
  });

  useEffect(() => {
    if (user) {
      loadPatientStats();
    }
  }, [user]);

  const loadPatientStats = async () => {
    if (!user) return;

    try {
      // Get today's heart rate readings
      const today = new Date().toISOString().split('T')[0];
      const { data: todayReadings } = await supabase
        .from('heart_rate_readings')
        .select('heart_rate')
        .eq('user_id', user.id)
        .gte('recorded_at', today)
        .order('recorded_at', { ascending: false });

      // Get weekly average
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: weeklyReadings } = await supabase
        .from('heart_rate_readings')
        .select('heart_rate')
        .eq('user_id', user.id)
        .gte('recorded_at', weekAgo.toISOString());

      // Get upcoming appointments
      const { count: appointmentCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'scheduled')
        .gte('appointment_date', new Date().toISOString());

      setStats({
        currentHeartRate: todayReadings && todayReadings.length > 0 ? todayReadings[0].heart_rate : null,
        averageHeartRate: weeklyReadings && weeklyReadings.length > 0 
          ? Math.round(weeklyReadings.reduce((sum, r) => sum + r.heart_rate, 0) / weeklyReadings.length)
          : null,
        todayReadings: todayReadings?.length || 0,
        upcomingAppointments: appointmentCount || 0
      });
    } catch (error) {
      console.error('Error loading patient stats:', error);
    }
  };

  const getHeartRateStatus = (heartRate: number | null) => {
    if (!heartRate) return 'normal';
    if (heartRate > 100) return 'high';
    if (heartRate < 60) return 'low';
    return 'normal';
  };

  const status = getHeartRateStatus(stats.currentHeartRate);

  return (
    <div className={`space-y-6 ${direction === 'rtl' ? 'font-cairo' : ''}`}>
      {/* Welcome Message */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('welcome_back')}، {user?.email}
        </h1>
        <p className="text-gray-600">{t('today')}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={status === 'high' ? 'border-red-500 bg-red-50' : status === 'low' ? 'border-yellow-500 bg-yellow-50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('heartRate')}</CardTitle>
            <Heart className={`h-4 w-4 ${status === 'high' ? 'text-red-600' : status === 'low' ? 'text-yellow-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.currentHeartRate ? `${stats.currentHeartRate} ${t('bpm')}` : t('noData')}
            </div>
            <p className="text-xs text-muted-foreground">
              {t(status)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المتوسط الأسبوعي</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageHeartRate ? `${stats.averageHeartRate} ${t('bpm')}` : t('noData')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قراءات اليوم</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayReadings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('appointments')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Health Monitoring Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <HeartRateCard onUpdate={loadPatientStats} />
          <DailyLogCard />
        </div>
        <div>
          <AppointmentsCard />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
