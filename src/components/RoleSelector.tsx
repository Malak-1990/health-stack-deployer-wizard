
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRole } from '@/contexts/RoleContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import RoleAnimations from '@/components/RoleAnimations';
import AuthAnimations from '@/components/AuthAnimations';

const RoleSelector = () => {
  const { setUserRole } = useRole();
  const { direction } = useLanguage();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'family' | null>(null);

  const handleRoleSelect = (role: 'patient' | 'doctor' | 'family') => {
    setSelectedRole(role);
    setUserRole(role);
    
    // توجيه المستخدم حسب الدور
    setTimeout(() => {
      switch (role) {
        case 'doctor':
          navigate('/doctor-dashboard');
          break;
        case 'family':
          navigate('/family-dashboard');
          break;
        case 'patient':
        default:
          navigate('/patient-dashboard');
          break;
      }
    }, 1000);
  };

  const roles = [
    {
      id: 'patient' as const,
      title: 'مريض',
      description: 'مراقبة معدل ضربات القلب والحصول على تنبيهات ذكية',
      features: ['مراقبة مستمرة', 'تنبيهات فورية', 'بيانات مشفرة', 'اتصال بالطبيب']
    },
    {
      id: 'doctor' as const,
      title: 'طبيب',
      description: 'متابعة حالة المرضى وإدارة العلاج',
      features: ['مراقبة متعددة المرضى', 'تقارير مفصلة', 'إنذارات طبية', 'إدارة الحالات']
    },
    {
      id: 'family' as const,
      title: 'عائلة',
      description: 'متابعة أفراد العائلة والاطمئنان على صحتهم',
      features: ['متابعة العائلة', 'تنبيهات الطوارئ', 'تقارير دورية', 'راحة البال']
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4 ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            مرحباً بك في نظام مراقبة صحة القلب
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            اختر دورك للوصول إلى الميزات المناسبة لك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Animation Section */}
          <div className="flex justify-center">
            <AuthAnimations />
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">اختر نوع المستخدم:</h2>
            
            <div className="grid grid-cols-1 gap-4">
              {roles.map((role) => (
                <Card 
                  key={role.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedRole === role.id 
                      ? 'ring-2 ring-blue-500 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{role.title}</CardTitle>
                      <div className="w-16">
                        <RoleAnimations 
                          role={role.id} 
                          isActive={selectedRole === role.id}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{role.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {role.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-500">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* System Features */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">ميزات النظام المتقدمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🔐</div>
                <h4 className="font-semibold mb-1">تشفير متقدم</h4>
                <p className="text-sm text-gray-600">حماية كاملة لجميع البيانات الصحية</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🤖</div>
                <h4 className="font-semibold mb-1">ذكاء اصطناعي</h4>
                <p className="text-sm text-gray-600">تحليل ذكي للبيانات وتنبيهات تلقائية</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">📱</div>
                <h4 className="font-semibold mb-1">أجهزة متعددة</h4>
                <p className="text-sm text-gray-600">دعم للبلوتوث والأجهزة الذكية</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🏥</div>
                <h4 className="font-semibold mb-1">رعاية شاملة</h4>
                <p className="text-sm text-gray-600">ربط المريض والطبيب والعائلة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedRole && (
          <div className="text-center mt-8">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري توجيهك إلى لوحة التحكم...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelector;
