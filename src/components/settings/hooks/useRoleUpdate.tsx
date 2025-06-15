
import { useState } from 'react';
import { UserRole } from '@/contexts/RoleContext';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useRoleUpdate = (user: User | null, setUserRole: (role: UserRole) => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dbRole, setDbRole] = useState<string | null>(null);

  const roleLabels = {
    patient: 'مريض',
    doctor: 'طبيب', 
    family: 'عائلة',
    admin: 'admin'
  };

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

  const handleRoleChange = async (selectedRole: UserRole) => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log('Attempting to update role for user:', user.id, 'to:', selectedRole);
      
      const dbRoleValue = mapToDbRole(selectedRole);
      console.log('Mapped database role:', dbRoleValue);

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

      setUserRole(selectedRole);
      setDbRole(dbRoleValue);
      
      toast({
        title: "تم التحديث بنجاح",
        description: `تم تغيير نوع المستخدم إلى ${roleLabels[selectedRole]}`,
      });

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

  return {
    isLoading,
    dbRole,
    roleLabels,
    fetchCurrentDbRole,
    handleRoleChange
  };
};
