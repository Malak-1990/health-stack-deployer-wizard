
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, Users, FileText, Shield, Activity, Heart, Phone, Database } from 'lucide-react';

const AnimatedFeatureCards = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      id: 1,
      title: "مراقبة مباشرة",
      description: "مراقبة مستمرة لمعدل ضربات القلب في الوقت الفعلي مع تنبيهات فورية",
      icon: Monitor,
      color: "from-blue-500 to-blue-600",
      animation: "animate-pulse",
      details: ["قراءات كل ثانية", "تنبيهات فورية", "مراقبة 24/7", "دقة عالية"]
    },
    {
      id: 2,
      title: "تواصل العائلة",
      description: "ربط أفراد العائلة للاطمئنان على الحالة الصحية ومتابعة التطورات",
      icon: Users,
      color: "from-green-500 to-green-600",
      animation: "animate-bounce",
      details: ["إشعارات العائلة", "تقارير دورية", "حالة الطوارئ", "راحة البال"]
    },
    {
      id: 3,
      title: "تقارير طبية",
      description: "تقارير مفصلة وتحليلات ذكية لمساعدة الأطباء في اتخاذ القرارات",
      icon: FileText,
      color: "from-purple-500 to-purple-600",
      animation: "animate-spin",
      details: ["تحليل البيانات", "رسوم بيانية", "تقارير شاملة", "توصيات طبية"]
    },
    {
      id: 4,
      title: "أمان البيانات",
      description: "حماية متقدمة لجميع البيانات الصحية بتشفير عالي المستوى",
      icon: Shield,
      color: "from-red-500 to-red-600",
      animation: "animate-ping",
      details: ["تشفير متقدم", "خصوصية تامة", "حماية GDPR", "أمان مضمون"]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {features.map((feature) => {
        const IconComponent = feature.icon;
        const isHovered = hoveredCard === feature.id;
        
        return (
          <Card 
            key={feature.id}
            className={`
              relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-xl
              ${isHovered ? 'ring-2 ring-blue-400' : ''}
            `}
            onMouseEnter={() => setHoveredCard(feature.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 transition-opacity duration-300 ${isHovered ? 'opacity-20' : ''}`} />
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${feature.color} rounded-full opacity-20 transition-transform duration-700 ${isHovered ? 'scale-150 rotate-45' : 'scale-100'}`} />
              <div className={`absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full opacity-15 transition-transform duration-500 ${isHovered ? 'scale-125 -rotate-45' : 'scale-100'}`} />
            </div>

            <CardContent className="relative p-6 h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className={`
                  p-3 rounded-lg bg-gradient-to-br ${feature.color} shadow-lg
                  ${isHovered ? feature.animation : ''}
                  transition-all duration-300
                `}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>

              {/* Feature Details - Animated on Hover */}
              <div className={`
                transition-all duration-500 transform
                ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {feature.details.map((detail, index) => (
                    <div 
                      key={index}
                      className={`
                        flex items-center gap-2 text-xs text-gray-600 p-2 rounded-md bg-white/70
                        transition-all duration-300 delay-${index * 100}
                        ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
                      `}
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`} />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Elements */}
              {isHovered && (
                <div className="absolute top-4 left-4">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i}
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} animate-pulse`}
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Health Icons Animation */}
              {feature.id === 1 && isHovered && (
                <div className="absolute bottom-4 right-4">
                  <Heart className="h-4 w-4 text-red-500 animate-ping" />
                </div>
              )}

              {feature.id === 2 && isHovered && (
                <div className="absolute bottom-4 right-4">
                  <Phone className="h-4 w-4 text-green-500 animate-bounce" />
                </div>
              )}

              {feature.id === 3 && isHovered && (
                <div className="absolute bottom-4 right-4">
                  <Activity className="h-4 w-4 text-purple-500 animate-pulse" />
                </div>
              )}

              {feature.id === 4 && isHovered && (
                <div className="absolute bottom-4 right-4">
                  <Database className="h-4 w-4 text-red-500 animate-ping" />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AnimatedFeatureCards;
