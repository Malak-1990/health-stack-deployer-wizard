
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, User, Shield, UserCog, Users } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
}

const AdminUserManager = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        toast({
          title: 'خطأ',
          description: 'فشل في تحميل بيانات المستخدمين',
          variant: 'destructive'
        });
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        toast({
          title: 'خطأ',
          description: 'فشل في تحديث دور المستخدم',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'تم التحديث بنجاح',
        description: 'تم تحديث دور المستخدم بنجاح'
      });

      // Refresh users list
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'doctor':
        return <UserCog className="h-4 w-4" />;
      case 'family':
        return <Users className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'مشرف';
      case 'doctor':
        return 'طبيب';
      case 'family':
        return 'عائلة';
      default:
        return 'مريض';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'family':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            إدارة المستخدمين
          </CardTitle>
          <CardDescription>
            عرض وإدارة جميع المستخدمين في النظام وتحديث أدوارهم
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="البحث بالاسم أو المعرف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="role-filter">تصفية حسب الدور</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأدوار</SelectItem>
                  <SelectItem value="user">مريض</SelectItem>
                  <SelectItem value="doctor">طبيب</SelectItem>
                  <SelectItem value="family">عائلة</SelectItem>
                  <SelectItem value="admin">مشرف</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد مستخدمين مطابقين للبحث
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {user.full_name || 'بدون اسم'}
                      </h4>
                      <Badge className={getRoleColor(user.role)}>
                        <div className="flex items-center gap-1">
                          {getRoleIcon(user.role)}
                          {getRoleLabel(user.role)}
                        </div>
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>المعرف: {user.id}</p>
                      <p>تاريخ التسجيل: {new Date(user.created_at).toLocaleDateString('ar-EG')}</p>
                      {user.emergency_contact_name && (
                        <p>جهة الاتصال: {user.emergency_contact_name}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select
                      value={user.role}
                      onValueChange={(newRole) => updateUserRole(user.id, newRole)}
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
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Admin Setup */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-semibold text-blue-900 mb-2">إعداد سريع للمشرف</h5>
            <p className="text-blue-700 text-sm mb-3">
              لتعيين المستخدم malaksalama21@gmail.com كمشرف، انقر على الزر أدناه:
            </p>
            <Button
              onClick={() => {
                const targetUser = users.find(u => u.id.includes('malaksalama21') || u.full_name?.includes('malak'));
                if (targetUser) {
                  updateUserRole(targetUser.id, 'admin');
                } else {
                  toast({
                    title: 'المستخدم غير موجود',
                    description: 'لم يتم العثور على المستخدم المحدد',
                    variant: 'destructive'
                  });
                }
              }}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              تعيين كمشرف
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManager;
