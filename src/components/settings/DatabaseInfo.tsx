
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { UserRole } from '@/contexts/RoleContext';

interface DatabaseInfoProps {
  user: User | null;
  selectedRole: UserRole;
  dbRole: string | null;
  onRefresh: () => void;
}

const DatabaseInfo = ({ user, selectedRole, dbRole, onRefresh }: DatabaseInfoProps) => {
  return (
    <div className="space-y-4">
      <Button 
        onClick={onRefresh}
        variant="outline"
        size="sm"
        className="w-full"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        تحديث معلومات قاعدة البيانات
      </Button>

      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>معلومات التشخيص:</strong><br/>
          معرف المستخدم: {user?.id}<br/>
          البريد الإلكتروني: {user?.email}<br/>
          النوع المحدد: {selectedRole}<br/>
          الدور في قاعدة البيانات: {dbRole || 'جاري التحميل...'}
        </p>
      </div>
    </div>
  );
};

export default DatabaseInfo;
