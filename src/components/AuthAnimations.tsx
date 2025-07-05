
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Stethoscope, Activity } from 'lucide-react';

const AuthAnimations = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'patient',
      title: 'دور المريض',
      description: 'مراقبة مستمرة لصحتك مع تنبيهات ذكية',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      features: ['مراقبة معدل ضربات القلب', 'تنبيهات فورية', 'تقارير يومية']
    },
    {
      id: 'doctor',
      title: 'دور الطبيب',
      description: 'متابعة المرضى وإدارة الحالات الطبية',
      icon: Stethoscope,
      color: 'from-blue-500 to-cyan-500',
      features: ['لوحة تحكم شاملة', 'متابعة المرضى', 'تحليل البيانات']
    },
    {
      id: 'family',
      title: 'دور العائلة',
      description: 'متابعة الأحباء والحصول على التحديثات',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      features: ['تنبيهات الطوارئ', 'متابعة الحالة', 'التواصل السهل']
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg">
      {slides.map((slide, index) => {
        const IconComponent = slide.icon;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <Card className={`h-full bg-gradient-to-br ${slide.color} text-white border-0`}>
              <CardContent className="p-8 h-full flex flex-col justify-center">
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  
                  <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                    {slide.title}
                  </Badge>
                  
                  <h3 className="text-2xl font-bold mb-4">
                    {slide.description}
                  </h3>
                  
                  <div className="space-y-2">
                    {slide.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center space-x-2">
                        <Activity className="h-4 w-4" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthAnimations;
