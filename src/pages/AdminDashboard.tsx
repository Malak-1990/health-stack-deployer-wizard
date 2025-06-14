
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/contexts/RoleContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Heart, AlertTriangle, Activity, Database, TrendingUp, Settings } from 'lucide-react';
import { adminService } from '@/services/AdminService';
import { useToast } from '@/hooks/use-toast';
import AdminUserManager from '@/components/AdminUserManager';

interface AdminStats {
  totalUsers: number;
  totalPatients: number;
  totalDoctors: number;
  totalAlerts: number;
  totalReadings: number;
}

interface User {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
}

interface Alert {
  id: string;
  message: string;
  severity: string;
  created_at: string;
  is_read: boolean;
  profiles: {
    full_name: string | null;
    role: string;
  };
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { userRole } = useRole();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  if (userRole !== 'admin') {
    return <Navigate to="/patient-dashboard" replace />;
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, alertsData] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers(),
        adminService.getAllAlerts()
      ]);

      setStats(statsData);
      setUsers(usersData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل بيانات المشرف',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة تحكم المشرف...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">لوحة تحكم المشرف</h1>
        <p className="text-purple-100">إدارة شاملة للنظام والمستخدمين</p>
        <div className="mt-4 text-sm bg-white/10 p-3 rounded-lg">
          <p><strong>مرحباً:</strong> {user?.email}</p>
          <p><strong>الدور:</strong> مشرف النظام</p>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المرضى</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الأطباء</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDoctors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التنبيهات</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAlerts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">القراءات</CardTitle>
              <Database className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReadings}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">المستخدمون</TabsTrigger>
          <TabsTrigger value="alerts">التنبيهات</TabsTrigger>
          <TabsTrigger value="system">النظام</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <AdminUserManager />
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>التنبيهات الأخيرة</CardTitle>
              <CardDescription>جميع التنبيهات في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    لا توجد تنبيهات حالياً
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{alert.message}</h4>
                        <p className="text-sm text-gray-600">
                          المستخدم: {alert.profiles.full_name || 'غير محدد'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(alert.created_at).toLocaleString('ar-EG')}
                        </p>
                      </div>
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.severity === 'critical' ? 'حرج' : 
                         alert.severity === 'warning' ? 'تحذير' : 'معلومات'}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>معلومات النظام</CardTitle>
              <CardDescription>حالة النظام والإعدادات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600 ml-2" />
                    <h4 className="font-semibold text-green-800">النظام يعمل بشكل طبيعي</h4>
                  </div>
                  <p className="text-green-700 text-sm mt-2">
                    جميع الخدمات متاحة وقاعدة البيانات محمية بسياسات RLS
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">قاعدة البيانات</h5>
                    <p className="text-blue-700 text-sm">
                      جميع الجداول محمية بـ Row Level Security (RLS)
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h5 className="font-semibold text-purple-800 mb-2">المصادقة</h5>
                    <p className="text-purple-700 text-sm">
                      نظام مصادقة آمن مع دعم الأدوار المتعددة
                    </p>
                  </div>
                </div>
                
                <Button onClick={loadAdminData} className="w-full">
                  تحديث البيانات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات المشرف
              </CardTitle>
              <CardDescription>إعدادات متقدمة لإدارة النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h5 className="font-semibold text-yellow-800 mb-2">⚠️ تحذير هام</h5>
                  <p className="text-yellow-700 text-sm">
                    التعديلات في هذا القسم تؤثر على النظام بالكامل. يُرجى الحذر عند إجراء أي تغييرات.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h6 className="font-semibold mb-2">إدارة النسخ الاحتياطية</h6>
                    <p className="text-sm text-gray-600 mb-3">
                      إنشاء وإدارة النسخ الاحتياطية لقاعدة البيانات
                    </p>
                    <Button variant="outline" size="sm" disabled>
                      قريباً
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h6 className="font-semibold mb-2">تحليلات النظام</h6>
                    <p className="text-sm text-gray-600 mb-3">
                      تقارير مفصلة عن استخدام النظام والأداء
                    </p>
                    <Button variant="outline" size="sm" disabled>
                      قريباً
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
