import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, X, Check } from 'lucide-react';
import { Country } from '../types';
import { countries } from '../data/countries';

interface CountrySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
  lang: 'en' | 'fr' | 'es';
}

const TEXTS = {
  en: {
    title: "Select Country / Code",
    searchPlaceholder: "Search by country, code or prefix...",
    notFound: "No countries found"
  },
  fr: {
    title: "Sélectionner un pays / indicatif",
    searchPlaceholder: "Rechercher un pays, code ou indicatif...",
    notFound: "Aucun pays trouvé"
  },
  es: {
    title: "Seleccionar país / prefijo",
    searchPlaceholder: "Buscar por país, código o prefijo...",
    notFound: "No se encontraron países"
  }
};

export default function CountrySelectorModal({
  isOpen,
  onClose,
  selectedCountry,
  onSelectCountry,
  lang,
}: CountrySelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const t = TEXTS[lang] || TEXTS.en;

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dialCode.includes(searchQuery) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#16181a] text-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <h3 className="text-lg font-medium tracking-tight">{t.title}</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                   type="text"
                   placeholder={t.searchPlaceholder}
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full rounded-lg bg-black/30 py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 border border-white/5 focus:border-[#00f6ac]/50 focus:outline-none transition-all"
                   autoFocus
                />
              </div>
            </div>

            {/* Country List */}
            <div className="max-h-64 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => {
                  const isSelected = country.code === selectedCountry.code;
                  return (
                    <button
                      key={country.code}
                      onClick={() => {
                        onSelectCountry(country);
                        onClose();
                      }}
                      className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-left text-sm transition-colors ${
                        isSelected
                          ? 'bg-[#00f6ac]/10 text-[#00f6ac]'
                          : 'hover:bg-white/5 text-gray-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl" role="img" aria-label={country.name}>
                          {country.flag}
                        </span>
                        <span className="font-medium">{country.name}</span>
                        <span className="text-xs text-gray-500 font-mono">{country.dialCode}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-[#00f6ac]" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-sm text-gray-500">
                  {t.notFound}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
