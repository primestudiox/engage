import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Download, Share2, PlusSquare, ArrowUp, Sparkles } from 'lucide-react';

interface PwaInstallPromptProps {
  lang: 'en' | 'fr' | 'es';
}

export default function PwaInstallPrompt({ lang }: PwaInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // Check if dismissed in this session or past sessions
    const isDismissed = localStorage.getItem('engage_pwa_dismissed');
    if (isDismissed === 'true') {
      return;
    }

    // Detect if environment is PWA standalone mode already or iframe
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone;
    
    if (isStandalone) {
      return;
    }

    // Support detection of iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // If it's iOS and not standalone, let's flag as installable using instruction sheet
    if (isIOSDevice) {
      setIsInstallable(true);
      // Automatically show after 3 seconds for active visibility
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    // Listen to standard Chrome/Android installation event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      // Automatically show after 3 seconds
      const timer = setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show elegant step-by-step guide for iOS Safari
      setShowInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    // Trigger installation
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA installation choice outcomes: ${outcome}`);
    
    // Clear prompt event and close banner if accepted
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Persist choice so we don't disrupt user's return session right away
    localStorage.setItem('engage_pwa_dismissed', 'true');
  };

  const PWA_DICTIONARY = {
    en: {
      alert: "Install the Engage app for instant AI updates and offline support.",
      cta: "Install App",
      iosTitle: "Installez l'App sur votre iPhone / iPad",
      iosHeader: "How to Install Engage:",
      iosStep1: "1. Tap the Share button at the bottom of your Safari menu bar.",
      iosStep2: "2. Scroll down and tap 'Add to Home Screen' (or similar).",
      iosStep3: "3. Tap 'Add' in the top right to complete installation.",
      close: "Got it"
    },
    fr: {
      alert: "Installez l'application Engage pour un accès instantané et le mode hors ligne.",
      cta: "Installer L'App",
      iosTitle: "Installer l'application sur iOS",
      iosHeader: "Comment installer l'application :",
      iosStep1: "1. Appuyez sur le bouton Partager au bas de l'écran dans Safari.",
      iosStep2: "2. Faites défiler et appuyez sur 'Sur l'écran d'accueil'.",
      iosStep3: "3. Cliquez sur 'Ajouter' en haut à droite pour confirmer.",
      close: "Compris"
    },
    es: {
      alert: "Instala la aplicación Engage para acceso inmediato y soporte sin conexión.",
      cta: "Instalar App",
      iosTitle: "Instalar la aplicación en iOS",
      iosHeader: "Cómo instalar la aplicación :",
      iosStep1: "1. Toca el botón Compartir en la barra de Safari.",
      iosStep2: "2. Desliza hacia abajo y toca 'Agregar a pantalla de inicio'.",
      iosStep3: "3. Presiona 'Agregar' arriba a la derecha para confirmar.",
      close: "Entendido"
    }
  };

  const texts = PWA_DICTIONARY[lang] || PWA_DICTIONARY.en;

  return (
    <>
      <AnimatePresence>
        {showBanner && isInstallable && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-[#00f6ac]/10 border-b border-[#00f6ac]/20 text-white z-50 relative overflow-hidden shrink-0"
          >
            {/* Visual background atmospheric touch */}
            <div className="absolute right-[-40px] top-[-30px] w-24 h-24 bg-[radial-gradient(circle,_rgba(0,246,172,0.15)_0%,_transparent_70%)] pointer-events-none rounded-full" />
            
            <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-3 flex flex-row items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f6ac] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f6ac]"></span>
                </span>
                
                <span className="text-[12.5px] font-sans font-medium text-gray-200 tracking-wide leading-tight">
                  {texts.alert}
                </span>
              </div>

              <div className="flex items-center gap-4.5 shrink-0 ml-auto sm:ml-0">
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-widest bg-[#00f6ac] text-[#020202] rounded-lg hover:bg-[#2effc0] transition-all hover:scale-103 duration-300 active:scale-97 cursor-pointer shadow-md shadow-[#00f6ac]/20 shrink-0"
                >
                  {texts.cta}
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/[0.05] transition-all cursor-pointer"
                  aria-label="Dismiss launch prompt"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant iOS Step-by-step Guided Dialog Modal */}
      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            {/* Dark fuzzy deep background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInstructions(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="relative w-full max-w-sm bg-[#0e1012] border border-white/[0.08] shadow-[0_32px_64px_rgba(0,0,0,0.85)] p-6.5 rounded-2.5xl text-left overflow-hidden z-10"
            >
              {/* Subtle accent glow backdrops */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,_rgba(0,246,172,0.06)_0%,_transparent_75%)] pointer-events-none rounded-full" />
              
              <div className="flex items-center gap-3 border-b border-white/[0.05] pb-4 mb-4.5">
                <div className="w-9 h-9 rounded-xl bg-[#00f6ac]/10 flex items-center justify-center border border-[#00f6ac]/20 text-[#00f6ac]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-white tracking-tight">
                  {texts.iosTitle}
                </h3>
              </div>

              <p className="text-[12.5px] text-[#00f6ac] font-bold uppercase tracking-widest font-mono mb-3 leading-none">
                {texts.iosHeader}
              </p>

              <div className="space-y-4 text-xs font-medium text-gray-300 leading-relaxed mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                    <Share2 className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <p className="pt-0.5">{texts.iosStep1}</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                    <PlusSquare className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <p className="pt-0.5">{texts.iosStep2}</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                    <ArrowUp className="w-3.5 h-3.5 text-gray-400 animate-bounce" />
                  </div>
                  <p className="pt-0.5">{texts.iosStep3}</p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="px-5 py-2 text-[11px] font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  {texts.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
