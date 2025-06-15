
import React, { useState, useEffect } from 'react';
import { useRole, UserRole } from '@/contexts/RoleContext';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import RoleDisplay from './RoleDisplay';
import RoleSelector from './RoleSelector';
import RoleUpdateButton from './RoleUpdateButton';
import DatabaseInfo from './DatabaseInfo';
import RoleNotifications from './RoleNotifications';
import { useRoleUpdate } from './hooks/useRoleUpdate';

const RoleSwitcher = () => {
  const { userRole, setUserRole } = useRole();
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole);
  
  const {
    isLoading,
    dbRole,
    roleLabels,
    fetchCurrentDbRole,
    handleRoleChange
  } = useRoleUpdate(user, setUserRole);

  const handleUpdate = () => handleRoleChange(selectedRole);

  useEffect(() => {
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
        <RoleNotifications user={user} />

        <div className="space-y-3">
          <RoleDisplay userRole={userRole} roleLabels={roleLabels} />
          <RoleSelector selectedRole={selectedRole} onRoleChange={setSelectedRole} />
          <RoleUpdateButton 
            onUpdate={handleUpdate}
            isLoading={isLoading}
            selectedRole={selectedRole}
            currentRole={userRole}
          />
        </div>

        <DatabaseInfo 
          user={user}
          selectedRole={selectedRole}
          dbRole={dbRole}
          onRefresh={fetchCurrentDbRole}
        />
      </CardContent>
    </Card>
  );
};

export default RoleSwitcher;
