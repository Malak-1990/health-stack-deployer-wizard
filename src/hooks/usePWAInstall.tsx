import { useState, useEffect } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    let registeredSW = false;

    // ✅ 1. Register service worker for PWA support
    if ('serviceWorker' in navigator && !registeredSW) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);
          registeredSW = true;
        })
        .catch((err) => {
          console.error('❌ Service Worker registration failed:', err);
        });
    }

    // ✅ 2. Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Prevent default mini-infobar
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
      console.log('👍 beforeinstallprompt event captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    console.log('📦 Showing install prompt');
    await deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`🙋‍♂️ User response: ${outcome}`);

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  return { showInstallButton, handleInstallClick };
};
