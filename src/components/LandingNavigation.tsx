
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

const LandingNavigation = () => {
  const navigate = useNavigate();
  const { direction } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    // إرسال حدث مخصص للكاروسيل ليتعامل معه
    window.dispatchEvent(new CustomEvent('scrollToSection', { detail: sectionId }));
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'الرئيسية', action: () => scrollToSection('hero') },
    { label: 'المميزات', action: () => scrollToSection('features') },
    { label: 'كيف يعمل', action: () => scrollToSection('how-it-works') },
    { label: 'الإحصائيات', action: () => scrollToSection('statistics') },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                نظام مراقبة القلب
              </h1>
              <Badge variant="outline" className="text-xs">
                نسخة تجريبية
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 rounded-md"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <Button variant="outline" onClick={() => navigate('/auth')}>
              تسجيل دخول
            </Button>
            <Button onClick={() => navigate('/auth')}>
              ابدأ الآن
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg mt-2">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="block w-full text-right px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                >
                  تسجيل دخول
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                >
                  ابدأ الآن
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNavigation;
