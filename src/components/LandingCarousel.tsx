
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';
import { Heart, Users, Shield, Activity, ArrowRight, Star, CheckCircle, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedFeatureCards from '@/components/AnimatedFeatureCards';

const LandingCarousel = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const slides = [
    {
      id: 'hero',
      title: 'البطاقة الرئيسية',
      content: (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full animate-ping"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-red-500 rounded-full animate-bounce"></div>
          </div>

          <div className="relative text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
            {/* Main Badge */}
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              مشروع تخرج - جامعة الزاوية
            </Badge>

            {/* Main Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              نظام مراقبة مرضى القلب
              <span className="text-red-600 block">الذكي والمتطور</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
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
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
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
      )
    },
    {
      id: 'features',
      title: 'الميزات',
      content: (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ميزات متقدمة لرعاية صحية شاملة
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                تقنيات حديثة وواجهة سهلة الاستخدام لضمان أفضل تجربة طبية
              </p>
            </div>
            <AnimatedFeatureCards />
          </div>
        </div>
      )
    },
    {
      id: 'statistics',
      title: 'الإحصائيات',
      content: (
        <div className="min-h-screen bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                نظام موثوق ومجرب
              </h2>
              <p className="text-blue-100 text-lg">
                أرقام تعكس جودة وفعالية النظام
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '1000+', label: 'مستخدمين' },
                { value: '500+', label: 'المرضى المراقبين' },
                { value: '200+', label: 'العمليات المتابعة' },
                { value: '100+', label: 'الإشعارات المفيدة' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'how-it-works',
      title: 'كيف يعمل',
      content: (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
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
        </div>
      )
    },
    {
      id: 'cta',
      title: 'ابدأ الآن',
      content: (
        <div className="min-h-screen bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ابدأ رحلتك نحو صحة أفضل اليوم
            </h2>
            <p className="text-lg md:text-xl text-red-100 mb-8">
              انضم إلى آلاف المستخدمين الذين يثقون في نظامنا لمراقبة صحتهم
            </p>
            <Button size="lg" variant="secondary" onClick={handleGetStarted} className="group">
              ابدأ التجربة المجانية
              <Star className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="relative">
      <Carousel 
        className="w-full" 
        orientation="horizontal"
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-1">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-1">
              <div className="p-1">
                {slide.content}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
          <CarouselPrevious className="bg-white/90 hover:bg-white shadow-lg border-0 h-12 w-12" />
          <CarouselNext className="bg-white/90 hover:bg-white shadow-lg border-0 h-12 w-12" />
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === index + 1 ? 'bg-white' : 'bg-white/50'
              }`} 
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default LandingCarousel;
