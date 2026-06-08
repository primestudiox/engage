import { Country } from '../types';
import { countries } from '../data/countries';

// ISO to Dial Code and Name mapping for common countries not in standard list
const isoToDialCodeAndName: Record<string, { name: string; dialCode: string }> = {
  US: { name: 'United States', dialCode: '+1' },
  CA: { name: 'Canada', dialCode: '+1' },
  GB: { name: 'United Kingdom', dialCode: '+44' },
  FR: { name: 'France', dialCode: '+33' },
  DE: { name: 'Germany', dialCode: '+49' },
  IN: { name: 'India', dialCode: '+91' },
  CI: { name: 'Ivory Coast', dialCode: '+225' },
  AE: { name: 'United Arab Emirates', dialCode: '+971' },
  ZA: { name: 'South Africa', dialCode: '+27' },
  BR: { name: 'Brazil', dialCode: '+55' },
  NG: { name: 'Nigeria', dialCode: '+234' },
  KE: { name: 'Kenya', dialCode: '+254' },
  SG: { name: 'Singapore', dialCode: '+65' },
  AU: { name: 'Australia', dialCode: '+61' },
  GH: { name: 'Ghana', dialCode: '+233' },
  MA: { name: 'Morocco', dialCode: '+212' },
  EG: { name: 'Egypt', dialCode: '+20' },
  ES: { name: 'Spain', dialCode: '+34' },
  IT: { name: 'Italy', dialCode: '+39' },
  SN: { name: 'Senegal', dialCode: '+221' },
  AR: { name: 'Argentina', dialCode: '+54' },
  MX: { name: 'Mexico', dialCode: '+52' },
  SA: { name: 'Saudi Arabia', dialCode: '+966' },
  MY: { name: 'Malaysia', dialCode: '+60' },
  NL: { name: 'Netherlands', dialCode: '+31' },
  BE: { name: 'Belgium', dialCode: '+32' },
  CH: { name: 'Switzerland', dialCode: '+41' },
  IE: { name: 'Ireland', dialCode: '+353' },
  NZ: { name: 'New Zealand', dialCode: '+64' },
  PT: { name: 'Portugal', dialCode: '+351' },
  SE: { name: 'Sweden', dialCode: '+46' },
  NO: { name: 'Norway', dialCode: '+47' },
  DK: { name: 'Denmark', dialCode: '+45' },
  FI: { name: 'Finland', dialCode: '+358' },
  PL: { name: 'Poland', dialCode: '+48' },
  AT: { name: 'Austria', dialCode: '+43' },
  CN: { name: 'China', dialCode: '+86' },
  HK: { name: 'Hong Kong', dialCode: '+852' },
  JP: { name: 'Japan', dialCode: '+81' },
  KR: { name: 'South Korea', dialCode: '+82' },
  RU: { name: 'Russia', dialCode: '+7' },
  TR: { name: 'Turkey', dialCode: '+90' },
  IL: { name: 'Israel', dialCode: '+972' },
  CO: { name: 'Colombia', dialCode: '+57' },
  CL: { name: 'Chile', dialCode: '+56' },
  PE: { name: 'Peru', dialCode: '+51' },
  VE: { name: 'Venezuela', dialCode: '+58' },
  EC: { name: 'Ecuador', dialCode: '+593' },
  CR: { name: 'Costa Rica', dialCode: '+506' },
  PA: { name: 'Panama', dialCode: '+507' },
  UY: { name: 'Uruguay', dialCode: '+598' },
  PH: { name: 'Philippines', dialCode: '+63' },
  ID: { name: 'Indonesia', dialCode: '+62' },
  TH: { name: 'Thailand', dialCode: '+66' },
  VN: { name: 'Vietnam', dialCode: '+84' },
  PK: { name: 'Pakistan', dialCode: '+92' },
  BD: { name: 'Bangladesh', dialCode: '+880' },
  LK: { name: 'Sri Lanka', dialCode: '+94' },
  UA: { name: 'Ukraine', dialCode: '+380' },
  RO: { name: 'Romania', dialCode: '+40' },
  CZ: { name: 'Czech Republic', dialCode: '+420' },
  HU: { name: 'Hungary', dialCode: '+36' },
  GR: { name: 'Greece', dialCode: '+30' },
  QA: { name: 'Qatar', dialCode: '+974' },
  KW: { name: 'Kuwait', dialCode: '+965' },
  OM: { name: 'Oman', dialCode: '+968' },
};

