
import React from 'react';
import { Activity, Users, Heart, Bell, ShieldCheck } from 'lucide-react';

const ProjectOverview: React.FC = () => {
  return (
    <section id="project-overview" className="py-12 px-4 bg-white">
      <div className="container mx-auto text-center">
        {/* Project Title & Slogan */}
        <p className="text-lg md:text-xl font-bold text-[#03045E] mb-3">
          مشروع تخرج - كلية العلوم العجيلات، جامعة الزاوية
        </p>
        <p className="text-base md:text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
          نظام متكامل لمراقبة الحالة الصحية عن بُعد، يتيح متابعة مؤشرات القلب للمرضى بشكل مباشر.
        </p>

        {/* Students & Supervisor */}
        <div className="mb-6">
          <h3 className="font-bold text-xl text-[#0077B6] mb-3">فريق المشروع:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-3 max-w-xl mx-auto">
            <p className="bg-[#CAF0F8] p-2 rounded-lg font-semibold text-[#03045E] text-sm">هديل عبد الحكيم الفرجي</p>
            <p className="bg-[#CAF0F8] p-2 rounded-lg font-semibold text-[#03045E] text-sm">مغفرة محمد الافيرك</p>
            <p className="bg-[#CAF0F8] p-2 rounded-lg font-semibold text-[#03045E] text-sm">دعاء مختار سالم</p>
          </div>
          <p className="text-lg font-bold text-[#0077B6] mt-3">تحت إشراف: د. سناء أبولجام</p>
        </div>

        {/* Key Features List */}
        <div className="mb-6">
          <h3 className="font-bold text-xl text-[#0077B6] mb-3">مميزات رئيسية:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 max-w-2xl mx-auto text-right">
            <li className="flex items-center gap-2 bg-[#CAF0F8] p-2 rounded-lg">
              <Activity className="text-[#00B4D8] w-5 h-5" />
              واجهة مستخدم سهلة وبسيطة
            </li>
            <li className="flex items-center gap-2 bg-[#CAF0F8] p-2 rounded-lg">
              <Users className="text-[#00B4D8] w-5 h-5" />
              دعم كامل للغة العربية
            </li>
            <li className="flex items-center gap-2 bg-[#CAF0F8] p-2 rounded-lg">
              <Activity className="text-[#00B4D8] w-5 h-5" />
              تصميم متجاوب يعمل على جميع الأجهزة
            </li>
            <li className="flex items-center gap-2 bg-[#CAF0F8] p-2 rounded-lg">
              <Heart className="text-[#00B4D8] w-5 h-5" />
              مراقبة مباشرة لمؤشرات القلب
            </li>
            <li className="flex items-center gap-2 bg-[#CAF0F8] p-2 rounded-lg">
              <Bell className="text-[#00B4D8] w-5 h-5" />
              تنبيهات فورية للحالات الحرجة
            </li>
            <li className="flex items-center gap-2 bg-[#CAF0F8] p-2 rounded-lg">
              <ShieldCheck className="text-[#00B4D8] w-5 h-5" />
              نظام آمن ومحمي للبيانات الطبية
            </li>
          </ul>
        </div>

        {/* Technologies Used List */}
        <div>
          <h3 className="font-bold text-xl text-[#0077B6] mb-3">التقنيات المستخدمة:</h3>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-[#03045E] max-w-xl mx-auto">
            <span className="bg-[#CAF0F8] py-2 px-4 rounded-full shadow-md">React & TypeScript</span>
            <span className="bg-[#CAF0F8] py-2 px-4 rounded-full shadow-md">Supabase</span>
            <span className="bg-[#CAF0F8] py-2 px-4 rounded-full shadow-md">Tailwind CSS</span>
            <span className="bg-[#CAF0F8] py-2 px-4 rounded-full shadow-md">WebSocket للاتصال المباشر</span>
            <span className="bg-[#CAF0F8] py-2 px-4 rounded-full shadow-md">PWA Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectOverview;
