
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/contexts/RoleContext';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector = ({ selectedRole, onRoleChange }: RoleSelectorProps) => {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">تغيير إلى:</span>
      <Select value={selectedRole} onValueChange={(value: UserRole) => onRoleChange(value)}>
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
  );
};

export default RoleSelector;