// Programmatic conversion of country code to emoji flag
export function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🏳️';
  }
}

// Convert ISO code to Country object
export function getCountryByCode(code: string): Country | null {
  const upperCode = code.toUpperCase();
  // 1. Check in our existing country dataset
  const existing = countries.find((c) => c.code === upperCode);
  if (existing) return existing;

  // 2. Check in our expanded dictionary
  const extra = isoToDialCodeAndName[upperCode];
  if (extra) {
    return {
      name: extra.name,
      code: upperCode,
      flag: getFlagEmoji(upperCode),
      dialCode: extra.dialCode,
    };
  }

  return null;
}

// Timezone to Country Code mapping fallback
const tzToCountryCode: Record<string, string> = {
  'Africa/Abidjan': 'CI',
  'Africa/Accra': 'GH',
  'Africa/Cairo': 'EG',
  'Africa/Casablanca': 'MA',
  'Africa/Dakar': 'SN',
  'Africa/Johannesburg': 'ZA',
  'Africa/Lagos': 'NG',
  'Africa/Nairobi': 'KE',
  'America/Argentina/Buenos_Aires': 'AR',
  'America/Bogota': 'CO',
  'America/Caracas': 'VE',
  'America/Costa_Rica': 'CR',
  'America/Guayaquil': 'EC',
  'America/Mexico_City': 'MX',
  'America/Montevideo': 'UY',
  'America/Panama': 'PA',
  'America/Santiago': 'CL',
  'America/Sao_Paulo': 'BR',
  'America/Toronto': 'CA',
  'Asia/Bangkok': 'TH',
  'Asia/Dhaka': 'BD',
  'Asia/Dubai': 'AE',
  'Asia/Hong_Kong': 'HK',
  'Asia/Jakarta': 'ID',
  'Asia/Jerusalem': 'IL',
  'Asia/Kolkata': 'IN',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Manila': 'PH',
  'Asia/Riyadh': 'SA',
  'Asia/Seoul': 'KR',
  'Asia/Singapore': 'SG',
  'Asia/Tokyo': 'JP',
  'Australia/Sydney': 'AU',
  'Europe/Amsterdam': 'NL',
  'Europe/Athens': 'GR',
  'Europe/Berlin': 'DE',
  'Europe/Brussels': 'BE',
  'Europe/Copenhagen': 'DK',
  'Europe/Dublin': 'IE',
  'Europe/Helsinki': 'FI',
  'Europe/Kiev': 'UA',
  'Europe/London': 'GB',
  'Europe/Madrid': 'ES',
  'Europe/Oslo': 'NO',
  'Europe/Paris': 'FR',
  'Europe/Prague': 'CZ',
  'Europe/Rome': 'IT',
  'Europe/Stockholm': 'SE',
  'Europe/Vienna': 'AT',
  'Europe/Warsaw': 'PL',
  'Europe/Zurich': 'CH',
  'Pacific/Auckland': 'NZ',
};

