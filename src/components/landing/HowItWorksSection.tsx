
import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Activity, Bell, ArrowLeft } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-12 px-4 bg-[#CAF0F8]">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0077B6] mb-3">كيف يعمل النظام؟</h2>
        <p className="text-base md:text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
          خطوات بسيطة للحصول على مراقبة صحية متكاملة.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Step 1 */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 text-center relative z-10 md:flex-1">
            <UserPlus className="w-10 h-10 mx-auto mb-2 text-[#03045E]" />
            <h3 className="text-lg font-bold text-[#03045E] mb-2">التسجيل والإعداد</h3>
            <p className="text-gray-700 text-sm">إنشاء حساب واختيار نوع المستخدم وربط الجهاز.</p>
          </div>

          <div className="text-3xl text-[#00B4D8] rotate-90 md:rotate-0">
            <ArrowLeft className="w-6 h-6" />
          </div>
          
          {/* Step 2 */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 text-center relative z-10 md:flex-1">
            <Activity className="w-10 h-10 mx-auto mb-2 text-[#03045E]" />
            <h3 className="text-lg font-bold text-[#03045E] mb-2">المراقبة المستمرة</h3>
            <p className="text-gray-700 text-sm">قراءات تلقائية لمعدل ضربات القلب مع تحليل فوري.</p>
          </div>

          <div className="text-3xl text-[#00B4D8] rotate-90 md:rotate-0">
            <ArrowLeft className="w-6 h-6" />
          </div>

          {/* Step 3 */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 text-center relative z-10 md:flex-1">
            <Bell className="w-10 h-10 mx-auto mb-2 text-[#03045E]" />
            <h3 className="text-lg font-bold text-[#03045E] mb-2">التنبيهات والتقارير</h3>
            <p className="text-gray-700 text-sm">إشعارات ذكية وتقارير مفصلة للمتابعة الطبية.</p>
          </div>
        </div>
        <Link to="/auth" className="inline-block bg-[#00B4D8] text-[#03045E] font-bold text-lg md:text-xl px-8 py-3 rounded-full mt-8 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
          ابدأ الآن
        </Link>
      </div>
    </section>
  );
};

export default HowItWorksSection;
