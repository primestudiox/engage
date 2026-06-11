import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Tag, Zap } from 'lucide-react';

interface DiscountTimerProps {
  lang: 'en' | 'fr' | 'es';
}

const TIMER_TEXTS = {
  en: {
    step: "STEP 3",
    title: "65% Discount",
    subtitle: "Get a comprehensive business plan with 65% discount.",
    cta: "Apply 65% Off",
    days: "days",
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    off: "OFF",
    closeTitle: "Close",
  },
  fr: {
    step: "ÉTAPE 3",
    title: "Réduction de 65%",
    subtitle: "Sécurisez un plan d'affaires complet avec 65% de réduction.",
    cta: "Profiter de -65%",
    days: "jours",
    hours: "heures",
    minutes: "minutes",
    seconds: "secondes",
    off: "RÉDUC",
    closeTitle: "Fermer",
  },
  es: {
    step: "PASO 3",
    title: "Descuento del 65%",
    subtitle: "Obtén un plan de negocios detallado con 65% de descuento.",
    cta: "Aplicar -65%",
    days: "días",
    hours: "horas",
    minutes: "minutos",
    seconds: "segundos",
    off: "DESCTO",
    closeTitle: "Cerrar",
  }
};

const calculateWashingtonDCCountdown = (): { targetTimestamp: number; timeLeftInSeconds: number } => {
  const nowUtc = Date.now();
  
  try {
    // 1. Get the current date/time components in America/New_York timezone
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    
    const parts = dtf.formatToParts(new Date(nowUtc));
    const map: Record<string, number> = {};
    parts.forEach(p => {
      if (p.type !== 'literal') {
        map[p.type] = parseInt(p.value, 10);
      }
    });
    
    // Helper to get UTC timestamp from NYC local parts
    const getUtcFromNycParts = (year: number, month: number, day: number, hour: number, minute: number, second: number): number => {
      const guessUtc = Date.UTC(year, month - 1, day, hour, minute, second);
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      });
      
      let currentEstimated = guessUtc;
      for (let i = 0; i < 3; i++) {
        const p = formatter.formatToParts(new Date(currentEstimated));
        const m: Record<string, number> = {};
        p.forEach(x => { if (x.type !== 'literal') m[x.type] = parseInt(x.value, 10); });
        
        const diffMs = Date.UTC(year, month - 1, day, hour, minute, second) - 
                       Date.UTC(m.year, m.month - 1, m.day, m.hour, m.minute, m.second);
        if (diffMs === 0) break;
        currentEstimated += diffMs;
      }
      return currentEstimated;
    };
    
    // Calculate 00:10:00 (end of day plus 10 minutes, meaning 10 minutes past midnight)
    const todayThreshold = getUtcFromNycParts(map.year, map.month, map.day, 0, 10, 0);
    
    let targetUtc: number;
    if (nowUtc < todayThreshold) {
      // We are before today's 00:10:00 EDT (e.g. between midnight and 00:10:00)
      targetUtc = todayThreshold;
    } else {
      // Target is tomorrow's 00:10:00 EDT
      const tomorrow = new Date(nowUtc + 24 * 60 * 60 * 1000);
      const tomorrowParts = dtf.formatToParts(tomorrow);
      const tomMap: Record<string, number> = {};
      tomorrowParts.forEach(p => {
        if (p.type !== 'literal') {
          tomMap[p.type] = parseInt(p.value, 10);
        }
      });
      targetUtc = getUtcFromNycParts(tomMap.year, tomMap.month, tomMap.day, 0, 10, 0);
    }
    
    return {
      targetTimestamp: targetUtc,
      timeLeftInSeconds: Math.max(0, Math.floor((targetUtc - nowUtc) / 1000))
    };
  } catch (err) {
    // Fallback if Intl or formatToParts is unsupported (should not happen in modern browsers)
    const fallbackTarget = Date.now() + 24 * 60 * 60 * 1000;
    return {
      targetTimestamp: fallbackTarget,
      timeLeftInSeconds: 24 * 3600
    };
  }
};

