
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Users, Shield, Monitor, Bell, Globe } from 'lucide-react';

const ProjectInfo = () => {
  const { t, direction } = useLanguage();

  const students = [
    'هديل عبد الحكيم الفرجي',
    'مغفرة محمد الافيرك',
    'دعاء مختار سالم'
  ];

  const features = [
    { icon: Heart, text: 'واجهة مستخدم سهلة وبسيطة' },
    { icon: Globe, text: 'دعم كامل للغة العربية' },
    { icon: Monitor, text: 'تصميم متجاوب يعمل على جميع الأجهزة' },
    { icon: Users, text: 'مراقبة مباشرة لمؤشرات القلب' },
    { icon: Bell, text: 'تنبيهات فورية للحالات الحرجة' },
    { icon: Shield, text: 'نظام آمن ومحمي للبيانات الطبية' }
  ];

  const technologies = [
    'React & TypeScript',
    'Supabase',
    'Tailwind CSS',
    'WebSocket للاتصال المباشر',
    'PWA Support'
  ];

  return (
    <div className={`space-y-6 ${direction === 'rtl' ? 'font-cairo' : ''}`}>
      {/* Project Header */}
      <Card className="bg-gradient-to-r from-red-50 to-blue-50 border-red-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-red-100 rounded-full">
                <Heart className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-red-800">
              {t('projectTitle')}
            </h1>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {t('projectDescription')}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students & Supervisor */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              {t('students')}
            </h2>
            <ul className="space-y-2 mb-6">
              {students.map((student, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className={direction === 'rtl' ? 'mr-3' : 'ml-3'}>{student}</span>
                </li>
              ))}
            </ul>
            
            <h3 className="text-lg font-semibold mb-2 text-green-800">
              {t('supervisor')}
            </h3>
            <p className="text-gray-700">د. سناء أبولجام</p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-800">
              {t('features')}
            </h2>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="h-5 w-5 text-purple-600" />
                  <span className={`${direction === 'rtl' ? 'mr-3' : 'ml-3'} text-gray-700`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technologies */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-800">
            {t('technologies')}
          </h2>
          <div className="flex flex-wrap gap-3">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectInfo;
