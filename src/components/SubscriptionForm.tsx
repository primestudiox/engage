import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageSquare, Lock, Loader2, Sparkles, CheckCircle, X } from 'lucide-react';
import { Country, SubscriptionFormData } from '../types';
import CountrySelectorModal from './CountrySelectorModal';
import { translations } from '../data/translations';
import { detectUserCountry, detectCountryFromPhoneNumber } from '../utils/geo';

// Pre-defined avatars from assets generated
const avatar1 = "/src/assets/images/founder_avatar_1780480032739.png";
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
    joinMastermind: true,
    joinNewsletter: true,
  });

  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SubscriptionFormData, string>>>({});
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

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
    const newErrors: Partial<Record<keyof SubscriptionFormData, string>> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmissionStatus('submitting');
    setTimeout(() => {
      setSubmissionStatus('success');
    }, 1800);
  };

  const getWhatsappLink = () => {
    const rawPhone = formData.phone.replace(/[^0-9]/g, '');
    const cleanDial = formData.country.dialCode.replace('+', '');
    const finalPhone = `${cleanDial}${rawPhone}`;
    let text = '';
    if (lang === 'fr') {
      text = encodeURIComponent(`Bonjour ! Je viens de m’inscrire à Staying Ahead. Veuillez m’ajouter au canal de la communauté IA.`);
    } else if (lang === 'es') {
      text = encodeURIComponent(`¡Hola! Me acabo de registrar en Staying Ahead. Por favor agrégame al canal de la comunidad de IA.`);
    } else {
      text = encodeURIComponent(`Hello! I just subscribed to Staying Ahead. Please add me to the AI Community group.`);
    }
    return `https://api.whatsapp.com/send?phone=${finalPhone}&text=${text}`;
  };

  return (
    <div id="registration-card" className="w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121315]/85 p-6 md:p-8 custom-glow relative">
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
              className="w-16 h-16 bg-[#84a836]/20 text-[#a2e043] rounded-full flex items-center justify-center mb-6 border border-[#84a836]/30"
            >
              <CheckCircle className="h-9 w-9" />
            </motion.div>

            <h3 className="text-3.5xl font-serif text-white mb-2 leading-tight tracking-tight">
              {t.form.success.title}
            </h3>
            <p className="text-[#a2e043] font-medium text-sm mb-6 flex items-center gap-1.5 justify-center">
              <Sparkles className="h-4 w-4 animate-pulse" /> {t.form.success.subtitle} ({formData.country.flag})
            </p>

            <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 mb-8 text-left space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">Subscriber</p>
                <p className="text-white font-semibold text-lg">{formData.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">{t.form.success.groupLabel}</p>
                  <p className="text-white font-medium text-sm font-mono mt-0.5">{formData.country.dialCode} {formData.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">{t.form.success.experienceLabel}</p>
                  <p className="text-white font-medium text-sm mt-0.5">
                    {t.form.experienceOptions.find(o => o.value === formData.experience)?.label || formData.experience}
                  </p>
                </div>
              </div>
              <div className="border-t border-white/[0.05] pt-3.5">
                <p className="text-xs text-gray-400 font-medium space-y-1">
                  {formData.joinMastermind && (
                    <span className="block text-[#a2e043] font-semibold">{t.form.success.mastermindGift}</span>
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
                  joinMastermind: true,
                  joinNewsletter: true,
                });
                setSubmissionStatus('idle');
              }}
              className="mt-5 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer tracking-wide hover:underline"
            >
              {t.form.success.buttonAnother}
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t.form.placeholderName}
                className={`w-full custom-input px-4 py-3.5 rounded-xl text-white placeholder-gray-500 text-sm focus:ring-1 focus:ring-[#84a836]/40 transition-all ${
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
                className={`w-full custom-input px-4 py-3.5 rounded-xl text-white placeholder-gray-500 text-sm focus:ring-1 focus:ring-[#84a836]/40 transition-all ${
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
                  {formData.country.name} ({t.form.detectedLabel})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCountryModalOpen(true)}
                className="text-xs text-[#a2e043] hover:text-[#b4ee59] hover:underline font-semibold transition-colors cursor-pointer"
              >
                {t.form.changeLabel}
              </button>
            </div>

            {/* Phone Entry */}
            <div>
              <div className="flex rounded-xl overflow-hidden bg-black/30 border border-white/5 focus-within:border-[#84a836]/40">
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
                {t.form.labelCoding}
              </label>
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => handleCodingSelect('yes')}
                  className="flex items-center gap-2.5 group cursor-pointer"
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    formData.knowsCoding === 'yes'
                      ? 'border-[#a2e043] bg-[#84a836]/10 shadow-[0_0_10px_rgba(162,224,67,0.1)]'
                      : 'border-white/15 bg-[#16181a]'
                  }`}>
                    {formData.knowsCoding === 'yes' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#a2e043]" />
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
                      ? 'border-[#a2e043] bg-[#84a836]/10 shadow-[0_0_10px_rgba(162,224,67,0.1)]'
                      : 'border-white/15 bg-[#16181a]'
                  }`}>
                    {formData.knowsCoding === 'no' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#a2e043]" />
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    formData.knowsCoding === 'no' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                  }`}>{t.form.optionCodingNo}</span>
                </button>
              </div>
              {errors.knowsCoding && (
                <p className="mt-2 text-xs text-red-500">{errors.knowsCoding}</p>
              )}
            </div>

            {/* Describe select */}
            <div>
              <div className="relative">
                <select
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full custom-input px-4 py-3.5 pr-10 rounded-xl text-sm appearance-none cursor-pointer transition-all ${
                    formData.description ? 'text-white' : 'text-gray-500'
                  } ${errors.description ? 'border-red-500/50' : ''}`}
                >
                  <option value="" disabled hidden>
                    {t.form.placeholderDescribe}
                  </option>
                  {t.form.describeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#121315]">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-4.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Experience select */}
            <div>
              <div className="relative">
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={`w-full custom-input px-4 py-3.5 pr-10 rounded-xl text-sm appearance-none cursor-pointer transition-all ${
                    formData.experience ? 'text-white' : 'text-gray-500'
                  } ${errors.experience ? 'border-red-500/50' : ''}`}
                >
                  <option value="" disabled hidden>
                    {t.form.placeholderExperience}
                  </option>
                  {t.form.experienceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#121315]">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-4.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.experience && (
                <p className="mt-1 text-xs text-red-500">{errors.experience}</p>
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
                    ? 'border-[#a2e043] bg-[#84a836]/20 text-[#a2e043]'
                    : 'border-white/15 bg-black/20 group-hover:border-white/30'
                }`}>
                  {formData.joinMastermind && (
                    <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-gray-300 leading-normal select-none">
                  {t.form.labelMastermind}
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
                    ? 'border-[#a2e043] bg-[#84a836]/20 text-[#a2e043]'
                    : 'border-white/15 bg-black/20 group-hover:border-white/30'
                }`}>
                  {formData.joinNewsletter && (
                    <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="text-xs text-gray-300 leading-normal select-none">
                  <p>{t.form.labelNewsletter}</p>
                  <p className="text-gray-500 text-[10.5px] mt-0.5 font-sans">{t.form.newsletterSubtitle}</p>
                </div>
              </button>
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
                className="w-full py-4 rounded-xl bg-[#84a836] hover:bg-[#96bd40] active:scale-[0.99] hover:scale-[1.01] text-[#121a05] font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-[#84a836]/20 transition-all cursor-pointer disabled:opacity-80"
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
          </form>
        )}
      </AnimatePresence>

      <CountrySelectorModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        selectedCountry={formData.country}
        onSelectCountry={handleCountrySelect}
      />
    </div>
  );
}
