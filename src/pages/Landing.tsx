
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Stethoscope, Clock, Users, BarChart2, UserPlus, Activity, Bell, FileText, Download, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const LandingPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { direction } = useLanguage();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    
    // URL الشعار الجديد المرفق
    const logoUrl = '/lovable-uploads/8e458822-aeb4-4983-89dc-16e2b6e10938.png';

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

        // إضافة مستمع لحدث beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // إذا كان المستخدم مسجل دخول، توجيهه للوحة التحكم
        if (user) {
            navigate('/dashboard');
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [user, navigate]);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            setDeferredPrompt(null);
            setShowInstallButton(false);
        }
    };

    return (
        <div className={`min-h-screen font-cairo bg-gray-50 text-right ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
            {/* قلب نابض عائم */}
            <div className="fixed top-20 left-6 z-40 animate-pulse">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
            </div>

            {/* أيقونة تثبيت PWA */}
            {showInstallButton && (
                <div 
                    className="fixed top-32 left-6 z-40 bg-blue-500 p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors cursor-pointer"
                    onClick={handleInstallClick}
                    title="تثبيت التطبيق"
                >
                    <Download className="w-5 h-5 text-white" />
                </div>
            )}

            {/* Navigation Bar */}
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
                        <Link to="/auth" className="bg-[#00B4D8] text-[#03045E] text-sm font-semibold px-3 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-300">
                            تسجيل الدخول
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-20">
                {/* Section: Project Overview، Key Features، and Technologies Used */}
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

                {/* Hero Section: Main Title، Slogan، CTA، and Core Values */}
                <section id="hero" className="bg-gradient-to-br from-[#03045E] to-[#0077B6] text-white py-12 px-4 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('https://placehold.co/1200x800/FFFFFF/CCCCCC?text=Heart%20Monitor%20Pattern')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}></div>
                    
                    <div className="container mx-auto relative z-10">
                        <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                            نظام مراقبة القلب الذكي والمتطور
                        </h1>
                        <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto opacity-90">
                            نظام متكامل لمراقبة الحالة الصحية عن بُعد باستخدام تقنيات الذكاء الاصطناعي مع تنبيهات فورية وحماية متقدمة للبيانات.
                        </p>
                        <Link to="/auth" className="inline-block bg-[#00B4D8] text-[#03045E] font-bold text-lg md:text-xl px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
                            ابدأ الآن
                        </Link>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                            <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm shadow-md">
                                <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-white" />
                                <h3 className="text-lg font-bold mb-2">آمن ومشفر</h3>
                                <p className="text-sm opacity-90">حماية بياناتك الصحية بمعايير أمان عالية.</p>
                            </div>
                            <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm shadow-md">
                                <Stethoscope className="w-10 h-10 mx-auto mb-2 text-white" />
                                <h3 className="text-lg font-bold mb-2">مطابق للمعايير الطبية</h3>
                                <p className="text-sm opacity-90">مصمم وفقاً لأعلى المعايير الصحية العالمية.</p>
                            </div>
                            <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm shadow-md">
                                <Clock className="w-10 h-10 mx-auto mb-2 text-white" />
                                <h3 className="text-lg font-bold mb-2">متاح 24/7</h3>
                                <p className="text-sm opacity-90">مراقبة مستمرة لصحتك دون انقطاع.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
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

                {/* How It Works Section */}
                <section id="how-it-works" className="py-12 px-4 bg-[#CAF0F8]">
                    <div className="container mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#0077B6] mb-3">كيف يعمل النظام؟</h2>
                        <p className="text-base md:text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
                            خطوات بسيطة للحصول على مراقبة صحية متكاملة.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            {/* Step 1 */}
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 text-center relative z-10 md:flex-1">
                                <UserPlus className="w-10 h-10 mx-auto mb-2 text-[#03045E]" />
                                <h3 className="text-lg font-bold text-[#03045E] mb-2">التسجيل والإعداد</h3>
                                <p className="text-gray-700 text-sm">إنشاء حساب واختيار نوع المستخدم وربط الجهاز.</p>
                            </div>

                            <div className="text-3xl text-[#00B4D8] rotate-90 md:rotate-0">
                                <ArrowLeft className="w-6 h-6" />
                            </div>
                            
                            {/* Step 2 */}
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 text-center relative z-10 md:flex-1">
                                <Activity className="w-10 h-10 mx-auto mb-2 text-[#03045E]" />
                                <h3 className="text-lg font-bold text-[#03045E] mb-2">المراقبة المستمرة</h3>
                                <p className="text-gray-700 text-sm">قراءات تلقائية لمعدل ضربات القلب مع تحليل فوري.</p>
                            </div>

                            <div className="text-3xl text-[#00B4D8] rotate-90 md:rotate-0">
                                <ArrowLeft className="w-6 h-6" />
                            </div>

                            {/* Step 3 */}
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 text-center relative z-10 md:flex-1">
                                <Bell className="w-10 h-10 mx-auto mb-2 text-[#03045E]" />
                                <h3 className="text-lg font-bold text-[#03045E] mb-2">التنبيهات والتقارير</h3>
                                <p className="text-gray-700 text-sm">إشعارات ذكية وتقارير مفصلة للمتابعة الطبية.</p>
                            </div>
                        </div>
                        <Link to="/auth" className="inline-block bg-[#00B4D8] text-[#03045E] font-bold text-lg md:text-xl px-8 py-3 rounded-full mt-8 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
                            ابدأ الآن
                        </Link>
                    </div>
                </section>

                {/* About Section */}
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

                {/* Final Call to Action */}
                <section id="get-started" className="bg-[#0077B6] text-white py-12 px-4 text-center">
                    <div className="container mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">ابدأ رحلتك نحو صحة أفضل اليوم</h2>
                        <p className="text-base md:text-lg mb-6 max-w-3xl mx-auto">
                            انضم إلى آلاف المستخدمين الذين يثقون في نظامنا لمراقبة صحتهم.
                        </p>
                        <Link to="/auth" className="inline-block bg-[#00B4D8] text-[#03045E] font-bold text-lg m d:text-xl px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
                            ابدأ التجربة المجانية
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-[#03045E] text-[#CAF0F8] py-6 text-center">
                <div className="container mx-auto text-sm">
                    <div className="text-center">
                        <span>&copy; 2025 - جميع الحقوق محفوظة - ملاك سنتر للخدمات الأكاديمية</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
