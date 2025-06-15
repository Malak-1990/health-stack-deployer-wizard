
import React, { useEffect, useState } from 'react';
import { Heart, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LandingNav from '@/components/landing/LandingNav';
import ProjectOverview from '@/components/landing/ProjectOverview';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import AboutSection from '@/components/landing/AboutSection';
import CallToActionSection from '@/components/landing/CallToActionSection';
import LandingFooter from '@/components/landing/LandingFooter';

const LandingPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { direction } = useLanguage();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    
    // URL الش عار الجديد المرفق
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
            <LandingNav logoUrl={logoUrl} />

            <main className="pt-20">
                <ProjectOverview />
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <AboutSection />
                <CallToActionSection />
            </main>

            <LandingFooter />
        </div>
    );
};

export default LandingPage;
