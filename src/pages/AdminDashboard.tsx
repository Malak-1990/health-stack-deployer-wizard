
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/contexts/RoleContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Heart, Calendar, AlertTriangle, Activity, Stethoscope, UserCheck, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemStats {
  totalUsers: number;
  totalHeartRateReadings: number;
  totalAppointments: number;
  totalAlerts: number;
}

interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  role: string;
  created_at: string;
  date_of_birth?: string;
  gender?: string;
}

const AdminDashboard = () => {
  const { user, session, loading } = useAuth();
  const { userRole } = useRole();
  const { toast } = useToast();
  
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [heartRateData, setHeartRateData] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // التحقق من الصلاحيات
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const callAdminFunction = async (action: string, data?: any) => {
    if (!session?.access_token) {
      throw new Error('No access token available');
    }

    const url = new URL(`${supabase.supabaseUrl}/functions/v1/admin-data-access`);
    url.searchParams.set('action', action);

    const response = await fetch(url.toString(), {
      method: data ? 'POST' : 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      ...(data && { body: JSON.stringify(data) })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to call admin function');
    }

    return await response.json();
  };

  const loadSystemStats = async () => {
    try {
      setLoadingData(true);
      const result = await callAdminFunction('getSystemStats');
      setSystemStats(result.data);
    } catch (error: any) {
      toast({
        title: 'خطأ في تحميل الإحصائيات',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingData(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingData(true);
      const result = await callAdminFunction('getAllUsers');
      setUsers(result.data || []);
    } catch (error: any) {
      toast({
        title: 'خطأ في تحميل المستخدمين',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingData(false);
    }
  };

  const loadHeartRateData = async () => {
    try {
      setLoadingData(true);
      const result = await callAdminFunction('getAllHeartRateReadings');
      setHeartRateData(result.data || []);
    } catch (error: any) {
      toast({
        title: 'خطأ في تحميل بيانات معدل ضربات القلب',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingData(false);
    }
  };

  const loadAppointments = async () => {
    try {
      setLoadingData(true);
      const result = await callAdminFunction('getAllAppointments');
      setAppointments(result.data || []);
    } catch (error: any) {
      toast({
        title: 'خطأ في تحميل المواعيد',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingData(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await callAdminFunction('updateUserRole', { userId, newRole });
      toast({
        title: 'تم تحديث الدور بنجاح',
        description: 'تم تغيير دور المستخدم بنجاح',
      });
      loadUsers(); // إعادة تحميل قائمة المستخدمين
    } catch (error: any) {
      toast({
        title: 'خطأ في تحديث الدور',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'family': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'doctor': return <Stethoscope className="h-4 w-4" />;
      case 'family': return <Users className="h-4 w-4" />;
      default: return <UserCheck className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    loadSystemStats();
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              لوحة تحكم المشرف
            </h1>
            <p className="text-gray-600">
              إدارة شاملة لنظام مراقبة مرضى القلب
            </p>
          </div>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <Crown className="h-4 w-4 mr-2" />
            مشرف النظام
          </Badge>
        </div>

        {/* System Stats Cards */}
        {systemStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">قراءات معدل ضربات القلب</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.totalHeartRateReadings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المواعيد</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.totalAppointments}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي التنبيهات</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.totalAlerts}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">المستخدمون</TabsTrigger>
            <TabsTrigger value="heartrate">بيانات القلب</TabsTrigger>
            <TabsTrigger value="appointments">المواعيد</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>إدارة المستخدمين</CardTitle>
                    <CardDescription>عرض وإدارة جميع مستخدمي النظام</CardDescription>
                  </div>
                  <Button onClick={loadUsers} disabled={loadingData}>
                    {loadingData ? 'جاري التحميل...' : 'تحديث'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>الدور</TableHead>
                      <TableHead>تاريخ التسجيل</TableHead>
                      <TableHead>الجنس</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name || 'غير محدد'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {getRoleIcon(user.role)}
                            <span className="mr-1">
                              {user.role === 'admin' && 'مشرف'}
                              {user.role === 'doctor' && 'طبيب'}
                              {user.role === 'family' && 'عائلة'}
                              {user.role === 'user' && 'مريض'}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('ar-SA')}
                        </TableCell>
                        <TableCell>{user.gender || 'غير محدد'}</TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(value) => updateUserRole(user.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">مريض</SelectItem>
                              <SelectItem value="doctor">طبيب</SelectItem>
                              <SelectItem value="family">عائلة</SelectItem>
                              <SelectItem value="admin">مشرف</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heartrate" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>بيانات معدل ضربات القلب</CardTitle>
                    <CardDescription>عرض جميع قراءات معدل ضربات القلب للمستخدمين</CardDescription>
                  </div>
                  <Button onClick={loadHeartRateData} disabled={loadingData}>
                    {loadingData ? 'جاري التحميل...' : 'تحديث'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المستخدم</TableHead>
                      <TableHead>معدل ضربات القلب</TableHead>
                      <TableHead>ضغط الدم</TableHead>
                      <TableHead>تاريخ القراءة</TableHead>
                      <TableHead>ملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {heartRateData.map((reading) => (
                      <TableRow key={reading.id}>
                        <TableCell>
                          {reading.profiles?.full_name || 'غير محدد'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Activity className="h-4 w-4 text-red-500 mr-2" />
                            {reading.heart_rate} bpm
                          </div>
                        </TableCell>
                        <TableCell>
                          {reading.systolic_bp && reading.diastolic_bp
                            ? `${reading.systolic_bp}/${reading.diastolic_bp}`
                            : 'غير محدد'
                          }
                        </TableCell>
                        <TableCell>
                          {new Date(reading.recorded_at).toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell>
                          {reading.notes || 'لا توجد ملاحظات'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>إدارة المواعيد</CardTitle>
                    <CardDescription>عرض جميع المواعيد المجدولة</CardDescription>
                  </div>
                  <Button onClick={loadAppointments} disabled={loadingData}>
                    {loadingData ? 'جاري التحميل...' : 'تحديث'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المريض</TableHead>
                      <TableHead>الطبيب</TableHead>
                      <TableHead>نوع الموعد</TableHead>
                      <TableHead>التاريخ والوقت</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>المكان</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          {appointment.profiles?.full_name || 'غير محدد'}
                        </TableCell>
                        <TableCell>{appointment.doctor_name}</TableCell>
                        <TableCell>{appointment.appointment_type}</TableCell>
                        <TableCell>
                          {new Date(appointment.appointment_date).toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={appointment.status === 'scheduled' ? 'default' : 'secondary'}>
                            {appointment.status === 'scheduled' ? 'مجدول' : appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{appointment.location || 'غير محدد'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تحليلات النظام</CardTitle>
                <CardDescription>إحصائيات وتحليلات شاملة لاستخدام النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    تحليلات متقدمة قريباً
                  </h3>
                  <p className="text-gray-500">
                    سيتم إضافة المزيد من التحليلات والتقارير المفصلة
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
