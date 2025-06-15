
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { direction } = useLanguage();
  
  // URL الشعار الذي تم رفعه على lovable.dev
  const logoUrl = '/lovable-uploads/لوقو كلية العلوم.jpeg-fb32727a-b137-4bbe-86ac-ccd525b9d814';

  useEffect(() => {
    // تسجيل Service Worker للـ PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // إذا كان المستخدم مسجل دخول، توجيهه للوحة التحكم
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className={`min-h-screen font-cairo bg-gray-50 text-right ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
      {/* Navigation Bar */}
      <nav className="bg-[#03045E] p-4 shadow-lg fixed w-full top-0 z-50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Logo/Site Title */}
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img 
              src={logoUrl} 
              onError={(e) => { 
                e.currentTarget.onerror = null; 
                e.currentTarget.src='https://placehold.co/50x50/CCCCCC/888888?text=شعار_خطأ'; 
              }}
              alt="شعار جامعة الزاوية وكلية العلوم العجيلات" 
              className="h-10 w-auto rounded-full"
            />
            <span className="text-[#CAF0F8] text-2xl font-bold">
              نظام مراقبة القلب الذكي
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 md:space-x-reverse">
            <a href="#project-overview" className="text-[#CAF0F8] text-lg font-semibold px-4 py-2 rounded-lg hover:bg-[#0077B6] transition-colors duration-300">
              الرئيسية
            </a>
            <a href="#features" className="text-[#CAF0F8] text-lg font-semibold px-4 py-2 rounded-lg hover:bg-[#0077B6] transition-colors duration-300">
              المميزات
            </a>
            <a href="#how-it-works" className="text-[#CAF0F8] text-lg font-semibold px-4 py-2 rounded-lg hover:bg-[#0077B6] transition-colors duration-300">
              كيف يعمل
            </a>
            <a href="#statistics" className="text-[#CAF0F8] text-lg font-semibold px-4 py-2 rounded-lg hover:bg-[#0077B6] transition-colors duration-300">
              الإحصائيات
            </a>
            <a href="#about" className="text-[#CAF0F8] text-lg font-semibold px-4 py-2 rounded-lg hover:bg-[#0077B6] transition-colors duration-300">
              حول النظام
            </a>
            {/* Login Button */}
            <Link to="/auth" className="bg-[#00B4D8] text-[#03045E] text-lg font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-300">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Section: Project Overview, Key Features, and Technologies Used */}
        <section id="project-overview" className="py-16 px-4 bg-white">
          <div className="container mx-auto text-center">
            {/* Project Title & Slogan */}
            <p className="text-xl md:text-2xl font-bold text-[#03045E] mb-4">
              مشروع تخرج - كلية العلوم العجيلات، جامعة الزاوية
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              نظام متكامل لمراقبة الحالة الصحية عن بُعد، يتيح متابعة مؤشرات القلب للمرضى بشكل مباشر.
            </p>

            {/* Students & Supervisor */}
            <div className="mb-8">
              <h3 className="font-bold text-2xl text-[#0077B6] mb-4">فريق المشروع:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 max-w-xl mx-auto">
                <p className="bg-[#CAF0F8] p-3 rounded-lg font-semibold text-[#03045E]">هديل عبد الحكيم الفرجي</p>
                <p className="bg-[#CAF0F8] p-3 rounded-lg font-semibold text-[#03045E]">مغفرة محمد الافيرك</p>
                <p className="bg-[#CAF0F8] p-3 rounded-lg font-semibold text-[#03045E]">دعاء مختار سالم</p>
              </div>
              <p className="text-xl font-bold text-[#0077B6] mt-4">تحت إشراف: د. سناء أبولجام</p>
            </div>

            {/* Key Features List */}
            <div className="mb-8">
              <h3 className="font-bold text-2xl text-[#0077B6] mb-4">مميزات رئيسية:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700 max-w-2xl mx-auto text-right">
                <li className="flex items-center gap-2 bg-[#CAF0F8] p-3 rounded-lg"><span className="text-[#00B4D8] text-2xl">✔️</span> واجهة مستخدم سهلة وبسيطة</li>
                <li className="flex items-center gap-2 bg-[#CAF0F8] p-3 rounded-lg"><span className="text-[#00B4D8] text-2xl">✔️</span> دعم كامل للغة العربية</li>
                <li className="flex items-center gap-2 bg-[#CAF0F8] p-3 rounded-lg"><span className="text-[#00B4D8] text-2xl">✔️</span> تصميم متجاوب يعمل على جميع الأجهزة</li>
                <li className="flex items-center gap-2 bg-[#CAF0F8] p-3 rounded-lg"><span className="text-[#00B4D8] text-2xl">✔️</span> مراقبة مباشرة لمؤشرات القلب</li>
                <li className="flex items-center gap-2 bg-[#CAF0F8] p-3 rounded-lg"><span className="text-[#00B4D8] text-2xl">✔️</span> تنبيهات فورية للحالات الحرجة</li>
                <li className="flex items-center gap-2 bg-[#CAF0F8] p-3 rounded-lg"><span className="text-[#00B4D8] text-2xl">✔️</span> نظام آمن ومحمي للبيانات الطبية</li>
              </ul>
            </div>

            {/* Technologies Used List */}
            <div>
              <h3 className="font-bold text-2xl text-[#0077B6] mb-4">التقنيات المستخدمة:</h3>
              <div className="flex flex-wrap justify-center gap-4 text-lg text-[#03045E] max-w-xl mx-auto">
                <span className="bg-[#CAF0F8] py-2 px-5 rounded-full shadow-md">React & TypeScript</span>
                <span className="bg-[#CAF0F8] py-2 px-5 rounded-full shadow-md">Supabase</span>
                <span className="bg-[#CAF0F8] py-2 px-5 rounded-full shadow-md">Tailwind CSS</span>
                <span className="bg-[#CAF0F8] py-2 px-5 rounded-full shadow-md">WebSocket للاتصال المباشر</span>
                <span className="bg-[#CAF0F8] py-2 px-5 rounded-full shadow-md">PWA Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section: Main Title, Slogan, CTA, and Core Values */}
        <section id="hero" className="bg-gradient-to-br from-[#03045E] to-[#0077B6] text-white py-16 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('https://placehold.co/1200x800/FFFFFF/CCCCCC?text=Heart%20Monitor%20Pattern')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}></div>
          
          <div className="container mx-auto relative z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              نظام مراقبة القلب الذكي والمتطور
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              نظام متكامل لمراقبة الحالة الصحية عن بُعد باستخدام تقنيات الذكاء الاصطناعي مع تنبيهات فورية وحماية متقدمة للبيانات.
            </p>
            <Link to="/auth" className="inline-block bg-[#00B4D8] text-[#03045E] font-bold text-xl md:text-2xl px-10 py-4 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
              ابدأ الآن
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-20 p-6 rounded-xl backdrop-blur-sm shadow-md">
                <div className="text-5xl mb-3">🔒</div>
                <h3 className="text-xl font-bold mb-2">آمن ومشفر</h3>
                <p className="text-sm opacity-90">حماية بياناتك الصحية بمعايير أمان عالية.</p>
              </div>
              <div className="bg-white bg-opacity-20 p-6 rounded-xl backdrop-blur-sm shadow-md">
                <div className="text-5xl mb-3">⚕️</div>
                <h3 className="text-xl font-bold mb-2">مطابق للمعايير الطبية</h3>
                <p className="text-sm opacity-90">مصمم وفقاً لأعلى المعايير الصحية العالمية.</p>
              </div>
              <div className="bg-white bg-opacity-20 p-6 rounded-xl backdrop-blur-sm shadow-md">
                <div className="text-5xl mb-3">⏰</div>
                <h3 className="text-xl font-bold mb-2">متاح 24/7</h3>
                <p className="text-sm opacity-90">مراقبة مستمرة لصحتك دون انقطاع.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0077B6] mb-4">ميزات متقدمة لرعاية صحية شاملة</h2>
            <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              تقنيات حديثة وواجهة سهلة الاستخدام لضمان أفضل تجربة طبية.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {/* Feature Card 1: Real-time Monitoring */}
              <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-[#00B4D8] flex flex-col items-center text-center">
                <div className="text-[#00B4D8] text-6xl mb-4">❤️‍🔥</div>
                <h3 className="text-2xl font-bold text-[#03045E] mb-3">مراقبة مباشرة (Real-time)</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  مراقبة مستمرة لمعدل ضربات القلب وضغط الدم في **الوقت الفعلي** مع تنبيهات فورية.
                  خاصية الـ **Realtime** من Supabase تضمن وصول القراءات والتنبيهات إليك في نفس اللحظة التي تحدث فيها.
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 w-full">
                  <span className="p-2 bg-[#CAF0F8] rounded-md">قراءات كل ثانية</span>
                  <span className="p-2 bg-[#CAF0F8] rounded-md">تنبيهات فورية</span>
                  <span className="p-2 bg-[#CAF0F8] rounded-md">مراقبة 24/7</span>
                  <span className="p-2 bg-[#CAF0F8] rounded-md">دقة عالية</span>
                </div>
              </div>

              {/* Feature Card 2: Family Communication */}
              <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-[#00B4D8] flex flex-col items-center text-center">
                <div className="text-[#00B4D8] text-6xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-bold text-[#03045E] mb-3">تواصل العائلة</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  ربط أفراد العائلة للاطمئنان على الحالة الصحية ومتابعة التطورات، مع إشعارات حالة الطوارئ.
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 w-full">
                  <span className="p-2 bg-[#CAF0F8] rounded-md">إشعارات العائلة</span>
                  <span className="p-2 bg-[#CAF0F8] rounded-md">تقارير دورية</span>
                  <span className="p-2 bg-[#CAF0F8] rounded-md">حالة الطوارئ</span>
                  <span className="p-2 bg-[#CAF0F8] rounded-md">راحة البال</span>
                </div>
              </div>

              {/* Feature Card 3: Medical Reports */}
              <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-[#00B4D8] flex flex-col items-center text-center">
                <div className="text-[#00B4D8] text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-[#03045E] mb-3">تقارير طبية</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  تقارير مفصلة وتحليلات ذكية لمساعدة الأطباء في اتخاذ القرارات العلاجية الصحيحة.
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 w-full">
                  <span className="p-2 bg-[#CAF0F8] rounded-md">تحليل البيانات</span>
                  <span className="p-2 bg-[#CAF0F8] rounded-md">رسوم بيانية</span>
                  <span className="p-2 bg-[#CAF0F8] rounded-md">تقارير شاملة</span>
                  <span className="p-2 bg-[#CAF0F8] rounded-md">توصيات طبية</span>
                </div>
              </div>

              {/* Feature Card 4: Data Security */}
              <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-[#00B4D8] flex flex-col items-center text-center">
                <div className="text-[#00B4D8] text-6xl mb-4">🛡️</div>
                <h3 className="text-2xl font-bold text-[#03045E] mb-3">أمان البيانات</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  حماية متقدمة لجميع البيانات الصحية بتشفير عالي المستوى، مع ضمان الخصوصية التامة.
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 w-full">
                  <span className="p-2 bg-[#CAF0F8] rounded-md">تشفير متقدم</span>
                  <span className="p-2 bg-[#CAF0F8] rounded-md">خصوصية تامة</span>
                  <span className="p-2 bg-[#CAF0F8] rounded-md">حماية GDPR</span>
                  <span className="p-2 bg-[#CAF0F8] rounded-md">أمان مضمون</span>
                </div>
              </div>
            </div>
            <Link to="/auth" className="inline-block bg-[#0077B6] text-white font-bold text-xl md:text-2xl px-10 py-4 rounded-full mt-12 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
              ابدأ الاستخدام الآن
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 px-4 bg-[#CAF0F8]">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0077B6] mb-4">كيف يعمل النظام؟</h2>
            <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              خطوات بسيطة للحصول على مراقبة صحية متكاملة.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Step 1 */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center relative z-10 md:flex-1">
                <div className="text-5xl mb-2 text-[#03045E]">📝</div>
                <h3 className="text-xl font-bold text-[#03045E] mb-2">التسجيل والإعداد</h3>
                <p className="text-gray-700">إنشاء حساب واختيار نوع المستخدم وربط الجهاز.</p>
              </div>

              <div className="text-4xl text-[#00B4D8] rotate-90 md:rotate-0">➡️</div>
              
              {/* Step 2 */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center relative z-10 md:flex-1">
                <div className="text-5xl mb-2 text-[#03045E]">📊</div>
                <h3 className="text-xl font-bold text-[#03045E] mb-2">المراقبة المستمرة</h3>
                <p className="text-gray-700">قراءات تلقائية لمعدل ضربات القلب مع تحليل فوري.</p>
              </div>

              <div className="text-4xl text-[#00B4D8] rotate-90 md:rotate-0">➡️</div>

              {/* Step 3 */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center relative z-10 md:flex-1">
                <div className="text-5xl mb-2 text-[#03045E]">🔔</div>
                <h3 className="text-xl font-bold text-[#03045E] mb-2">التنبيهات والتقارير</h3>
                <p className="text-gray-700">إشعارات ذكية وتقارير مفصلة للمتابعة الطبية.</p>
              </div>
            </div>
            <Link to="/auth" className="inline-block bg-[#00B4D8] text-[#03045E] font-bold text-xl md:text-2xl px-10 py-4 rounded-full mt-12 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
              ابدأ الآن
            </Link>
          </div>
        </section>

        {/* Statistics Section */}
        <section id="statistics" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0077B6] mb-4">نظام موثوق ومجرب</h2>
            <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              أرقام تعكس جودة وفعالية النظام.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-md border-r-4 border-[#00B4D8]">
                <h3 className="text-5xl font-black text-[#03045E] mb-2">10,000+</h3>
                <p className="text-lg text-gray-700">مستخدم نشط</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md border-r-4 border-[#00B4D8]">
                <h3 className="text-5xl font-black text-[#03045E] mb-2">99.9%</h3>
                <p className="text-lg text-gray-700">موثوقية النظام</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md border-r-4 border-[#00B4D8]">
                <h3 className="text-5xl font-black text-[#03045E] mb-2">24/7</h3>
                <p className="text-lg text-gray-700">مراقبة مستمرة</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md border-r-4 border-[#00B4D8]">
                <h3 className="text-5xl font-black text-[#03045E] mb-2">5★</h3>
                <p className="text-lg text-gray-700">تقييم المستخدمين</p>
              </div>
            </div>
            <Link to="/auth" className="inline-block bg-[#0077B6] text-white font-bold text-xl md:text-2xl px-10 py-4 rounded-full mt-12 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
              انضم إلينا الآن
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 px-4 bg-[#CAF0F8]">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0077B6] mb-4">حول النظام</h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              نظام مراقبة مرضى القلب هو منصة طبية متقدمة تهدف إلى توفير حلول شاملة لمراقبة صحة القلب والأوعية الدموية. يستخدم النظام أحدث التقنيات لضمان المراقبة المستمرة والدقيقة لحالة المرضى.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-[#00B4D8] flex flex-col items-center text-center">
                <div className="text-[#00B4D8] text-5xl mb-3">📋</div>
                <h3 className="text-2xl font-bold text-[#03045E] mb-2">سجلات طبية شاملة</h3>
                <p className="text-gray-700">احتفظ بسجل مفصل لجميع قراءاتك الطبية مع إمكانية المشاركة مع الأطباء.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-[#00B4D8] flex flex-col items-center text-center">
                <div className="text-[#00B4D8] text-5xl mb-3">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-bold text-[#03045E] mb-2">دعم متعدد الأدوار</h3>
                <p className="text-gray-700">يدعم النظام أدوار مختلفة: المرضى، الأطباء، وأفراد العائلة.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Call to Action */}
        <section id="get-started" className="bg-[#0077B6] text-white py-16 px-4 text-center">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ابدأ رحلتك نحو صحة أفضل اليوم</h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              انضم إلى آلاف المستخدمين الذين يثقون في نظامنا لمراقبة صحتهم.
            </p>
            <Link to="/auth" className="inline-block bg-[#00B4D8] text-[#03045E] font-bold text-xl md:text-2xl px-10 py-4 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
              ابدأ التجربة المجانية
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#03045E] text-[#CAF0F8] py-8 text-center">
        <div className="container mx-auto text-sm opacity-80">
          <p>&copy; 2025 - جميع الحقوق محفوظة لملاك سنتر للخدمات الأكاديمية</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
