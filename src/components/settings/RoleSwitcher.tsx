
import React, { useState } from 'react';
import { useRole, UserRole } from '@/contexts/RoleContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserCheck, AlertTriangle, RefreshCw } from 'lucide-react';

const RoleSwitcher = () => {
  const { userRole, setUserRole } = useRole();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole);
  const [dbRole, setDbRole] = useState<string | null>(null);

  const roleLabels = {
    patient: 'مريض',
    doctor: 'طبيب', 
    family: 'عائلة',
    admin: 'admin'
  };

  // Map frontend roles to database roles
  const mapToDbRole = (frontendRole: UserRole): string => {
    switch (frontendRole) {
      case 'patient':
        return 'user';
      case 'doctor':
        return 'doctor';
      case 'family':
        return 'family';
      case 'admin':
        return 'admin';
      default:
        return 'user';
    }
  };

  const fetchCurrentDbRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching role:', error);
        setDbRole('خطأ في الحصول على الدور');
      } else {
        setDbRole(data?.role || 'غير محدد');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setDbRole('خطأ غير متوقع');
    }
  };

  const handleRoleChange = async () => {
    if (!user || selectedRole === userRole) return;

    setIsLoading(true);
    try {
      console.log('Attempting to update role for user:', user.id, 'to:', selectedRole);
      
      const dbRoleValue = mapToDbRole(selectedRole);
      console.log('Mapped database role:', dbRoleValue);

      // Use upsert to handle both insert and update cases
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          role: dbRoleValue,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Database upsert error:', error);
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `فشل في تحديث الملف الشخصي: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      // Update local role state
      setUserRole(selectedRole);
      setDbRole(dbRoleValue);
      
      toast({
        title: "تم التحديث بنجاح",
        description: `تم تغيير نوع المستخدم إلى ${roleLabels[selectedRole]}`,
      });

      // Redirect to appropriate dashboard after a short delay
      setTimeout(() => {
        const targetPath = selectedRole === 'admin' ? '/admin-dashboard' :
                          selectedRole === 'doctor' ? '/doctor-dashboard' :
                          selectedRole === 'family' ? '/family-dashboard' :
                          '/patient-dashboard';
        
        console.log('Redirecting to:', targetPath);
        window.location.href = targetPath;
      }, 1500);

    } catch (error) {
      console.error('Unexpected error during role update:', error);
      toast({
        title: "خطأ غير متوقع",
        description: "حدث خطأ غير متوقع أثناء تحديث نوع المستخدم",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch current DB role on component mount
  React.useEffect(() => {
    fetchCurrentDbRole();
  }, [user]);

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-600">
          <AlertTriangle className="h-5 w-5" />
          تبديل نوع المستخدم (مؤقت)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-800 mb-2">
            <strong>✅ تم الإصلاح:</strong> مشكلة إنشاء المستخدمين الجدد
          </p>
          <p className="text-xs text-green-600">
            الآن يمكن إنشاء حسابات جديدة بدون أخطاء في قاعدة البيانات
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">النوع الحالي:</span>
            <Badge variant="outline">
              {roleLabels[userRole]}
            </Badge>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">تغيير إلى:</span>
            <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">🩺 مريض</SelectItem>
                <SelectItem value="doctor">👨‍⚕️ طبيب</SelectItem>
                <SelectItem value="family">👨‍👩‍👧‍👦 عائلة</SelectItem>
                <SelectItem value="admin">⚡ admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleRoleChange}
            disabled={isLoading || selectedRole === userRole}
            className="w-full"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            {isLoading ? 'جاري التحديث...' : 'تطبيق التغيير'}
          </Button>

          <Button 
            onClick={fetchCurrentDbRole}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث معلومات قاعدة البيانات
          </Button>
        </div>

        {user?.email === 'malaksalama21@gmail.com' && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>ملاحظة:</strong> بصفتك مطور التطبيق، يجب أن يكون نوعك "admin"
            </p>
          </div>
        )}

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>معلومات التشخيص:</strong><br/>
            معرف المستخدم: {user?.id}<br/>
            البريد الإلكتروني: {user?.email}<br/>
            النوع المحدد: {selectedRole}<br/>
            الدور في قاعدة البيانات: {dbRole || 'جاري التحميل...'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleSwitcher;