// Strategy-based auto-detection of country of origin
export async function detectUserCountry(): Promise<Country> {
  // Strategy 1: Geolocation IP Fetching (Real network check APIs with CORS headers)
  try {
    const res = await fetch('https://freeipapi.com/api/json');
    if (res.ok) {
      const data = await res.json();
      if (data && data.countryCode) {
        const detected = getCountryByCode(data.countryCode);
        if (detected) return detected;
      }
    }
  } catch (err) {
    console.warn('Geolocation API 1 failed, trying fallback API...', err);
  }

  // Backup Geolocation IP Fetch API
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.country_code) {
        const detected = getCountryByCode(data.country_code);
        if (detected) return detected;
      }
    }
  } catch (err) {
    console.warn('Geolocation API 2 failed, using local fallbacks...', err);
  }

  // Strategy 2: Fallback to timezone heuristics
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      const code = tzToCountryCode[tz];
      if (code) {
        const detected = getCountryByCode(code);
        if (detected) return detected;
      }
      // Guess from slash parts of timezone, e.g., "Europe/Paris"
      const parts = tz.split('/');
      if (parts.length > 1) {
        const city = parts[1].replace(/_/g, ' ');
        // Search if any country name matches or timezone mappings
        const matches = Object.entries(tzToCountryCode).find(([k]) => k.includes(parts[1]));
        if (matches) {
          const detected = getCountryByCode(matches[1]);
          if (detected) return detected;
        }
      }
    }
  } catch (err) {
    console.warn('Timezone detection failed', err);
  }

  // Strategy 3: Fallback based on browser language locale code
  try {
    const lang = navigator.language || (navigator.languages && navigator.languages[0]);
    if (lang) {
      const parts = lang.split('-');
      if (parts.length > 1) {
        const detected = getCountryByCode(parts[1]);
        if (detected) return detected;
      }
    }
  } catch (err) {
    console.warn('Navigator locale detection failed', err);
  }

  // Solid fallback: DEFAULT representing Côte d'Ivoire (or US if desired, Ivory Coast is the project default)
  return { name: 'Ivory Coast', code: 'CI', flag: '🇨🇮', dialCode: '+225' };
}

// Detect country code and parse phoneNumber dynamically as typed
export function detectCountryFromPhoneNumber(typedValue: string): { country: Country; remainder: string } | null {
  let val = typedValue.trim();
  if (val.startsWith('00')) {
    val = '+' + val.slice(2);
  }

  const hasPlus = val.startsWith('+');
  const cleanedDigits = val.replace(/[^0-9]/g, '');
  const searchVal = hasPlus ? '+' + cleanedDigits : cleanedDigits;

  // We check for all supported countries: our custom small list AND the extended lookup list
  const allKnownCountries: Country[] = [
    ...countries,
    ...Object.entries(isoToDialCodeAndName).map(([code, item]) => ({
      name: item.name,
      code,
      flag: getFlagEmoji(code),
      dialCode: item.dialCode,
    })),
  ];

  // De-duplicate items based on ISO code
  const uniqueKnownCountries = Array.from(new Map(allKnownCountries.map((c) => [c.code, c])).values());

  // Sort countries by dialCode length descending to ensure longest matches match first (avoid matching +1 for +1246 etc.)
  const sortedCountries = [...uniqueKnownCountries].sort((a, b) => b.dialCode.length - a.dialCode.length);

  if (hasPlus) {
    for (const c of sortedCountries) {
      const cleanDialCode = c.dialCode.replace(/[\s-()]/g, '');
      if (searchVal.startsWith(cleanDialCode)) {
        const remainder = cleanedDigits.slice(cleanDialCode.replace('+', '').length);
        return { country: c, remainder };
      }
    }
  } else {
    // No leading plus: check if start of typed digits matches dial code
    for (const c of sortedCountries) {
      const dialDigits = c.dialCode.replace('+', '').replace(/[\s-()]/g, '');
      if (searchVal.startsWith(dialDigits)) {
        // If the matching dialDigits is longer than 0 and the typed input is longer to avoid premature match
        if (searchVal.length > dialDigits.length) {
          const remainder = searchVal.slice(dialDigits.length);
          return { country: c, remainder };
        }
      }
    }
  }

  return null;
}
