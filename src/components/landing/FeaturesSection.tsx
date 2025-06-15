
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, BarChart2, ShieldCheck } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0077B6] mb-3">ميزات متقدمة لرعاية صحية شاملة</h2>
        <p className="text-base md:text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
          تقنيات حديثة وواجهة سهلة الاستخدام لضمان أفضل تجربة طبية.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature Card 1: Real-time Monitoring */}
          <div className="bg-white p-5 rounded-2xl shadow-md border-b-4 border-[#00B4D8] flex flex-col items-center text-center">
            <Heart className="text-[#00B4D8] w-12 h-12 mb-3" />
            <h3 className="text-xl font-bold text-[#03045E] mb-2">مراقبة مباشرة (Real-time)</h3>
            <p className="text-gray-700 mb-3 leading-relaxed text-sm">
              مراقبة مستمرة لمعدل ضربات القلب وضغط الدم في الوقت الفعلي مع تنبيهات فورية.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 w-full">
              <span className="p-2 bg-[#CAF0F8] rounded-md">قراءات كل ثانية</span>
              <span className="p-2 bg-[#CAF0F8] rounded-md">تنبيهات فورية</span>
              <span className="p-2 bg-[#CAF0F8] rounded-md">مراقبة 24/7</span>
              <span className="p-2 bg-[#CAF0F8] rounded-md">دقة عالية</span>
            </div>
          </div>

          {/* Feature Card 2: Family Communication */}
          <div className="bg-white p-5 rounded-2xl shadow-md border-b-4 border-[#00B4D8] flex flex-col items-center text-center">
            <Users className="text-[#00B4D8] w-12 h-12 mb-3" />
            <h3 className="text-xl font-bold text-[#03045E] mb-2">تواصل العائلة</h3>
            <p className="text-gray-700 mb-3 leading-relaxed text-sm">
              ربط أفراد العائلة للاطمئنان على الحالة الصحية ومتابعة التطورات، مع إشعارات حالة الطوارئ.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 w-full">
              <span className="p-2 bg-[#CAF0F8] rounded-md">إشعارات العائلة</span>
              <span className="p-2 bg-[#CAF0F8] rounded-md">تقارير دورية</span>
              <span className="p-2 bg-[#CAF0F8] rounded-md">حالة الطوارئ</span>
              <span className="p-2 bg-[#CAF0F8] rounded-md">راحة البال</span>
            </div>
          </div>

          {/* Feature Card 3: Medical Reports */}
          <div className="bg-white p-5 rounded-2xl shadow-md border-b-4 border-[#00B4D8] flex flex-col items-center text-center">
            <BarChart2 className="text-[#00B4D8] w-12 h-12 mb-3" />
            <h3 className="text-xl font-bold text-[#03045E] mb-2">تقارير طبية</h3>
            <p className="text-gray-700 mb-3 leading-relaxed text-sm">
              تقارير مفصلة وتحليلات ذكية لمساعدة الأطباء في اتخاذ القرارات العلاجية الصحيحة.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 w-full">
              <span className="p-2 bg-[#CAF0F8] rounded-md">تحليل البيانات</span>
              <span className="p-2 bg-[#CAF0F8] rounded-md">رسوم بيانية</span>
              <span className="p-2 bg-[#CAF0F8] rounded-md">تقارير شاملة</span>
              <span className="p-2 bg-[#CAF0F8] rounded-md">توصيات طبية</span>
            </div>
          </div>

          {/* Feature Card 4: Data Security */}
          <div className="bg-white p-5 rounded-2xl shadow-md border-b-4 border-[#00B4D8] flex flex-col items-center text-center">
            <ShieldCheck className="text-[#00B4D8] w-12 h-12 mb-3" />
            <h3 className="text-xl font-bold text-[#03045E] mb-2">أمان البيانات</h3>
            <p className="text-gray-700 mb-3 leading-relaxed text-sm">
              حماية متقدمة لجميع البيانات الصحية بتشفير عالي المستوى، مع ضمان الخصوصية التامة.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 w-full">
              <span className="p-2 bg-[#CAF0F8] rounded-md">تشفير متقدم</span>
              <span className="p-2 bg-[#CAF0F8] rounded-md">خصوصية تامة</span>
              <span className="p-2 bg-[#CAF0F8] rounded-md">حماية GDPR</span>
              <span className="p-2 bg-[#CAF0F8] rounded-md">أمان مضمون</span>
            </div>
          </div>
        </div>
        <Link to="/auth" className="inline-block bg-[#0077B6] text-white font-bold text-lg md:text-xl px-8 py-3 rounded-full mt-8 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
          ابدأ الاستخدام الآن
        </Link>
      </div>
    </section>
  );
};

export default FeaturesSection;
