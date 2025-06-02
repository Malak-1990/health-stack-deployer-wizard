
import { useState, useEffect } from 'react';

const AuthAnimations = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      title: "مراقبة مستمرة",
      description: "تتبع معدل ضربات القلب في الوقت الفعلي",
      icon: "💓"
    },
    {
      title: "تنبيهات ذكية",
      description: "إشعارات فورية عند اكتشاف أي خطر",
      icon: "🚨"
    },
    {
      title: "متابعة طبية",
      description: "تواصل مباشر مع الطبيب المختص",
      icon: "👨‍⚕️"
    },
    {
      title: "راحة البال",
      description: "اطمئنان العائلة على صحة المريض",
      icon: "🏠"
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute w-32 h-32 bg-blue-300 rounded-full transition-all duration-2000 ${
            currentStep === 0 ? 'top-4 left-4' :
            currentStep === 1 ? 'top-4 right-4' :
            currentStep === 2 ? 'bottom-4 right-4' :
            'bottom-4 left-4'
          }`}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
          <div className={`text-4xl mb-4 transition-all duration-500 ${
            currentStep === 0 ? 'animate-pulse scale-110' : 'scale-100'
          }`}>
            {steps[currentStep].icon}
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {steps[currentStep].title}
          </h3>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            {steps[currentStep].description}
          </p>

          {/* Progress Dots */}
          <div className="flex space-x-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Heart Beat Animation */}
        <div className="absolute top-2 right-2">
          <div className={`w-3 h-3 bg-red-500 rounded-full ${
            currentStep === 0 ? 'animate-ping' : ''
          }`}></div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl mb-1">📱</div>
          <p className="text-xs text-gray-600">تطبيق سهل الاستخدام</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl mb-1">🔒</div>
          <p className="text-xs text-gray-600">بيانات آمنة ومشفرة</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl mb-1">⚡</div>
          <p className="text-xs text-gray-600">استجابة فورية</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl mb-1">🌐</div>
          <p className="text-xs text-gray-600">متاح في أي وقت</p>
        </div>
      </div>
    </div>
  );
};

export default AuthAnimations;
