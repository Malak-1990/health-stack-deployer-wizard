
import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] px-4" dir="rtl">
      <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold text-[#03045E] mb-4">الدعم الفني والتواصل</h1>
        <p className="mb-5 text-[#03045E] font-semibold">ملاكـ سنتر للخدمات الأكاديمية و التقنية</p>
        <p className="mb-3 text-gray-600">لأي استفسار أو دعم تقني يرجى التواصل عبر البريد:</p>
        <a
          href="mailto:teachingandtraining.mlc@gmail.com"
          className="block bg-[#00B4D8] text-[#03045E] font-bold rounded-lg px-4 py-3 mx-auto w-fit mb-4 hover:bg-[#009fcf] transition-colors"
        >
          teachingandtraining.mlc@gmail.com
        </a>
        <div className="mt-6">
          <span className="text-xs text-gray-400">سعيًا لتقديم أفضل خدمة لكم، سيتم الرد في أسرع وقت ممكن.</span>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
