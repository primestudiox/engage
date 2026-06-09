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
    <span className="relative inline-flex h-[1.25em] overflow-hidden align-top px-1.5 min-w-[20px]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={`${words[index]}-${index}`}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{
            y: { type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.45 },
            opacity: { duration: 0.25 }
          }}
          className="text-[#00f6ac] font-extrabold inline-block"
        >
          {words[index] || ""}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