export default function DiscountTimer({ lang }: DiscountTimerProps) {
  const texts = TIMER_TEXTS[lang] || TIMER_TEXTS.en;
  
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false); // start open, loads on every mount
  
  const [targetTime, setTargetTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    // We want the discount card to always show up fresh every time the user loads or returns to the landing page.
    setIsDismissed(false);
    
    // Set up the target timestamp persistent countdown (Washington D.C. date/time based)
    const { targetTimestamp, timeLeftInSeconds } = calculateWashingtonDCCountdown();
    setTargetTime(targetTimestamp);
    setTimeLeft(timeLeftInSeconds);
    
    // Set visibility after brief delay for smooth entrance
    const timer = setTimeout(() => setIsVisible(true), 1250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const { targetTimestamp, timeLeftInSeconds } = calculateWashingtonDCCountdown();
      setTargetTime(targetTimestamp);
      setTimeLeft(timeLeftInSeconds);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const days = Math.floor(timeLeft / (24 * 3600));
  const hours = Math.floor((timeLeft % (24 * 3600)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatUnit = (value: number) => {
    return value < 10 ? `0${value}` : `${value}`;
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(() => {
      setIsDismissed(true);
    }, 300);
  };

  const handleClaimClick = () => {
    const formElement = document.getElementById('registration-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      // Add visual glow reminder effect temporarily on registration card
      formElement.classList.add('animate-shake');
      setTimeout(() => {
        formElement.classList.remove('animate-shake');
      }, 1000);
    }
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Transparent blocking overlay active specifically in portrait mode */}
          <motion.div
            key="discount-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="discount-backdrop"
            onClick={(e) => {
              e.stopPropagation();
              // Prevent clicks and actions to the backend page elements
            }}
          />
          
          <motion.div
            key="discount-card"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
            id="discount-floating-card"
            onClick={handleClaimClick}
            className="fixed bottom-0 right-0 left-0 z-[9999] bg-[#07080a] border-t border-white/[0.08] hover:border-[#00ff88]/35 p-6 lg:p-8 shadow-[0_-32px_64px_rgba(0,0,0,0.95),_0_0_40px_rgba(0,255,136,0.04)] transition-all duration-500 group cursor-pointer select-none"
          >
            {/* Ambient neon green organic background glows */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[radial-gradient(circle,_rgba(0,255,136,0.08)_0%,_transparent_75%)] pointer-events-none z-0 rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[radial-gradient(circle,_rgba(0,255,136,0.04)_0%,_transparent_75%)] pointer-events-none z-0 rounded-full" />
            
            {/* Close button - sleek, elevated & positioned inside the card padding to prevent any visibility/clipping overlap */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.12] border border-white/[0.08] hover:border-[#00ff88]/50 flex items-center justify-center text-gray-400 hover:text-[#00ff88] hover:scale-110 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer shrink-0 z-50"
              title={texts.closeTitle}
            >
              <X className="w-3.5 h-3.5" />
            </button>
            
            {/* Outer flex wrapper for responsive directional layout (stands full width/landscape or stacked/portrait) */}
            <div className="discount-inner-wrapper flex flex-col w-full relative z-10">
              
              {/* Giant '65% OFF' Stack covering the upper middle layout in the user's uploaded style */}
              <div className="discount-percent-block relative z-10 flex items-center justify-center gap-4.5 mb-6 mt-3 select-none">
                {/* Extremely bold, giant "65" */}
                <span className="discount-huge-number text-[120px] sm:text-[135px] font-black text-white leading-none tracking-tighter drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]">
                  65
                </span>
                {/* Column of "%" and "OFF" next to it */}
                <div className="flex flex-col items-start justify-center leading-none">
                  <span className="discount-percent-symbol text-5xl sm:text-6xl font-black text-white leading-none tracking-tight">
                    %
                  </span>
                  <span className="discount-off-text text-3xl sm:text-4xl font-extrabold text-[#00ff88] leading-none tracking-[0.15em] uppercase mt-2.5 drop-shadow-[0_0_15px_rgba(0,255,136,0.38)] pl-[0.1em]">
                    {texts.off}
                  </span>
                </div>
              </div>

              {/* Luxury Minimalist Countdown Clock - exactly as in user reference picture */}
              <div className="discount-clock-block relative z-10 w-full bg-black/40 border border-white/[0.02] rounded-24 p-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] mb-6">
                <div className="flex items-center justify-around text-center select-none">
                  
                  {/* Days Block */}
                  <div className="flex flex-col items-center">
                    <span className="discount-clock-num text-4xl sm:text-[42px] font-extrabold text-white leading-none tracking-tight">
                      {formatUnit(days)}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium tracking-normal lowercase mt-2">
                      {texts.days}
                    </span>
                  </div>
                  
                  {/* Glowing Green Separator Dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] opacity-80 animate-pulse shrink-0" />
                  
                  {/* Hours Block */}
                  <div className="flex flex-col items-center">
                    <span className="discount-clock-num text-4xl sm:text-[42px] font-extrabold text-white leading-none tracking-tight">
                      {formatUnit(hours)}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium tracking-normal lowercase mt-2">
                      {texts.hours}
                    </span>
                  </div>
    
                  {/* Glowing Green Separator Dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] opacity-80 animate-pulse shrink-0" />
    
                  {/* Minutes Block */}
                  <div className="flex flex-col items-center">
                    <span className="discount-clock-num text-4xl sm:text-[42px] font-extrabold text-white leading-none tracking-tight">
                      {formatUnit(minutes)}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium tracking-normal lowercase mt-2">
                      {texts.minutes}
                    </span>
                  </div>
    
                  {/* Glowing Green Separator Dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] opacity-80 animate-pulse shrink-0" />
    
                  {/* Seconds Block */}
                  <div className="flex flex-col items-center">
                    <span className="discount-clock-num text-4xl sm:text-[42px] font-extrabold text-white leading-none tracking-tight">
                      {formatUnit(seconds)}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium tracking-normal lowercase mt-2">
                      {texts.seconds}
                    </span>
                  </div>
    
                </div>
              </div>

              {/* Subtitle and button grouped together for perfect vertical flow or landscape row nesting */}
              <div className="discount-mid-block flex flex-col mb-1">
                {/* Details Centered - Sleek & Minimalist */}
                <div className="discount-subtitle-wrap text-center mb-5 relative z-10 px-4">
                  <p className="discount-subtitle-text text-xs text-gray-400 font-medium leading-relaxed max-w-[280px] mx-auto">
                    {texts.subtitle}
                  </p>
                </div>

                {/* Large Premium Action Button */}
                <div className="discount-btn-wrap flex justify-center relative z-10 px-2 animate-pulse hover:animate-none">
                  <button
                    onClick={handleClaimClick}
                    className="discount-action-btn w-full py-3.5 rounded-xl bg-white hover:bg-[#00ff88] text-[#07080a] text-xs font-black tracking-widest transition-all duration-300 active:scale-95 flex items-center justify-center gap-2.5 shadow-[0_4px_24px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_24px_rgba(0,255,136,0.45)] shrink-0 cursor-pointer uppercase group/btn"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current text-[#07080a] group-hover/btn:animate-bounce shrink-0" />
                    <span>{texts.cta}</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
