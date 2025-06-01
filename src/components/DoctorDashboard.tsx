
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Calendar, AlertTriangle, Activity, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  full_name: string;
  email: string;
  latest_heart_rate: number | null;
  last_reading: string | null;
  status: 'normal' | 'warning' | 'critical';
}

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { t, direction } = useLanguage();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalPatients: 0,
    criticalPatients: 0,
    todayAppointments: 0,
    pendingReviews: 0
  });

  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    try {
      // Load patient data with latest heart rate readings
      const { data: profilesData } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          heart_rate_readings (
            heart_rate,
            recorded_at
          )
        `)
        .order('created_at', { ascending: false });

      // Process patient data
      const patientList: Patient[] = (profilesData || []).map(profile => {
        const latestReading = profile.heart_rate_readings?.[0];
        const heartRate = latestReading?.heart_rate || null;
        
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        if (heartRate) {
          if (heartRate > 120 || heartRate < 50) status = 'critical';
          else if (heartRate > 100 || heartRate < 60) status = 'warning';
        }

        return {
          id: profile.id,
          full_name: profile.full_name || 'مريض غير مسمى',
          email: `patient-${profile.id.slice(0, 8)}@example.com`,
          latest_heart_rate: heartRate,
          last_reading: latestReading?.recorded_at || null,
          status
        };
      });

      setPatients(patientList);

      // Calculate stats
      const criticalCount = patientList.filter(p => p.status === 'critical').length;
      
      // Get today's appointments count
      const today = new Date().toISOString().split('T')[0];
      const { count: appointmentCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('appointment_date', today)
        .lt('appointment_date', `${today}T23:59:59`);

      setStats({
        totalPatients: patientList.length,
        criticalPatients: criticalCount,
        todayAppointments: appointmentCount || 0,
        pendingReviews: patientList.filter(p => p.latest_heart_rate).length
      });

    } catch (error) {
      console.error('Error loading doctor data:', error);
      toast({
        title: t('error'),
        description: 'فشل في تحميل بيانات المرضى',
        variant: 'destructive'
      });
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const handlePatientClick = (patientId: string) => {
    toast({
      title: 'عرض ملف المريض',
      description: `سيتم فتح ملف المريض: ${patientId.slice(0, 8)}`,
    });
  };

  return (
    <div className={`space-y-6 ${direction === 'rtl' ? 'font-cairo' : ''}`}>
      {/* Welcome Message */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          لوحة تحكم الطبيب
        </h1>
        <p className="text-gray-600">مرحباً د. {user?.email}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المرضى</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالات حرجة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticalPatients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مواعيد اليوم</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مراجعات معلقة</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>قائمة المرضى</CardTitle>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث عن مريض..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                تصفية
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handlePatientClick(patient.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{patient.full_name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {t(patient.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Activity className="h-3 w-3 mr-1" />
                      {patient.latest_heart_rate ? (
                        `آخر قراءة: ${patient.latest_heart_rate} نبضة/دقيقة`
                      ) : (
                        'لا توجد قراءات'
                      )}
                    </div>
                    {patient.last_reading && (
                      <p className="text-xs text-gray-400">
                        {new Date(patient.last_reading).toLocaleString('ar-EG')}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    عرض الملف
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                {searchTerm ? 'لا توجد نتائج للبحث' : 'لا يوجد مرضى مسجلون'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
