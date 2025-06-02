
import { useState, useEffect } from 'react';
import { Heart, UserCheck, Users } from 'lucide-react';

interface RoleAnimationProps {
  role: 'patient' | 'doctor' | 'family';
  isActive: boolean;
}

const RoleAnimations = ({ role, isActive }: RoleAnimationProps) => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 3);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const getAnimationContent = () => {
    switch (role) {
      case 'patient':
        return (
          <div className="relative">
            <div className={`transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
              <Heart 
                className={`h-12 w-12 mx-auto ${
                  isActive 
                    ? animationStep === 0 
                      ? 'text-red-500' 
                      : animationStep === 1 
                        ? 'text-red-600' 
                        : 'text-red-400'
                    : 'text-gray-400'
                }`}
              />
            </div>
            <div className="mt-2 text-center">
              <h3 className="font-semibold text-gray-800">مريض</h3>
              <p className="text-xs text-gray-600">مراقبة معدل ضربات القلب</p>
            </div>
            {isActive && (
              <div className="absolute -top-2 -right-2">
                <div className={`w-4 h-4 rounded-full ${
                  animationStep === 0 ? 'bg-green-400' : 
                  animationStep === 1 ? 'bg-yellow-400' : 'bg-red-400'
                } animate-pulse`}></div>
              </div>
            )}
          </div>
        );

      case 'doctor':
        return (
          <div className="relative">
            <div className={`transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
              <UserCheck 
                className={`h-12 w-12 mx-auto ${
                  isActive ? 'text-blue-500' : 'text-gray-400'
                }`}
              />
            </div>
            <div className="mt-2 text-center">
              <h3 className="font-semibold text-gray-800">طبيب</h3>
              <p className="text-xs text-gray-600">متابعة جميع المرضى</p>
            </div>
            {isActive && (
              <div className="absolute -top-1 -left-1 w-full h-full">
                <div className={`absolute rounded-full border-2 border-blue-400 ${
                  animationStep === 0 ? 'w-8 h-8 top-2 left-2' :
                  animationStep === 1 ? 'w-12 h-12 top-0 left-0' :
                  'w-16 h-16 top-(-2) left-(-2)'
                } transition-all duration-300 opacity-60`}></div>
              </div>
            )}
          </div>
        );

      case 'family':
        return (
          <div className="relative">
            <div className={`transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
              <Users 
                className={`h-12 w-12 mx-auto ${
                  isActive ? 'text-green-500' : 'text-gray-400'
                }`}
              />
            </div>
            <div className="mt-2 text-center">
              <h3 className="font-semibold text-gray-800">عائلة</h3>
              <p className="text-xs text-gray-600">متابعة أفراد العائلة</p>
            </div>
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <div className={`flex space-x-1 ${
                  animationStep === 0 ? 'animate-bounce' : ''
                }`}>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className={`w-2 h-2 bg-green-400 rounded-full ${
                    animationStep === 1 ? 'animate-bounce' : ''
                  }`}></div>
                  <div className={`w-2 h-2 bg-green-400 rounded-full ${
                    animationStep === 2 ? 'animate-bounce' : ''
                  }`}></div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
      isActive 
        ? 'border-blue-500 bg-blue-50 shadow-lg' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      {getAnimationContent()}
    </div>
  );
};

export default RoleAnimations;
