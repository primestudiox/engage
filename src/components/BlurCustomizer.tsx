import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, X, Sparkles, RotateCcw, Settings, Eye } from 'lucide-react';

interface BlurCustomizerProps {
  discountBackdropBlur: number;
  setDiscountBackdropBlur: (val: number) => void;
  discountBackdropOpacity: number;
  setDiscountBackdropOpacity: (val: number) => void;
  discountCardBlur: number;
  setDiscountCardBlur: (val: number) => void;
  discountCardOpacity: number;
  setDiscountCardOpacity: (val: number) => void;
  formBlur: number;
  setFormBlur: (val: number) => void;
  formOpacity: number;
  setFormOpacity: (val: number) => void;
}

export default function BlurCustomizer({
  discountBackdropBlur,
  setDiscountBackdropBlur,
  discountBackdropOpacity,
  setDiscountBackdropOpacity,
  discountCardBlur,
  setDiscountCardBlur,
  discountCardOpacity,
  setDiscountCardOpacity,
  formBlur,
  setFormBlur,
  formOpacity,
  setFormOpacity,
}: BlurCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Set preset styles
  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'frosty':
        setDiscountBackdropBlur(16);
        setDiscountBackdropOpacity(0.35);
        setDiscountCardBlur(24);
        setDiscountCardOpacity(0.5);
        setFormBlur(24);
        setFormOpacity(0.5);
        
        localStorage.setItem('blur_discountBackdropBlur', '16');
        localStorage.setItem('blur_discountBackdropOpacity', '0.35');
        localStorage.setItem('blur_discountCardBlur', '24');
        localStorage.setItem('blur_discountCardOpacity', '0.5');
        localStorage.setItem('blur_formBlur', '24');
        localStorage.setItem('blur_formOpacity', '0.5');
        break;
      case 'matte':
        setDiscountBackdropBlur(30);
        setDiscountBackdropOpacity(0.65);
        setDiscountCardBlur(32);
        setDiscountCardOpacity(0.9);
        setFormBlur(32);
        setFormOpacity(0.9);

        localStorage.setItem('blur_discountBackdropBlur', '30');
        localStorage.setItem('blur_discountBackdropOpacity', '0.65');
        localStorage.setItem('blur_discountCardBlur', '32');
        localStorage.setItem('blur_discountCardOpacity', '0.9');
        localStorage.setItem('blur_formBlur', '32');
        localStorage.setItem('blur_formOpacity', '0.9');
        break;
      case 'subtle':
        setDiscountBackdropBlur(6);
        setDiscountBackdropOpacity(0.2);
        setDiscountCardBlur(8);
        setDiscountCardOpacity(0.92);
        setFormBlur(8);
        setFormOpacity(0.92);

        localStorage.setItem('blur_discountBackdropBlur', '6');
        localStorage.setItem('blur_discountBackdropOpacity', '0.2');
        localStorage.setItem('blur_discountCardBlur', '8');
        localStorage.setItem('blur_discountCardOpacity', '0.92');
        localStorage.setItem('blur_formBlur', '8');
        localStorage.setItem('blur_formOpacity', '0.92');
        break;
      case 'heavy':
        setDiscountBackdropBlur(40);
        setDiscountBackdropOpacity(0.8);
        setDiscountCardBlur(40);
        setDiscountCardOpacity(0.7);
        setFormBlur(40);
        setFormOpacity(0.7);

        localStorage.setItem('blur_discountBackdropBlur', '40');
        localStorage.setItem('blur_discountBackdropOpacity', '0.8');
        localStorage.setItem('blur_discountCardBlur', '40');
        localStorage.setItem('blur_discountCardOpacity', '0.7');
        localStorage.setItem('blur_formBlur', '40');
        localStorage.setItem('blur_formOpacity', '0.7');
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    setDiscountBackdropBlur(12);
    setDiscountBackdropOpacity(0.5);
    setDiscountCardBlur(16);
    setDiscountCardOpacity(0.82);
    setFormBlur(16);
    setFormOpacity(0.8);

    localStorage.removeItem('blur_discountBackdropBlur');
    localStorage.removeItem('blur_discountBackdropOpacity');
    localStorage.removeItem('blur_discountCardBlur');
    localStorage.removeItem('blur_discountCardOpacity');
    localStorage.removeItem('blur_formBlur');
    localStorage.removeItem('blur_formOpacity');
  };

  // Helper helper to update value and localStorage
  const updateValue = (setter: (v: number) => void, key: string, val: number) => {
    setter(val);
    localStorage.setItem(key, val.toString());
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        id="blur-customizer-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-[9990] bg-[#121315]/95 hover:bg-[#16181a] border border-white/[0.08] hover:border-[#00f6ac]/50 text-white hover:text-[#00f6ac] p-3.5 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-[1.05]"
        title="Visual & Blur Customizer"
      >
        <Sliders className="h-5 w-5 text-[#00f6ac] group-hover:rotate-12 transition-transform" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out text-xs font-mono font-bold tracking-wider uppercase pl-0 group-hover:pl-2">
          Blur Studio
        </span>
      </button>

      {/* Floating Control Draw-in Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 150 }}
            className="fixed bottom-24 left-6 z-[9991] w-full max-w-[340px] bg-[#0c0d10]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-5.5 text-left select-none overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00f6ac]" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Aesthetic Blur Studio
                </h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="mb-4">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider font-bold block mb-2">
                Style Presets
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => applyPreset('frosty')}
                  className="bg-white/[0.02] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.04] text-gray-400 hover:text-white px-2 py-1.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3 text-[#00f6ac]/70" />
                  Frosty Air
                </button>
                <button
                  onClick={() => applyPreset('matte')}
                  className="bg-white/[0.02] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.04] text-gray-400 hover:text-white px-2 py-1.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3 text-[#00f6ac]/70" />
                  Matte Glass
                </button>
                <button
                  onClick={() => applyPreset('subtle')}
                  className="bg-white/[0.02] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.04] text-gray-400 hover:text-white px-2 py-1.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3 text-[#00f6ac]/70" />
                  Subtle Tint
                </button>
                <button
                  onClick={() => applyPreset('heavy')}
                  className="bg-white/[0.02] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.04] text-gray-400 hover:text-white px-2 py-1.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3 text-[#00f6ac]/70" />
                  Heavy Blur
                </button>
              </div>
            </div>

            {/* Sliders Container */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              
              {/* 1. Form Card Settings */}
              <div className="space-y-2.5 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#00f6ac] font-bold font-mono tracking-wider uppercase">
                    Subscription Form
                  </span>
                </div>

                {/* Form blur slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-gray-400 font-mono">
                    <span>Backdrop Blur</span>
                    <span className="text-white font-bold">{formBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={formBlur}
                    onChange={(e) => updateValue(setFormBlur, 'blur_formBlur', Number(e.target.value))}
                    className="w-full accent-[#00f6ac] h-1 bg-white/10 rounded-lg cursor-pointer appearance-none"
                  />
                </div>

                {/* Form opacity slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-gray-400 font-mono">
                    <span>Card Tint Opacity</span>
                    <span className="text-white font-bold">{Math.round(formOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={formOpacity}
                    onChange={(e) => updateValue(setFormOpacity, 'blur_formOpacity', Number(e.target.value))}
                    className="w-full accent-[#00f6ac] h-1 bg-white/10 rounded-lg cursor-pointer appearance-none"
                  />
                </div>
              </div>

              {/* 2. Floating Discount Card Settings */}
              <div className="space-y-2.5 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#00f6ac] font-bold font-mono tracking-wider uppercase">
                    Discount Popup Box
                  </span>
                </div>

                {/* Card blur slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-gray-400 font-mono">
                    <span>Backdrop Blur</span>
                    <span className="text-white font-bold">{discountCardBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={discountCardBlur}
                    onChange={(e) => updateValue(setDiscountCardBlur, 'blur_discountCardBlur', Number(e.target.value))}
                    className="w-full accent-[#00f6ac] h-1 bg-white/10 rounded-lg cursor-pointer appearance-none"
                  />
                </div>

                {/* Card opacity slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-gray-400 font-mono">
                    <span>Box Tint Opacity</span>
                    <span className="text-white font-bold">{Math.round(discountCardOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={discountCardOpacity}
                    onChange={(e) => updateValue(setDiscountCardOpacity, 'blur_discountCardOpacity', Number(e.target.value))}
                    className="w-full accent-[#00f6ac] h-1 bg-white/10 rounded-lg cursor-pointer appearance-none"
                  />
                </div>
              </div>

              {/* 3. Discount Screen Backdrop Screen Blur */}
              <div className="space-y-2.5 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#00f6ac] font-bold font-mono tracking-wider uppercase">
                    Discount Screen Backdrop
                  </span>
                </div>

                {/* Screen blur slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-gray-400 font-mono">
                    <span>Screen Backdrop Blur</span>
                    <span className="text-white font-bold">{discountBackdropBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    value={discountBackdropBlur}
                    onChange={(e) => updateValue(setDiscountBackdropBlur, 'blur_discountBackdropBlur', Number(e.target.value))}
                    className="w-full accent-[#00f6ac] h-1 bg-white/10 rounded-lg cursor-pointer appearance-none"
                  />
                </div>

                {/* Screen backdrop opacity slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-gray-400 font-mono">
                    <span>Backdrop Darken Opacity</span>
                    <span className="text-white font-bold">{Math.round(discountBackdropOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.95"
                    step="0.05"
                    value={discountBackdropOpacity}
                    onChange={(e) => updateValue(setDiscountBackdropOpacity, 'blur_discountBackdropOpacity', Number(e.target.value))}
                    className="w-full accent-[#00f6ac] h-1 bg-white/10 rounded-lg cursor-pointer appearance-none"
                  />
                </div>
              </div>

            </div>

            {/* Footer with Reset Controls */}
            <div className="flex items-center justify-between mt-4.5 border-t border-white/[0.06] pt-3.5">
              <span className="text-[9px] text-gray-500 font-medium">
                Tailwind & Glassmorphism Studio
              </span>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 hover:text-[#00f6ac] text-gray-400 text-[10.5px] font-mono font-bold uppercase transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
