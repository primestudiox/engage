import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, BookOpen, Calendar, Wrench, ChevronDown, CheckCircle, Smartphone, Globe, MessageSquare } from 'lucide-react';
import SubscriptionForm from './components/SubscriptionForm';
import RotatingWords from './components/RotatingWords';
import LegalModal from './components/LegalModal';
import FaqAccordion from './components/FaqAccordion';
import { translations } from './data/translations';

export default function App() {
  const [lang, setLang] = useState<'en' | 'fr' | 'es'>('en');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: 'privacy' | 'terms' }>({
    isOpen: false,
    type: 'privacy',
  });

  useEffect(() => {
    try {
      const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
      const cleanLang = browserLang.toLowerCase().slice(0, 2);
      if (cleanLang === 'fr') {
        setLang('fr');
      } else if (cleanLang === 'es') {
        setLang('es');
      } else {
        setLang('en');
      }
    } catch (e) {
      console.warn('Could not auto-detect browser language:', e);
    }
  }, []);

  const t = translations[lang];

  const scrollToForm = () => {
    document.getElementById('registration-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openLegal = (type: 'privacy' | 'terms') => {
    setLegalModal({ isOpen: true, type });
  };

  return (
    <div className="min-h-screen bg-[#050607] text-gray-300 flex flex-col items-center justify-between selection:bg-[#84a836]/30 selection:text-[#a2e043] font-sans antialiased relative overflow-x-hidden">
      {/* Ambient background glow layers starting from vibrant green down to deep velvet black */}
      <div className="absolute top-0 left-0 right-0 h-[800px] bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,_rgba(132,168,54,0.22)_0%,_rgba(162,224,67,0.07)_45%,_rgba(5,6,7,0)_100%)] pointer-events-none z-0 transform-gpu will-change-transform" />
      
      {/* Secondary atmospheric soft central green glow */}
      <div className="absolute top-[350px] left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,_rgba(132,168,54,0.09)_0%,_rgba(162,224,67,0.02)_50%,_transparent_100%)] pointer-events-none z-0 transform-gpu will-change-transform" />

      {/* Side background ambient warm/green light flare */}
      <div className="absolute top-[200px] right-[-250px] w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(162,224,67,0.04)_0%,_transparent_70%)] pointer-events-none z-0 blur-2xl transform-gpu will-change-transform opacity-70 animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[500px] left-[-250px] w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(132,168,54,0.03)_0%,_transparent_70%)] pointer-events-none z-0 blur-2xl transform-gpu will-change-transform opacity-60" />

      {/* Subtle bottom footer green-to-black glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-[radial-gradient(ellipse_100%_70%_at_50%_110%,_rgba(132,168,54,0.07)_0%,_rgba(5,6,7,0)_100%)] pointer-events-none z-0 transform-gpu will-change-transform" />

      {/* Floating Top Header Banner */}
      <header className="w-full max-w-4xl px-4 pt-6 z-30">
        <div className="w-full flex items-center justify-between py-3 px-5 md:px-6 rounded-2xl bg-[#0e1012]/85 border border-white/[0.05] backdrop-blur-xl shadow-xl">
          {/* Logo brand */}
          <span className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span className="w-5.5 h-5.5 rounded-lg bg-gradient-to-br from-[#84a836] to-[#a2e043] flex items-center justify-center text-[#121a05] text-xs font-mono font-extrabold select-none shadow-sm shadow-[#84a836]/10">
              S
            </span>
            {t.nav.logo}
          </span>

          <div className="flex items-center gap-4.5">
            {/* Scroll CTA Button */}
            <button
              onClick={scrollToForm}
              className="px-4 py-1.5 md:px-4.5 md:py-2 rounded-xl bg-[#84a836] hover:bg-[#9cbd40] text-[#121a05] text-xs font-bold tracking-wide transition-all duration-200 active:scale-95 cursor-pointer shadow-md shadow-[#84a836]/5 hover:shadow-[#84a836]/10"
            >
              {t.nav.cta}
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Form Section */}
      <main className="w-full max-w-4xl px-4 pt-14 pb-20 flex flex-col items-center z-10 text-center relative">
        <div className="max-w-2xl mx-auto space-y-6 mb-11">
          {/* Top Live Updates Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c2e0c]/30 border border-[#84a836]/20 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#a2e043] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#a2e043] font-mono">
              {t.hero.badge}
            </span>
          </motion.div>

          {/* Primary Multi-Language Rotating Headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-extrabold font-serif text-white tracking-tight leading-[1.05] max-w-xl mx-auto">
              {t.hero.titlePre}
              <br className="hidden md:block" />
              <RotatingWords words={t.hero.rotatingWords} />
              {t.hero.titlePost}
            </h1>
          </motion.div>

          {/* Subtitle Description text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-gray-400 font-medium leading-relaxed max-w-lg mx-auto text-sm md:text-base px-2"
          >
            {t.hero.sub}
          </motion.p>

          {/* Vaibhav Sisinty Founder Profile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={scrollToForm}
            className="flex items-center justify-center gap-3 bg-[#111315]/40 border border-white/[0.04] rounded-full py-1.5 pl-2 pr-4.5 w-fit mx-auto cursor-pointer hover:bg-[#111315]/75 hover:border-white/[0.09] transition-all duration-200"
          >
            <img
              src="/src/assets/images/founder_avatar_1780480032739.png"
              alt="Vaibhav Sisinty"
              referrerPolicy="no-referrer"
              className="w-8.5 h-8.5 rounded-full object-cover border border-[#84a836]/40"
            />
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-white font-serif">{t.founder.name}</p>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{t.founder.role}</p>
            </div>
          </motion.div>

          {/* Visual anchor indicator */}
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="flex justify-center pt-2"
          >
            <ChevronDown className="h-4.5 w-4.5 text-gray-600 block" />
          </motion.div>
        </div>

        {/* Subscription Forms Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 90, damping: 14 }}
          className="w-full relative z-20"
        >
          <SubscriptionForm lang={lang} />
        </motion.div>

        {/* "What You'll Get" Bento-style dynamic features grid */}
        <section className="w-full max-w-3xl mt-32 mb-10 space-y-10">
          <div className="text-center space-y-3.5">
            <span className="inline-flex items-center gap-1.5 bg-[#84a836]/10 text-[#a2e043] text-[10px] font-bold tracking-widest font-mono uppercase px-3 py-1 rounded-full border border-[#84a836]/15 justify-center">
              🧭 Features
            </span>
            <h2 className="text-3.5xl md:text-4.5xl font-serif font-extrabold text-white tracking-tight leading-none">
              {t.whatYouGet.title}
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
              {t.whatYouGet.sub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            {/* Dynamic Card 1 - AI Updates */}
            <div className="p-6.5 rounded-2.5xl bg-[#111315]/40 border border-white/[0.04] hover:bg-[#111315]/75 hover:border-white/[0.09] transition-all duration-300 group shadow-lg">
              <div className="w-10.5 h-10.5 rounded-xl bg-[#84a836]/10 flex items-center justify-center text-[#a2e043] border border-[#84a836]/20 mb-4 group-hover:scale-110 group-hover:bg-[#84a836]/20 transition-all duration-300">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#a2e043] transition-colors leading-none tracking-wide">
                {t.whatYouGet.cards[0].title}
              </h3>
              <p className="text-[12.5px] text-gray-400 leading-relaxed font-medium">
                {t.whatYouGet.cards[0].desc}
              </p>
            </div>

            {/* Dynamic Card 2 - Curated Resources */}
            <div className="p-6.5 rounded-2.5xl bg-[#111315]/40 border border-white/[0.04] hover:bg-[#111315]/75 hover:border-white/[0.09] transition-all duration-300 group shadow-lg">
              <div className="w-10.5 h-10.5 rounded-xl bg-[#84a836]/10 flex items-center justify-center text-[#a2e043] border border-[#84a836]/20 mb-4 group-hover:scale-110 group-hover:bg-[#84a836]/20 transition-all duration-300">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#a2e043] transition-colors leading-none tracking-wide">
                {t.whatYouGet.cards[1].title}
              </h3>
              <p className="text-[12.5px] text-gray-400 leading-relaxed font-medium">
                {t.whatYouGet.cards[1].desc}
              </p>
            </div>

            {/* Dynamic Card 3 - Session Invites */}
            <div className="p-6.5 rounded-2.5xl bg-[#111315]/40 border border-white/[0.04] hover:bg-[#111315]/75 hover:border-white/[0.09] transition-all duration-300 group shadow-lg">
              <div className="w-10.5 h-10.5 rounded-xl bg-[#84a836]/10 flex items-center justify-center text-[#a2e043] border border-[#84a836]/20 mb-4 group-hover:scale-110 group-hover:bg-[#84a836]/20 transition-all duration-300">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#a2e043] transition-colors leading-none tracking-wide">
                {t.whatYouGet.cards[2].title}
              </h3>
              <p className="text-[12.5px] text-gray-400 leading-relaxed font-medium">
                {t.whatYouGet.cards[2].desc}
              </p>
            </div>

            {/* Dynamic Card 4 - Free Tools */}
            <div className="p-6.5 rounded-2.5xl bg-[#111315]/40 border border-white/[0.04] hover:bg-[#111315]/75 hover:border-white/[0.09] transition-all duration-300 group shadow-lg">
              <div className="w-10.5 h-10.5 rounded-xl bg-[#84a836]/10 flex items-center justify-center text-[#a2e043] border border-[#84a836]/20 mb-4 group-hover:scale-110 group-hover:bg-[#84a836]/20 transition-all duration-300">
                <Wrench className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#a2e043] transition-colors leading-none tracking-wide">
                {t.whatYouGet.cards[3].title}
              </h3>
              <p className="text-[12.5px] text-gray-400 leading-relaxed font-medium">
                {t.whatYouGet.cards[3].desc}
              </p>
            </div>
          </div>
        </section>

        {/* Minimal FAQ Section (Simple, Accessible, Not Overwhelming) */}
        <section className="w-full max-w-3xl mt-24 mb-10 space-y-9">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1 bg-[#84a836]/15 text-[#a2e043] text-[10px] font-bold tracking-widest font-mono uppercase px-2.5 py-0.5 rounded-md border border-[#84a836]/20 justify-center">
              FAQ
            </span>
            <h2 className="text-3xl font-serif font-extrabold text-white tracking-tight">
              {t.faq.title}
            </h2>
            <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed font-medium">
              {t.faq.sub}
            </p>
          </div>

          <FaqAccordion items={t.faq.items} />
        </section>
      </main>

      {/* Simplified, Accessible Footer copyright section (No Overwhelming Clutter) */}
      <footer className="w-full border-t border-white/[0.05] py-10 text-center bg-[#070809] z-10 text-xs text-gray-500 font-medium tracking-wide space-y-4.5 relative flex flex-col items-center">
        <p className="text-gray-400 font-semibold">{t.footer.respectPrivacy}</p>
        
        {/* Seamless Custom Language Dropdown Menu */}
        <div className="relative inline-block text-left z-20">
          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="bg-black/45 border border-white/[0.08] hover:border-[#84a836]/40 px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-inner text-gray-400 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-gray-500" />
            <span>{lang === 'en' ? 'English (EN)' : lang === 'fr' ? 'Français (FR)' : 'Español (ES)'}</span>
            <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <>
                {/* Backdrop overlay to close when clicking outside */}
                <div 
                  className="fixed inset-0 z-10 cursor-default" 
                  onClick={() => setIsLangOpen(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-44 bg-[#0e1012] border border-white/[0.08] rounded-xl shadow-2xl p-1 z-20 overflow-hidden"
                >
                  {(['en', 'fr', 'es'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        lang === l
                          ? 'bg-[#84a836]/15 text-[#a2e043] border-l-2 border-[#84a836]'
                          : 'text-gray-400 hover:bg-white/[0.03] hover:text-white'
                      }`}
                    >
                      <span>
                        {l === 'en' ? 'English' : l === 'fr' ? 'Français' : 'Español'}
                      </span>
                      <span className="text-[9px] text-gray-600 font-mono">{l}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4.5 pt-1 text-gray-500">
          <button
            onClick={() => openLegal('privacy')}
            className="hover:text-white transition-colors cursor-pointer hover:underline font-mono"
          >
            {t.footer.privacyPolicy}
          </button>
          <span>•</span>
          <button
            onClick={() => openLegal('terms')}
            className="hover:text-white transition-colors cursor-pointer hover:underline font-mono"
          >
            {t.footer.termsOfUse}
          </button>
        </div>
        <p className="text-gray-600 text-[11px] pt-1">
          {t.footer.copyright}
        </p>
      </footer>

      {/* Accessible, Premium Legal Modals */}
      <LegalModal
        isOpen={legalModal.isOpen}
        onClose={() => setLegalModal({ ...legalModal, isOpen: false })}
        type={legalModal.type}
        lang={lang}
      />
    </div>
  );
}
