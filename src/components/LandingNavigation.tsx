
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Heart, Shield, BarChart3, Users, Smartphone, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const features = [
    {
      id: 'monitoring',
      title: 'مراقبة مستمرة',
      description: 'مراقبة معدل ضربات القلب وضغط الدم على مدار الساعة',
      icon: Heart,
      color: 'text-red-600',
    },
    {
      id: 'alerts',
      title: 'تنبيهات ذكية',
      description: 'إشعارات فورية عند اكتشاف أي مشاكل صحية',
      icon: Shield,
      color: 'text-blue-600',
    },
    {
      id: 'analytics',
      title: 'تحليلات متقدمة',
      description: 'رسوم بيانية وإحصائيات مفصلة لحالتك الصحية',
      icon: BarChart3,
      color: 'text-green-600',
    },
    {
      id: 'family',
      title: 'مشاركة العائلة',
      description: 'إشراك أفراد العائلة في متابعة حالتك الصحية',
      icon: Users,
      color: 'text-purple-600',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'مستخدم نشط' },
    { number: '99.9%', label: 'موثوقية النظام' },
    { number: '24/7', label: 'مراقبة مستمرة' },
    { number: '5★', label: 'تقييم المستخدمين' },
  ];

  return (
    <div className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="p-2 bg-red-100 rounded-full">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">نظام مراقبة القلب</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              المميزات
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              كيف يعمل
            </button>
            <button
              onClick={() => scrollToSection('statistics')}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              الإحصائيات
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              حول النظام
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <Link to="/auth">
              <Button variant="outline">تسجيل الدخول</Button>
            </Link>
            <Link to="/auth?tab=signup">
              <Button>ابدأ الآن</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('features')}
                className="text-left text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                المميزات
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                كيف يعمل
              </button>
              <button
                onClick={() => scrollToSection('statistics')}
                className="text-left text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                الإحصائيات
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-left text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                حول النظام
              </button>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link to="/auth">
                  <Button variant="outline" className="w-full">تسجيل الدخول</Button>
                </Link>
                <Link to="/auth?tab=signup">
                  <Button className="w-full">ابدأ الآن</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">مميزات النظام</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نقدم لك أفضل التقنيات لمراقبة صحة القلب وضمان سلامتك على مدار الساعة
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex p-3 rounded-full bg-gray-100 mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">كيف يعمل النظام</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              خطوات بسيطة للبدء في مراقبة صحة قلبك بكفاءة عالية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. اربط جهازك</h3>
              <p className="text-gray-600">قم بربط جهاز مراقبة القلب عبر البلوتوث أو أدخل القراءات يدوياً</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. راقب البيانات</h3>
              <p className="text-gray-600">تابع قراءات القلب والضغط مع تحليلات ذكية ورسوم بيانية مفصلة</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. احصل على التنبيهات</h3>
              <p className="text-gray-600">تلقى إشعارات فورية عند اكتشاف أي مشاكل مع توصيات طبية</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">الإحصائيات</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              أرقام تُظهر جودة وموثوقية نظامنا في مراقبة صحة القلب
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">حول النظام</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-600 text-lg mb-6">
                نظام مراقبة مرضى القلب هو منصة طبية متقدمة تهدف إلى توفير حلول شاملة لمراقبة صحة القلب والأوعية الدموية. 
                يستخدم النظام أحدث التقنيات لضمان المراقبة المستمرة والدقيقة لحالة المرضى.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">سجلات طبية شاملة</h3>
                  <p className="text-gray-600">احتفظ بسجل مفصل لجميع قراءاتك الطبية مع إمكانية المشاركة مع الأطباء</p>
                </div>
                <div className="text-center">
                  <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">دعم متعدد الأدوار</h3>
                  <p className="text-gray-600">يدعم النظام أدوار مختلفة: المرضى، الأطباء، وأفراد العائلة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingNavigation;
