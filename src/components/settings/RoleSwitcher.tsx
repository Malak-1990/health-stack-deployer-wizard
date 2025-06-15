
import { useState } from 'react';
import { useRole, UserRole } from '@/contexts/RoleContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserCheck, AlertTriangle } from 'lucide-react';

const RoleSwitcher = () => {
  const { userRole, setUserRole } = useRole();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole);

  const roleLabels = {
    patient: 'مريض',
    doctor: 'طبيب', 
    family: 'عائلة',
    admin: 'مدير'
  };

  const handleRoleChange = async () => {
    if (!user || selectedRole === userRole) return;

    setIsLoading(true);
    try {
      // Update role in database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          role: selectedRole === 'patient' ? 'user' : selectedRole,
          full_name: user.user_metadata?.full_name || user.email
        });

      if (error) {
        console.error('Error updating role:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحديث نوع المستخدم",
          variant: "destructive",
        });
        return;
      }

      // Update local role state
      setUserRole(selectedRole);
      
      toast({
        title: "تم التحديث",
        description: `تم تغيير نوع المستخدم إلى ${roleLabels[selectedRole]}`,
      });

      // Redirect to appropriate dashboard after a short delay
      setTimeout(() => {
        const targetPath = selectedRole === 'admin' ? '/admin-dashboard' :
                          selectedRole === 'doctor' ? '/doctor-dashboard' :
                          selectedRole === 'family' ? '/family-dashboard' :
                          '/patient-dashboard';
        window.location.href = targetPath;
      }, 1500);

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-600">
          <AlertTriangle className="h-5 w-5" />
          تبديل نوع المستخدم (مؤقت)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm text-orange-800 mb-2">
            <strong>تحذير:</strong> هذه الخاصية مؤقتة لحل مشكلة الأدوار
          </p>
          <p className="text-xs text-orange-600">
            سيتم إزالة هذه الخاصية بعد إصلاح المشكلة الأساسية
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
                <SelectItem value="admin">⚡ مدير</SelectItem>
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
        </div>

        {user?.email === 'malaksalama21@gmail.com' && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>ملاحظة:</strong> بصفتك مطور التطبيق، يجب أن يكون نوعك "مدير"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleSwitcher;
