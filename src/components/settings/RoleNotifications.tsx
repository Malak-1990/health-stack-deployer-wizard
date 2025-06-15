
import React from 'react';
import { User } from '@supabase/supabase-js';

interface RoleNotificationsProps {
  user: User | null;
}

const RoleNotifications = ({ user }: RoleNotificationsProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-800 mb-2">
          <strong>✅ تم الإصلاح:</strong> مشكلة إنشاء المستخدمين الجدد
        </p>
        <p className="text-xs text-green-600">
          الآن يمكن إنشاء حسابات جديدة بدون أخطاء في قاعدة البيانات
        </p>
      </div>

      {user?.email === 'malaksalama21@gmail.com' && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 <strong>ملاحظة:</strong> بصفتك مطور التطبيق، يجب أن يكون نوعك "admin"
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleNotifications;
