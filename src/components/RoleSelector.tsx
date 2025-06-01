
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole, UserRole } from '@/contexts/RoleContext';
import { Heart, Stethoscope, Users } from 'lucide-react';

const RoleSelector = () => {
  const { t, direction } = useLanguage();
  const { userRole, setUserRole } = useRole();
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole);

  const roles = [
    {
      id: 'patient' as UserRole,
      icon: Heart,
      title: t('patient'),
      description: 'مراقبة الحالة الصحية الشخصية',
      color: 'bg-red-500'
    },
    {
      id: 'doctor' as UserRole,
      icon: Stethoscope,
      title: t('doctor'),
      description: 'إدارة ومتابعة المرضى',
      color: 'bg-blue-500'
    },
    {
      id: 'family' as UserRole,
      icon: Users,
      title: t('family'),
      description: 'متابعة حالة أحد أفراد العائلة',
      color: 'bg-green-500'
    }
  ];

  const handleRoleChange = () => {
    setUserRole(selectedRole);
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${direction === 'rtl' ? 'font-cairo' : ''}`}>
      <CardHeader>
        <CardTitle className="text-center">
          {t('role')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedRole === role.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole(role.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${role.color}`}>
                <role.icon className="h-5 w-5 text-white" />
              </div>
              <div className={direction === 'rtl' ? 'mr-3 text-right' : 'ml-3'}>
                <h3 className="font-semibold">{role.title}</h3>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          onClick={handleRoleChange} 
          className="w-full"
          disabled={selectedRole === userRole}
        >
          {t('save')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleSelector;
