
import React from 'react';
import { Link } from 'react-router-dom';

const CallToActionSection: React.FC = () => {
  return (
    <section id="get-started" className="bg-[#0077B6] text-white py-12 px-4 text-center">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">ابدأ رحلتك نحو صحة أفضل اليوم</h2>
        <p className="text-base md:text-lg mb-6 max-w-3xl mx-auto">
          انضم إلى آلاف المستخدمين الذين يثقون في نظامنا لمراقبة صحتهم.
        </p>
        <Link to="/auth" className="inline-block bg-[#00B4D8] text-[#03045E] font-bold text-lg md:text-xl px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
          ابدأ التجربة المجانية
        </Link>
      </div>
    </section>
  );
};

export default CallToActionSection;
