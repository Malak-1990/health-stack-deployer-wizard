
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Activity, Calendar, TrendingUp, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { t, direction } = useLanguage();
  const { toast } = useToast();
  const [heartRate, setHeartRate] = useState(72);
  const [recentReadings, setRecentReadings] = useState<number[]>([]);
  const [stats, setStats] = useState({
    avgHeartRate: 0,
    todayReadings: 0,
    weeklyTrend: '+2.3%'
  });

  useEffect(() => {
    loadPatientData();
    // Simulate heart rate updates
    const interval = setInterval(() => {
      const newRate = Math.floor(Math.random() * (85 - 60) + 60);
      setHeartRate(newRate);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadPatientData = async () => {
    try {
      // Load heart rate readings
      const { data: readings } = await supabase
        .from('heart_rate_readings')
        .select('heart_rate, recorded_at')
        .eq('user_id', user?.id)
        .order('recorded_at', { ascending: false })
        .limit(10);

      if (readings) {
        const rates = readings.map(r => r.heart_rate);
        setRecentReadings(rates);
        
        if (rates.length > 0) {
          const avg = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
          setStats(prev => ({
            ...prev,
            avgHeartRate: Math.round(avg),
            todayReadings: rates.length
          }));
        }
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
    }
  };

  const getHeartRateStatus = (rate: number) => {
    if (rate < 60) return { status: 'low', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (rate > 100) return { status: 'high', color: 'text-red-600', bg: 'bg-red-100' };
    return { status: 'normal', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const heartRateStatus = getHeartRateStatus(heartRate);

  const recordHeartRate = async () => {
    try {
      const { error } = await supabase
        .from('heart_rate_readings')
        .insert({
          user_id: user?.id,
          heart_rate: heartRate,
          recorded_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'تم حفظ القراءة',
        description: `تم تسجيل معدل نبضات القلب: ${heartRate} نبضة/دقيقة`,
      });

      loadPatientData();
    } catch (error) {
      console.error('Error recording heart rate:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في حفظ القراءة',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className={`space-y-6 ${direction === 'rtl' ? 'font-cairo' : ''}`}>
      {/* Current Heart Rate */}
      <Card className="border-2 border-red-200 bg-red-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center">
            <Heart className="h-6 w-6 text-red-600 mr-2" />
            معدل نبضات القلب الحالي
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-6xl font-bold text-red-600 mb-2">{heartRate}</div>
          <div className="text-lg text-gray-600 mb-4">نبضة في الدقيقة</div>
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${heartRateStatus.bg} ${heartRateStatus.color}`}>
            {t(heartRateStatus.status)}
          </div>
          <div className="mt-4">
            <Button onClick={recordHeartRate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              تسجيل القراءة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط معدل النبض</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgHeartRate}</div>
            <p className="text-xs text-muted-foreground">نبضة/دقيقة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قراءات اليوم</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayReadings}</div>
            <p className="text-xs text-muted-foreground">قراءة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الاتجاه الأسبوعي</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.weeklyTrend}</div>
            <p className="text-xs text-muted-foreground">تحسن</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Readings */}
      <Card>
        <CardHeader>
          <CardTitle>القراءات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          {recentReadings.length > 0 ? (
            <div className="space-y-2">
              {recentReadings.slice(0, 5).map((reading, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <span className="font-medium">{reading} نبضة/دقيقة</span>
                  <span className={`px-2 py-1 rounded text-xs ${getHeartRateStatus(reading).bg} ${getHeartRateStatus(reading).color}`}>
                    {t(getHeartRateStatus(reading).status)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">لا توجد قراءات سابقة</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;
