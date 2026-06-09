export interface Country {
  name: string;
  code: string; // ISO e.g. "CI", "US", "IN"
  flag: string; // Emoji
  dialCode: string; // e.g. "+225"
}

export interface SubscriptionFormData {
  name: string;
  email: string;
  country: Country;
  phone: string;
  knowsCoding: 'yes' | 'no' | null;
  description: string;
  experience: string;
  readyToInvest: string;
  joinMastermind: boolean;
  joinNewsletter: boolean;
}

export interface TranslationSchema {
  nav: {
    logo: string;
    cta: string;
  };
  hero: {
    badge: string;
    titlePre: string;
    titlePost: string;
    rotatingWords: string[];
    sub: string;
  };
  founder: {
    name: string;
    role: string;
  };
  form: {
    placeholderName: string;
    placeholderEmail: string;
    detectedLabel: string;
    changeLabel: string;
    placeholderPhone: string;
    labelCoding: string;
    optionCodingYes: string;
    optionCodingNo: string;
    placeholderDescribe: string;
    describeOptions: { value: string; label: string }[];
    placeholderExperience: string;
    experienceOptions: { value: string; label: string }[];
    placeholderReadyToInvest: string;
    readyToInvestOptions: { value: string; label: string }[];
    labelMastermind: string;
    labelNewsletter: string;
    newsletterSubtitle: string;
    joinedStats: string;
    buttonCtaIdle: string;
    buttonCtaSubmitting: string;
    lockText: string;
    errors: {
      name: string;
      email: string;
      emailInvalid: string;
      phone: string;
      phoneInvalid: string;
      coding: string;
      describe: string;
      experience: string;
      readyToInvest: string;
    };
    success: {
      title: string;
      subtitle: string;
      groupLabel: string;
      experienceLabel: string;
      readyToInvestLabel: string;
      mastermindGift: string;
      newsletterGift: string;
      buttonOpenWa: string;
      buttonAnother: string;
    };
  };
  whatYouGet: {
    title: string;
    sub: string;
    cards: {
      title: string;
      desc: string;
    }[];
  };
  faq: {
    title: string;
    sub: string;
    items: {
      q: string;
      a: string;
    }[];
  };
  footer: {
    respectPrivacy: string;
    copyright: string;
    privacyPolicy: string;
    termsOfUse: string;
  };
}
