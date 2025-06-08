
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Heart, AlertTriangle, Activity, TrendingUp, Calendar, Clock, Phone } from 'lucide-react';
import DoctorPatientList from '@/components/doctor/DoctorPatientList';
import HealthAnalytics from '@/components/analytics/HealthAnalytics';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { direction } = useLanguage();
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 0,
    criticalPatients: 0,
    warningPatients: 0,
    normalPatients: 0,
    totalAlerts: 0,
    appointmentsToday: 0
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    // Generate sample stats
    setDashboardStats({
      totalPatients: 25,
      criticalPatients: 2,
      warningPatients: 5,
      normalPatients: 18,
      totalAlerts: 12,
      appointmentsToday: 8
    });
  };

  const recentAlerts = [
    {
      id: '1',
      patientName: 'أحمد محمد الزياني',
      type: 'معدل ضربات القلب مرتفع',
      severity: 'critical',
      time: '10:30 ص',
      heartRate: 140
    },
    {
      id: '2',
      patientName: 'فاطمة علي السنوسي',
      type: 'عدم انتظام ضربات القلب',
      severity: 'warning',
      time: '09:15 ص',
      heartRate: 120
    },
    {
      id: '3',
      patientName: 'عمر سالم القذافي',
      type: 'انخفاض معدل ضربات القلب',
      severity: 'warning',
      time: '08:45 ص',
      heartRate: 45
    }
  ];

  const todayAppointments = [
    {
      id: '1',
      patientName: 'محمد عبد الرحمن',
      time: '14:00',
      type: 'متابعة دورية',
      status: 'scheduled'
    },
    {
      id: '2',
      patientName: 'زينب حسين',
      time: '15:30',
      type: 'استشارة طارئة',
      status: 'urgent'
    },
    {
      id: '3',
      patientName: 'سالم أحمد',
      time: '16:00',
      type: 'فحص شامل',
      status: 'scheduled'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical': return 'حرج';
      case 'warning': return 'تحذير';
      default: return 'طبيعي';
    }
  };

  return (
    <div className={`space-y-6 ${direction === 'rtl' ? 'font-cairo' : ''}`}>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">مرحباً د. {user?.email}</h1>
        <p className="text-blue-100">لوحة تحكم شاملة لمتابعة جميع مرضاك</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المرضى</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalPatients}</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +2 مرضى جدد هذا الأسبوع
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالات حرجة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{dashboardStats.criticalPatients}</div>
            <p className="text-xs text-gray-600 mt-1">تحتاج متابعة فورية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مواعيد اليوم</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.appointmentsToday}</div>
            <p className="text-xs text-gray-600 mt-1">مواعيد مجدولة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تحذيرات</CardTitle>
            <Activity className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{dashboardStats.warningPatients}</div>
            <p className="text-xs text-gray-600 mt-1">تحتاج مراقبة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالات طبيعية</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboardStats.normalPatients}</div>
            <p className="text-xs text-gray-600 mt-1">مستقرة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التنبيهات</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalAlerts}</div>
            <p className="text-xs text-gray-600 mt-1">اليوم</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="patients">المرضى</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  التنبيهات الأخيرة
                </CardTitle>
                <CardDescription>آخر التنبيهات من المرضى</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium">{alert.patientName}</p>
                      <p className="text-sm text-gray-600">{alert.type}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {getSeverityLabel(alert.severity)}
                        </Badge>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{alert.heartRate} bpm</p>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        اتصال
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  مواعيد اليوم
                </CardTitle>
                <CardDescription>المواعيد المجدولة لهذا اليوم</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="mr-3">
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{appointment.time}</p>
                      <Badge variant={appointment.status === 'urgent' ? 'destructive' : 'default'}>
                        {appointment.status === 'urgent' ? 'طارئ' : 'مجدول'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients">
          <DoctorPatientList />
        </TabsContent>

        <TabsContent value="analytics">
          <HealthAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
