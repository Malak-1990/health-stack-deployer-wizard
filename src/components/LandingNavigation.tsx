
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const LandingNavigation = () => {
  const { language, setLanguage, t, direction } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const navigationItems = [
    { id: 'hero', label: 'الرئيسية', href: '#hero' },
    { id: 'features', label: 'الميزات', href: '#features' },
    { id: 'statistics', label: 'الإحصائيات', href: '#statistics' },
    { id: 'how-it-works', label: 'كيف يعمل', href: '#how-it-works' },
    { id: 'cta', label: 'ابدأ الآن', href: '#cta' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div className={direction === 'rtl' ? 'mr-3' : 'ml-3'}>
              <h1 className="text-xl font-semibold text-gray-900">
                نظام مراقبة مرضى القلب
              </h1>
              <p className="text-sm text-gray-600">جامعة الزاوية</p>
            </div>
          </div>

          {/* Navigation Menu - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={toggleLanguage}>
              <Globe className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>
            <Link to="/auth">
              <Button size="sm">
                {t('signin')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingNavigation;
