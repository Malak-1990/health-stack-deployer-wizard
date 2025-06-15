
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/contexts/RoleContext';

interface RoleDisplayProps {
  userRole: UserRole;
  roleLabels: Record<UserRole, string>;
}

const RoleDisplay = ({ userRole, roleLabels }: RoleDisplayProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">النوع الحالي:</span>
      <Badge variant="outline">
        {roleLabels[userRole]}
      </Badge>
    </div>
  );
};

export default RoleDisplay;
