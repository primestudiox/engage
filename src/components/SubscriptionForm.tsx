import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageSquare, Lock, Loader2, Sparkles, CheckCircle, X } from 'lucide-react';
import { Country, SubscriptionFormData } from '../types';
import CountrySelectorModal from './CountrySelectorModal';
import DiscountTimer from './DiscountTimer';
import { translations } from '../data/translations';
import { detectUserCountry, detectCountryFromPhoneNumber } from '../utils/geo';
import { supabase } from '../lib/supabase';

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  error?: string;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

function CustomDropdown({ value, onChange, options, placeholder, error, isOpen, onToggle }: CustomDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle(false);
      }
    }

    function handleScroll(event: Event) {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [isOpen, onToggle]);

  return (
    <div ref={dropdownRef} className={`relative w-full ${isOpen ? 'z-30' : 'z-10'}`}>
      <button
        type="button"
        onClick={() => onToggle(!isOpen)}
        className={`w-full text-left bg-[#16181a] border border-white/[0.08] px-4 py-3.5 rounded-xl text-sm transition-all flex items-center justify-between cursor-pointer focus:ring-1 focus:ring-[#00f6ac]/30 hover:border-white/15 ${
          selectedOption ? 'text-white' : 'text-gray-500'
        } ${error ? 'border-red-500/50' : ''}`}
      >
        <span className="truncate pr-2">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#00f6ac]' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="dropdown-options-list"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 4 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute left-0 right-0 z-40 max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-[#121315] py-2.5 shadow-2xl scrollbar-thin scrollbar-thumb-white/10 will-change-transform transform-gpu [backface-visibility:hidden]"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    onToggle(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#00f6ac]/10 text-[#00f6ac] font-semibold'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Pre-defined avatars from assets generated
const avatar1 = "https://scontent.fabj6-1.fna.fbcdn.net/v/t39.30808-6/605514303_122149163684953147_5820363259698051303_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1650&ctp=s2048x1650&_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeE0uIb8nC9dMtAyqMtmK_5euKDY95JgAdq4oNj3kmAB2iGmOghUNNbs6s5BPOWJg6Y2rjkdkBjarBQPSdBIztJH&_nc_ohc=Y_c6HxMPnIgQ7kNvwF-PSUz&_nc_oc=Adr8QHHbeYZB4HPn18Wde9PrCDBF87_U34OGxqXgMpPvQqAGo7h8R8x3OLu1LWaP8Np7RRCrfP9K2mDU-acALMu8&_nc_zt=23&_nc_ht=scontent.fabj6-1.fna&_nc_gid=jaMgEU8mxiNcZZoLxee60A&_nc_ss=7b2a8&oh=00_Af-bE8uzkJ2CHpd8NvZLs5q7bHl8Hz7vZAOz37yoRXjIRg&oe=6A2DC325";
const avatar2 = "/src/assets/images/female_avatar_1780480049317.png";
const avatar3 = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";
const avatar4 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop";

interface SubscriptionFormProps {
  lang: 'en' | 'fr' | 'es';
}

export default function SubscriptionForm({ lang }: SubscriptionFormProps) {
  const t = translations[lang];

  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: '',
    email: '',
    country: { name: 'Ivory Coast', code: 'CI', flag: '🇨🇮', dialCode: '+225' },
    phone: '',
    knowsCoding: null,
    description: '',
    experience: '',
    readyToInvest: '',
    joinMastermind: false,
    joinNewsletter: false,
  });

  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SubscriptionFormData | 'options', string>>>({});
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [activeDropdown, setActiveDropdown] = useState<'describe' | 'experience' | 'invest' | null>(null);

  useEffect(() => {
    async function autoDetect() {
      try {
        const detected = await detectUserCountry();
        setFormData((prev) => ({ ...prev, country: detected }));
      } catch (err) {
        console.error('Error auto-detecting country:', err);
      }
    }
    autoDetect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const detection = detectCountryFromPhoneNumber(value);
      if (detection) {
        setFormData((prev) => ({
          ...prev,
          country: detection.country,
          phone: detection.remainder,
        }));
      } else {
        setFormData((prev) => ({ ...prev, phone: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name as keyof SubscriptionFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (name: 'joinMastermind' | 'joinNewsletter') => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
    setErrors((prev) => ({ ...prev, options: undefined }));
  };

  const handleCountrySelect = (country: Country) => {
    setFormData((prev) => ({ ...prev, country }));
  };

  const handleCodingSelect = (val: 'yes' | 'no') => {
    setFormData((prev) => ({ ...prev, knowsCoding: val }));
    if (errors.knowsCoding) {
      setErrors((prev) => ({ ...prev, knowsCoding: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof SubscriptionFormData | 'options', string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.form.errors.name;
    }
    if (!formData.email.trim()) {
      newErrors.email = t.form.errors.email;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.form.errors.emailInvalid;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t.form.errors.phone;
    } else if (!/^\d{6,14}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      newErrors.phone = t.form.errors.phoneInvalid;
    }
    if (!formData.knowsCoding) {
      newErrors.knowsCoding = t.form.errors.coding;
    }
    if (!formData.description) {
      newErrors.description = t.form.errors.describe;
    }
    if (!formData.experience) {
      newErrors.experience = t.form.errors.experience;
    }
    if (!formData.readyToInvest) {
      newErrors.readyToInvest = t.form.errors.readyToInvest;
    }
    if (!formData.joinMastermind && !formData.joinNewsletter) {
      newErrors.options = t.form.errors.options;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmissionStatus('submitting');

    // Helper to generate UUID v4
    const generateUUIDv4 = (): string => {
      if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
        return (crypto as any).randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    // Save lead to local storage and Cloud Firestore
    const leadId = generateUUIDv4();
    const newLead = {
      id: leadId,
      name: formData.name,
      email: formData.email,
      country: {
        name: formData.country.name,
        code: formData.country.code,
        dialCode: formData.country.dialCode,
        flag: formData.country.flag
      },
      phone: formData.phone,
      description: formData.description,
      experience: formData.experience,
      readyToInvest: formData.readyToInvest,
      joinMastermind: formData.joinMastermind,
      timestamp: new Date().toISOString(),
      synced: false
    };

    // 1. Save locally
    try {
      const existing = localStorage.getItem('engage_leads');
      const leadsList = existing ? JSON.parse(existing) : [];
      leadsList.push(newLead);
      localStorage.setItem('engage_leads', JSON.stringify(leadsList));
      window.dispatchEvent(new Event('engage_leads_updated'));
    } catch (err) {
      console.error('Failed to save signup info locally:', err);
    }

    // 2. Save to Supabase
    ((formData: any) => {
      supabase.from('leads').insert([{
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        country_name: newLead.country.name,
        country_code: newLead.country.code,
        dial_code: newLead.country.dialCode,
        profile: formData.profile,
        blocage: formData.blocage,
        has_online_business: formData.has_online_business,
        ready_to_invest: formData.ready_to_invest,
        wants_whatsapp_plan: formData.wants_whatsapp_plan,
        wants_whatsapp_audit: formData.wants_whatsapp_audit,
      }]).then(({ error }) => {
        if (error) console.error('Failed to save to Supabase:', error);
      });
    })({
      ...formData,
      profile: formData.description,
      blocage: formData.experience,
      has_online_business: formData.knowsCoding,
      ready_to_invest: formData.readyToInvest,
      wants_whatsapp_plan: formData.joinMastermind,
      wants_whatsapp_audit: formData.joinNewsletter,
    });

    // 3. Send to Make.com Webhook if configured
    const webhookUrl = (import.meta as any).env.VITE_MAKE_WEBHOOK_URL || 'https://hook.eu2.make.com/23vjjmgjfmm9y90mnz2dgglqrsnvw3by';
    if (webhookUrl) {
      const payload = {
        id: newLead.id,
        name: newLead.name,
        email: newLead.email,
        phone: `${newLead.country.dialCode}${newLead.phone.replace(/[^0-9]/g, '')}`,
        country_name: newLead.country.name,
        country_code: newLead.country.code,
        dial_code: newLead.country.dialCode,
        profile: formData.description,
        blocage: formData.experience,
        has_online_business: formData.knowsCoding,
        ready_to_invest: formData.readyToInvest,
        wants_whatsapp_plan: formData.joinMastermind,
        wants_whatsapp_audit: formData.joinNewsletter,
        timestamp: newLead.timestamp
      };

      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      .then(response => {
        if (!response.ok) {
          console.warn('Webhook response not ok status:', response.status);
        }
      })
      .catch(err => {
        console.error('Failed to send lead to Make.com webhook:', err);
      });
    }

    setTimeout(() => {
      setSubmissionStatus('success');
    }, 1500);
  };

  const getWhatsappLink = () => {
    const rawPhone = formData.phone.replace(/[^0-9]/g, '');
    const cleanDial = formData.country.dialCode.replace('+', '');
    const finalPhone = `${cleanDial}${rawPhone}`;
    let text = '';
    if (lang === 'fr') {
      text = encodeURIComponent(`Bonjour ! Je viens de m’inscrire à Engage. Veuillez m’ajouter au canal de la communauté IA.`);
    } else if (lang === 'es') {
      text = encodeURIComponent(`¡Hola! Me acabo de registrar en Engage. Por favor agrégame al canal de la comunidad de IA.`);
    } else {
      text = encodeURIComponent(`Hello! I just subscribed to Engage. Please add me to the AI Community group.`);
    }
    return `https://api.whatsapp.com/send?phone=${finalPhone}&text=${text}`;
  };

  return (
    <div 
      id="registration-card" 
      className="notranslate w-full max-w-lg mx-auto overflow-visible rounded-3xl border border-white/[0.06] bg-[#121315] p-6 md:p-8 custom-glow relative"
      translate="no"
    >
      <AnimatePresence mode="wait">
        {submissionStatus === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-6 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-[#00f6ac]/20 text-[#00f6ac] rounded-full flex items-center justify-center mb-6 border border-[#00f6ac]/30"
            >
              <CheckCircle className="h-9 w-9" />
            </motion.div>

            <h3 className="text-3.5xl font-serif text-white mb-2 leading-tight tracking-tight">
              <span>{t.form.success.title}</span>
            </h3>
            <p className="text-[#00f6ac] font-medium text-sm mb-6 flex items-center gap-1.5 justify-center">
              <Sparkles className="h-4 w-4 animate-pulse" /> <span>{t.form.success.subtitle} ({formData.country.flag})</span>
            </p>

            <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 mb-8 text-left space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-mono"><span>{t.form.success.subscriberLabel}</span></p>
                <p className="text-white font-semibold text-lg"><span>{formData.name}</span></p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-mono"><span>{t.form.success.groupLabel}</span></p>
                  <p className="text-white font-medium text-sm font-mono mt-0.5"><span>{formData.country.dialCode} {formData.phone}</span></p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-mono"><span>{t.form.success.experienceLabel}</span></p>
                  <p className="text-white font-medium text-sm mt-0.5 animate-pulse text-[#00f6ac]">
                    <span>{t.form.experienceOptions.find(o => o.value === formData.experience)?.label || formData.experience}</span>
                  </p>
                </div>
              </div>
              <div className="border-t border-white/[0.05] pt-3 flex flex-col gap-1">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-mono"><span>{t.form.success.readyToInvestLabel}</span></p>
                <p className="text-white font-medium text-sm leading-relaxed">
                  <span>{t.form.readyToInvestOptions.find(o => o.value === formData.readyToInvest)?.label || formData.readyToInvest}</span>
                </p>
              </div>
              <div className="border-t border-white/[0.05] pt-3.5">
                <p className="text-xs text-gray-400 font-medium space-y-1">
                  {formData.joinMastermind && (
                    <span className="block text-[#00f6ac] font-semibold">{t.form.success.mastermindGift}</span>
                  )}
                  {formData.joinNewsletter && (
                    <span className="block text-gray-400 mt-1">{t.form.success.newsletterGift}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Launch Action */}
            <a
              href={getWhatsappLink()}
              target="_blank"
              referrerPolicy="no-referrer"
              className="w-full py-4.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba56] text-white font-semibold flex items-center justify-center gap-3 shadow-lg shadow-[#25d366]/10 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.50002 12C3.50002 7.30558 7.3056 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C10.3278 20.5 8.77127 20.0182 7.45798 19.1861C7.21357 19.0313 6.91408 18.9899 6.63684 19.0726L3.75769 19.9319L4.84173 17.3953C4.96986 17.0955 4.94379 16.7521 4.77187 16.4751C3.9657 15.176 3.50002 13.6439 3.50002 12ZM12 1.5C6.20103 1.5 1.50002 6.20101 1.50002 12C1.50002 13.8381 1.97316 15.5683 2.80465 17.0727L1.08047 21.107C0.928048 21.4637 0.99561 21.8763 1.25382 22.1657C1.51203 22.4552 1.91432 22.5692 2.28599 22.4582L6.78541 21.1155C8.32245 21.9965 10.1037 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5ZM14.2925 14.1824L12.9783 15.1081C12.3628 14.7575 11.6823 14.2681 10.9997 13.5855C10.2901 12.8759 9.76402 12.1433 9.37612 11.4713L10.2113 10.7624C10.5697 10.4582 10.6678 9.94533 10.447 9.53028L9.38284 7.53028C9.23954 7.26097 8.98116 7.0718 8.68115 7.01654C8.38113 6.96129 8.07231 7.046 7.84247 7.24659L7.52696 7.52195C6.76823 8.18414 6.3195 9.2723 6.69141 10.3741C7.07698 11.5163 7.89983 13.314 9.58552 14.9997C11.3991 16.8133 13.2413 17.5275 14.3186 17.8049C15.1866 18.0283 16.008 17.7288 16.5868 17.2572L17.1783 16.7752C17.4313 16.5691 17.5678 16.2524 17.544 15.9269C17.5201 15.6014 17.3389 15.308 17.0585 15.1409L15.3802 14.1409C15.0412 13.939 14.6152 13.9552 14.2925 14.1824Z"
                  fill="currentColor"
                />
              </svg>
              <span>{t.form.success.buttonOpenWa}</span>
            </a>

            <button
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  country: { name: 'Ivory Coast', code: 'CI', flag: '🇨🇮', dialCode: '+225' },
                  phone: '',
                  knowsCoding: null,
                  description: '',
                  experience: '',
                  readyToInvest: '',
                  joinMastermind: true,
                  joinNewsletter: true,
                });
                setActiveDropdown(null);
                setSubmissionStatus('idle');
              }}
              className="mt-5 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer tracking-wide hover:underline"
            >
              {t.form.success.buttonAnother}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="registration-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Name Input */}
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t.form.placeholderName}
                className={`w-full custom-input px-4 py-3.5 rounded-xl text-white placeholder-gray-500 text-sm focus:ring-1 focus:ring-[#00f6ac]/40 transition-all ${
                  errors.name ? 'border-red-500/50' : ''
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t.form.placeholderEmail}
                className={`w-full custom-input px-4 py-3.5 rounded-xl text-white placeholder-gray-500 text-sm focus:ring-1 focus:ring-[#00f6ac]/40 transition-all ${
                  errors.email ? 'border-red-500/50' : ''
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Country Selector Status Column */}
            <div className="flex items-center justify-between custom-input px-4 py-3.5 rounded-xl text-sm border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-base">{formData.country.flag}</span>
                <span className="text-gray-300 font-medium">
                  <span>{formData.country.name} ({t.form.detectedLabel})</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCountryModalOpen(true)}
                className="text-xs text-[#00f6ac] hover:text-[#2effc0] hover:underline font-semibold transition-colors cursor-pointer"
              >
                <span>{t.form.changeLabel}</span>
              </button>
            </div>

            {/* Phone Entry */}
            <div>
              <div className="flex rounded-xl overflow-hidden bg-black/30 border border-white/5 focus-within:border-[#00f6ac]/40">
                <button
                  type="button"
                  onClick={() => setIsCountryModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-3.5 bg-white/[0.02] border-r border-white/5 hover:bg-white/5 text-gray-300 font-semibold font-mono text-sm transition-colors cursor-pointer"
                >
                  <span>{formData.country.flag}</span>
                  <span>{formData.country.dialCode}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500 ml-0.5" />
                </button>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t.form.placeholderPhone}
                  className={`w-full bg-transparent px-4 py-3.5 text-white placeholder-gray-500 text-sm focus:outline-none ${
                    errors.phone ? 'border-red-500/50 focus:border-red-500/50' : ''
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Coding Selector */}
            <div className="bg-black/10 p-3.5 rounded-xl border border-white/[0.02]">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 font-mono">
                <span>{t.form.labelCoding}</span>
              </label>
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => handleCodingSelect('yes')}
                  className="flex items-center gap-2.5 group cursor-pointer"
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    formData.knowsCoding === 'yes'
                      ? 'border-[#00f6ac] bg-[#00f6ac]/10 shadow-[0_0_10px_rgba(0,246,172,0.1)]'
                      : 'border-white/15 bg-[#16181a]'
                  }`}>
                    {formData.knowsCoding === 'yes' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00f6ac]" />
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    formData.knowsCoding === 'yes' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                  }`}>{t.form.optionCodingYes}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCodingSelect('no')}
                  className="flex items-center gap-2.5 group cursor-pointer"
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    formData.knowsCoding === 'no'
                      ? 'border-[#00f6ac] bg-[#00f6ac]/10 shadow-[0_0_10px_rgba(0,246,172,0.1)]'
                      : 'border-white/15 bg-[#16181a]'
                  }`}>
                    {formData.knowsCoding === 'no' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00f6ac]" />
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    formData.knowsCoding === 'no' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                  }`}>{t.form.optionCodingNo}</span>
                </button>
              </div>
              {errors.knowsCoding && (
                <p className="mt-2 text-xs text-red-500">
                  <span>{errors.knowsCoding}</span>
                </p>
              )}
            </div>

            {/* Describe select */}
            <div>
              <CustomDropdown
                value={formData.description}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, description: val }));
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: undefined }));
                  }
                }}
                options={t.form.describeOptions}
                placeholder={t.form.placeholderDescribe}
                error={errors.description}
                isOpen={activeDropdown === 'describe'}
                onToggle={(open) => setActiveDropdown(open ? 'describe' : null)}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Experience select */}
            <div>
              <CustomDropdown
                value={formData.experience}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, experience: val }));
                  if (errors.experience) {
                    setErrors((prev) => ({ ...prev, experience: undefined }));
                  }
                }}
                options={t.form.experienceOptions}
                placeholder={t.form.placeholderExperience}
                error={errors.experience}
                isOpen={activeDropdown === 'experience'}
                onToggle={(open) => setActiveDropdown(open ? 'experience' : null)}
              />
              {errors.experience && (
                <p className="mt-1 text-xs text-red-500">{errors.experience}</p>
              )}
            </div>

            {/* Ready to invest select */}
            <div>
              <CustomDropdown
                value={formData.readyToInvest}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, readyToInvest: val }));
                  if (errors.readyToInvest) {
                    setErrors((prev) => ({ ...prev, readyToInvest: undefined }));
                  }
                }}
                options={t.form.readyToInvestOptions}
                placeholder={t.form.placeholderReadyToInvest}
                error={errors.readyToInvest}
                isOpen={activeDropdown === 'invest'}
                onToggle={(open) => setActiveDropdown(open ? 'invest' : null)}
              />
              {errors.readyToInvest && (
                <p className="mt-1 text-xs text-red-500">{errors.readyToInvest}</p>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-3.5 pt-1">
              {/* Mastermind Checkbox */}
              <button
                type="button"
                onClick={() => handleCheckboxChange('joinMastermind')}
                className="flex items-start gap-3.5 text-left group cursor-pointer"
              >
                <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                  formData.joinMastermind
                    ? 'border-[#00f6ac] bg-[#00f6ac]/20 text-[#00f6ac]'
                    : 'border-white/15 bg-black/20 group-hover:border-white/30'
                }`}>
                  {formData.joinMastermind && (
                    <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-gray-300 leading-normal select-none">
                  <span>{t.form.labelMastermind}</span>
                </p>
              </button>

              {/* Newsletter Checkbox */}
              <button
                type="button"
                onClick={() => handleCheckboxChange('joinNewsletter')}
                className="flex items-start gap-3.5 text-left group cursor-pointer"
              >
                <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                  formData.joinNewsletter
                    ? 'border-[#00f6ac] bg-[#00f6ac]/20 text-[#00f6ac]'
                    : 'border-white/15 bg-black/20 group-hover:border-white/30'
                }`}>
                  {formData.joinNewsletter && (
                    <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="text-xs text-gray-300 leading-normal select-none">
                  <p><span>{t.form.labelNewsletter}</span></p>
                  <p className="text-gray-500 text-[10.5px] mt-0.5 font-sans">
                    <span>{t.form.newsletterSubtitle}</span>
                  </p>
                </div>
              </button>
              
              {errors.options && (
                <p className="text-[11.5px] font-medium text-red-500 text-left pt-1 animate-pulse">{errors.options}</p>
              )}
            </div>

            {/* Subscriber stats (Grouped Overlapping Avatars inside form) */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="flex -space-x-2.5">
                {[avatar1, avatar2, avatar3, avatar4].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    referrerPolicy="no-referrer"
                    alt={`Subscriber ${i + 1}`}
                    className="w-7.5 h-7.5 rounded-full border border-[#111315] object-cover ring-1 ring-white/10 hover:scale-110 active:scale-95 transition-all duration-200"
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-gray-400 font-semibold">{t.form.joinedStats}</span>
            </div>

            {/* Bottom Button Action */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={submissionStatus === 'submitting'}
                className="w-full py-4 rounded-xl bg-[#00f6ac] hover:bg-[#2effc0] active:scale-[0.99] hover:scale-[1.01] text-[#020202] font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-[#00f6ac]/20 transition-all cursor-pointer disabled:opacity-80"
              >
                {submissionStatus === 'submitting' ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>{t.form.buttonCtaSubmitting}</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4.5 w-4.5 fill-current" />
                    <span>{t.form.buttonCtaIdle}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                <Lock className="h-3 w-3" />
                <span>{t.form.lockText}</span>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <CountrySelectorModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        selectedCountry={formData.country}
        onSelectCountry={handleCountrySelect}
        lang={lang}
      />
    </div>
  );
}
