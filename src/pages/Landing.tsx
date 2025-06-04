
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import ProjectInfo from '@/components/ProjectInfo';
import LandingCarousel from '@/components/LandingCarousel';
import LandingNavigation from '@/components/LandingNavigation';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { direction } = useLanguage();

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
    <div className={`min-h-screen ${direction === 'rtl' ? 'font-cairo' : ''}`} dir={direction}>
      {/* Fixed Navigation */}
      <LandingNavigation />
      
      {/* Main Carousel Content */}
      <main className="pt-16">
        <LandingCarousel />
      </main>

      {/* Project Info Footer */}
      <ProjectInfo />
    </div>
  );
};

export default Landing;
