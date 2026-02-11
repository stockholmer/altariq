export type PrayerConvention = 'mwl' | 'isna' | 'egypt' | 'makkah' | 'karachi' | 'tehran' | 'jafari';
export type AsrMethod = 'shafii' | 'hanafi';
export type CrescentCriterion = 'umm_al_qura' | 'isna' | 'mabims' | 'yallop' | 'odeh' | 'pakistan' | 'turkey' | 'tabular';
export type Theme = 'light' | 'dark' | 'system';
export type Locale = 'en' | 'ar' | 'ur' | 'bn' | 'ms' | 'hi' | 'fa' | 'tr' | 'id';

export const RTL_LOCALES: Locale[] = ['ar', 'ur', 'fa'];

export interface LocationData {
  lat: number;
  lon: number;
  city: string;
  country: string;
  timezone: string;
}

export interface AppSettings {
  location: LocationData | null;
  convention: PrayerConvention;
  asrMethod: AsrMethod;
  criterion: CrescentCriterion;
  locale: Locale;
  theme: Theme;
}

export const DEFAULT_SETTINGS: AppSettings = {
  location: null,
  convention: 'mwl',
  asrMethod: 'shafii',
  criterion: 'umm_al_qura',
  locale: 'en',
  theme: 'system',
};

export const CONVENTION_LABELS: Record<PrayerConvention, string> = {
  mwl: 'Muslim World League',
  isna: 'ISNA (North America)',
  egypt: 'Egyptian General Authority',
  makkah: 'Umm al-Qura (Makkah)',
  karachi: 'University of Karachi',
  tehran: 'Institute of Geophysics (Tehran)',
  jafari: 'Shia Ithna-Ashari (Jafari)',
};

export const CRITERION_LABELS: Record<CrescentCriterion, string> = {
  umm_al_qura: 'Umm al-Qura (Saudi)',
  isna: 'ISNA (North America)',
  mabims: 'MABIMS (SE Asia)',
  yallop: 'Yallop',
  odeh: 'Odeh',
  pakistan: 'Pakistan',
  turkey: 'Turkey (Diyanet)',
  tabular: 'Tabular (arithmetic)',
};
