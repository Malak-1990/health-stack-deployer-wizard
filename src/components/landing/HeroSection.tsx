
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Stethoscope, Clock } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="bg-gradient-to-br from-[#03045E] to-[#0077B6] text-white py-12 px-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('https://placehold.co/1200x800/FFFFFF/CCCCCC?text=Heart%20Monitor%20Pattern')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}></div>
      
      <div className="container mx-auto relative z-10">
        <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
          نظام مراقبة القلب الذكي والمتطور
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto opacity-90">
          نظام متكامل لمراقبة الحالة الصحية عن بُعد باستخدام تقنيات الذكاء الاصطناعي مع تنبيهات فورية وحماية متقدمة للبيانات.
        </p>
        <Link to="/auth" className="inline-block bg-[#00B4D8] text-[#03045E] font-bold text-lg md:text-xl px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
          ابدأ الآن
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm shadow-md">
            <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-white" />
            <h3 className="text-lg font-bold mb-2">آمن ومشفر</h3>
            <p className="text-sm opacity-90">حماية بياناتك الصحية بمعايير أمان عالية.</p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm shadow-md">
            <Stethoscope className="w-10 h-10 mx-auto mb-2 text-white" />
            <h3 className="text-lg font-bold mb-2">مطابق للمعايير الطبية</h3>
            <p className="text-sm opacity-90">مصمم وفقاً لأعلى المعايير الصحية العالمية.</p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm shadow-md">
            <Clock className="w-10 h-10 mx-auto mb-2 text-white" />
            <h3 className="text-lg font-bold mb-2">متاح 24/7</h3>
            <p className="text-sm opacity-90">مراقبة مستمرة لصحتك دون انقطاع.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
