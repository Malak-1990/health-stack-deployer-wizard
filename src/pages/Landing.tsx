import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Shield, Activity, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProjectInfo from '@/components/ProjectInfo';
import AnimatedFeatureCards from '@/components/AnimatedFeatureCards';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t, direction } = useLanguage();

  useEffect(() => {
    // تسجيل Service Worker للـ PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // إذا كان المستخدم مسجل دخول، توجيهه للوحة التحكم
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
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

  const statistics = [
    { value: 1000, label: 'مستخدمين' },
    { value: 500, label: 'المرضى المراقبين' },
    { value: 200, label: 'العمليات المتابعة' },
    { value: 100, label: 'الإشعارات المفيدة' }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
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
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full animate-ping"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-red-500 rounded-full animate-bounce"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Main Badge */}
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              مشروع تخرج - جامعة الزاوية
            </Badge>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              نظام مراقبة مرضى القلب
              <span className="text-red-600 block">الذكي والمتطور</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              نظام متكامل لمراقبة الحالة الصحية عن بُعد باستخدام تقنيات الذكاء الاصطناعي
              <br />
              <span className="text-blue-600 font-medium">مع تنبيهات فورية وحماية متقدمة للبيانات</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" onClick={handleGetStarted} className="group">
                ابدأ الآن
                <ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/auth')}>
                تسجيل دخول
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>آمن ومشفر</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>مطابق للمعايير الطبية</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>متاح 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Feature Cards */}
      <section className="relative py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ميزات متقدمة لرعاية صحية شاملة
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              تقنيات حديثة وواجهة سهلة الاستخدام لضمان أفضل تجربة طبية
            </p>
          </div>

          <AnimatedFeatureCards />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              نظام موثوق ومجرب
            </h2>
            <p className="text-blue-100 text-lg">
              أرقام تعكس جودة وفعالية النظام
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              كيف يعمل النظام؟
            </h2>
            <p className="text-lg text-gray-600">
              خطوات بسيطة للحصول على مراقبة صحية متكاملة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "التسجيل والإعداد",
                description: "إنشاء حساب واختيار نوع المستخدم وربط الجهاز",
                icon: Users
              },
              {
                step: "2", 
                title: "المراقبة المستمرة",
                description: "قراءات تلقائية لمعدل ضربات القلب مع تحليل فوري",
                icon: Activity
              },
              {
                step: "3",
                title: "التنبيهات والتقارير", 
                description: "إشعارات ذكية وتقارير مفصلة للمتابعة الطبية",
                icon: Heart
              }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={index} className="relative group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <Badge variant="outline" className="mx-auto mb-2">
                      الخطوة {step.step}
                    </Badge>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            ابدأ رحلتك نحو صحة أفضل اليوم
          </h2>
          <p className="text-xl text-red-100 mb-8">
            انضم إلى آلاف المستخدمين الذين يثقون في نظامنا لمراقبة صحتهم
          </p>
          <Button size="lg" variant="secondary" onClick={handleGetStarted} className="group">
            ابدأ التجربة المجانية
            <Star className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Project Info */}
      <ProjectInfo />
    </div>
  );
};

export default Landing;
