
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Activity, Shield, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import ProjectInfo from '@/components/ProjectInfo';

const Landing = () => {
  const { language, setLanguage, t, direction } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const features = [
    {
      icon: Heart,
      title: 'مراقبة مباشرة',
      description: 'مراقبة نبضات القلب في الوقت الفعلي'
    },
    {
      icon: Users,
      title: 'تواصل العائلة',
      description: 'تمكين العائلة من متابعة الحالة الصحية'
    },
    {
      icon: Activity,
      title: 'تقارير طبية',
      description: 'تقارير مفصلة للأطباء والمتخصصين'
    },
    {
      icon: Shield,
      title: 'أمان البيانات',
      description: 'حماية كاملة للمعلومات الطبية'
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className={direction === 'rtl' ? 'mr-3' : 'ml-3'}>
                <h1 className="text-xl font-semibold text-gray-900">
                  نظام مراقبة مرضى القلب
                </h1>
                <p className="text-sm text-gray-600">جامعة الزاوية</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                <Globe className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'English' : 'العربية'}
              </Button>
              <Link to="/auth">
                <Button>
                  {t('signin')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            نظام متكامل لمراقبة الحالة الصحية
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            مراقبة مؤشرات القلب للمرضى بشكل مباشر وآمن
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8 py-3">
              ابدأ الآن
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Information */}
        <ProjectInfo />
      </main>
    </div>
  );
};

export default Landing;
