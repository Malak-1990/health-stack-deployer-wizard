
import React from 'react';
import { Link } from 'react-router-dom';

interface LandingNavProps {
  logoUrl: string;
}

const LandingNav: React.FC<LandingNavProps> = ({ logoUrl }) => {
  return (
    <nav className="bg-[#03045E] p-3 shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo/Site Title */}
        <div className="flex items-center gap-3 mb-3 md:mb-0">
          <img 
            src={logoUrl} 
            onError={(e) => { 
              e.currentTarget.onerror = null; 
              e.currentTarget.src='https://placehold.co/50x50/CCCCCC/888888?text=شعار'; 
            }}
            alt="شعار جامعة الزاوية وكلية العلوم العجيلات" 
            className="h-10 w-auto rounded-full"
          />
          <span className="text-[#CAF0F8] text-xl font-bold">
            نظام مراقبة القلب الذكي
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-3 md:space-x-reverse">
          <a href="#project-overview" className="text-[#CAF0F8] text-sm font-semibold px-3 py-2 rounded-lg hover:bg-[#0077B6] transition-colors duration-300">
            الرئيسية
          </a>
          <a href="#features" className="text-[#CAF0F8] text-sm font-semibold px-3 py-2 rounded-lg hover:bg-[#0077B6] transition-colors duration-300">
            المميزات
          </a>
          <a href="#how-it-works" className="text-[#CAF0F8] text-sm font-semibold px-3 py-2 rounded-lg hover:bg-[#0077B6] transition-colors duration-300">
            كيف يعمل
          </a>
          <a href="#about" className="text-[#CAF0F8] text-sm font-semibold px-3 py-2 rounded-lg hover:bg-[#0077B6] transition-colors duration-300">
            حول النظام
          </a>
          <Link to="/contact" className="text-[#CAF0F8] text-sm font-semibold px-3 py-2 rounded-lg hover:bg-[#90e0ef] border border-[#00B4D8] transition-colors duration-300">
            الدعم الفني
          </Link>
          <Link to="/auth" className="bg-[#00B4D8] text-[#03045E] text-sm font-semibold px-3 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-300">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
