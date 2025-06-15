
import React from 'react';
import { FileText, Users } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0077B6] mb-3">حول النظام</h2>
        <p className="text-base md:text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
          نظام مراقبة مرضى القلب هو منصة طبية متقدمة تهدف إلى توفير حلول شاملة لمراقبة صحة القلب والأوعية الدموية. يستخدم النظام أحدث التقنيات لضمان المراقبة المستمرة والدقيقة لحالة المرضى.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-md border-b-4 border-[#00B4D8] flex flex-col items-center text-center">
            <FileText className="text-[#00B4D8] w-10 h-10 mb-2" />
            <h3 className="text-xl font-bold text-[#03045E] mb-2">سجلات طبية شاملة</h3>
            <p className="text-gray-700 text-sm">احتفظ بسجل مفصل لجميع قراءاتك الطبية مع إمكانية المشاركة مع الأطباء.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-md border-b-4 border-[#00B4D8] flex flex-col items-center text-center">
            <Users className="text-[#00B4D8] w-10 h-10 mb-2" />
            <h3 className="text-xl font-bold text-[#03045E] mb-2">دعم متعدد الأدوار</h3>
            <p className="text-gray-700 text-sm">يدعم النظام أدوار مختلفة: المرضى، الأطباء، وأفراد العائلة.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
