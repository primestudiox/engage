import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3.5">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-white/[0.04] bg-[#0e1012]/60 hover:bg-[#0e1012]/80 hover:border-white/[0.08] overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleIndex(idx)}
              className="w-full flex items-center justify-between px-5.5 py-4.5 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 pr-4">
                <HelpCircle className={`h-4.5 w-4.5 flex-shrink-0 transition-all duration-300 ${isOpen ? 'text-[#a2e043]' : 'text-gray-500'}`} />
                <span className="text-[14.5px] font-semibold text-white tracking-wide leading-snug">
                  {item.q}
                </span>
              </div>
              <ChevronDown
                className={`h-4.5 w-4.5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                  isOpen ? 'transform rotate-180 text-[#a2e043]' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-5.5 pb-5 pt-1 text-[13.5px] text-gray-400 leading-relaxed font-medium border-t border-white/[0.02]">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
