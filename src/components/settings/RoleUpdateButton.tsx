
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCheck } from 'lucide-react';
import { UserRole } from '@/contexts/RoleContext';

interface RoleUpdateButtonProps {
  onUpdate: () => void;
  isLoading: boolean;
  selectedRole: UserRole;
  currentRole: UserRole;
}

const RoleUpdateButton = ({ onUpdate, isLoading, selectedRole, currentRole }: RoleUpdateButtonProps) => {
  return (
    <Button 
      onClick={onUpdate}
      disabled={isLoading || selectedRole === currentRole}
      className="w-full"
    >
      <UserCheck className="h-4 w-4 mr-2" />
      {isLoading ? 'جاري التحديث...' : 'تطبيق التغيير'}
    </Button>
  );
};

export default RoleUpdateButton;
