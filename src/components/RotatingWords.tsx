import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface RotatingWordsProps {
  words: string[];
}

export default function RotatingWords({ words }: RotatingWordsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Reset index to 0 if words array changes to avoid out of bounds
    setIndex(0);
  }, [words]);

  useEffect(() => {
    if (words.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [words]);

  return (
    <span className="relative inline-flex h-[1.2em] overflow-hidden align-top px-1.5">
      <AnimatePresence mode="wait">
        <motion.span
          key={`${words[index]}-${index}`}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 14,
            opacity: { duration: 0.18 }
          }}
          className="text-[#00f6ac] font-extrabold"
        >
          {words[index] || ""}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
