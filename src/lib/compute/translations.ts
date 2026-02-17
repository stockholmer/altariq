/**
 * Islamic Festival Lens - Translations
 *
 * Arabic, Urdu, and Malay translations for all festival rules.
 * All non-ASCII characters use Unicode escapes for Windows cp1252 safety.
 */

// ============================================================================
// Types
// ============================================================================

export type IslamicLocale = "en" | "ar" | "ur" | "ms";

interface FestivalTranslation {
  name: string;
  description?: string;
}

// ============================================================================
// Arabic Translations
// ============================================================================

const AR: Record<string, FestivalTranslation> = {
  eid_al_fitr: {
    name: "\u0639\u064A\u062F \u0627\u0644\u0641\u0637\u0631",
    description: "\u0639\u064A\u062F \u0625\u0641\u0637\u0627\u0631 \u0631\u0645\u0636\u0627\u0646",
  },
  eid_al_adha: {
    name: "\u0639\u064A\u062F \u0627\u0644\u0623\u0636\u062D\u0649",
    description: "\u0639\u064A\u062F \u0627\u0644\u0623\u0636\u062D\u064A\u0629",
  },
  ramadan_start: {
    name: "\u0628\u062F\u0627\u064A\u0629 \u0631\u0645\u0636\u0627\u0646",
  },
  ramadan_end: {
    name: "\u0622\u062E\u0631 \u0631\u0645\u0636\u0627\u0646",
  },
  ashura_eve: {
    name: "\u062A\u0627\u0633\u0648\u0639\u0627\u0621",
  },
  ashura: {
    name: "\u0639\u0627\u0634\u0648\u0631\u0627\u0621",
    description: "\u0627\u0644\u0639\u0627\u0634\u0631 \u0645\u0646 \u0645\u062D\u0631\u0645",
  },
  day_of_arafah: {
    name: "\u064A\u0648\u0645 \u0639\u0631\u0641\u0629",
  },
  shawwal_fasting_start: {
    name: "\u0633\u062A\u0629 \u0645\u0646 \u0634\u0648\u0627\u0644",
  },
  laylat_al_qadr_21: {
    name: "\u0644\u064A\u0644\u0629 \u0627\u0644\u0642\u062F\u0631 (21)",
  },
  laylat_al_qadr_23: {
    name: "\u0644\u064A\u0644\u0629 \u0627\u0644\u0642\u062F\u0631 (23)",
  },
  laylat_al_qadr_25: {
    name: "\u0644\u064A\u0644\u0629 \u0627\u0644\u0642\u062F\u0631 (25)",
  },
  laylat_al_qadr_27: {
    name: "\u0644\u064A\u0644\u0629 \u0627\u0644\u0642\u062F\u0631",
    description: "\u062E\u064A\u0631 \u0645\u0646 \u0623\u0644\u0641 \u0634\u0647\u0631",
  },
  laylat_al_qadr_29: {
    name: "\u0644\u064A\u0644\u0629 \u0627\u0644\u0642\u062F\u0631 (29)",
  },
  shab_e_barat: {
    name: "\u0644\u064A\u0644\u0629 \u0627\u0644\u0646\u0635\u0641 \u0645\u0646 \u0634\u0639\u0628\u0627\u0646",
  },
  laylat_al_raghaib: {
    name: "\u0644\u064A\u0644\u0629 \u0627\u0644\u0631\u063A\u0627\u0626\u0628",
  },
  hijri_new_year: {
    name: "\u0631\u0623\u0633 \u0627\u0644\u0633\u0646\u0629 \u0627\u0644\u0647\u062C\u0631\u064A\u0629",
  },
  mawlid: {
    name: "\u0627\u0644\u0645\u0648\u0644\u062F \u0627\u0644\u0646\u0628\u0648\u064A",
  },
  isra_miraj: {
    name: "\u0627\u0644\u0625\u0633\u0631\u0627\u0621 \u0648\u0627\u0644\u0645\u0639\u0631\u0627\u062C",
  },
  wafat_al_nabi: {
    name: "\u0648\u0641\u0627\u0629 \u0627\u0644\u0646\u0628\u064A",
  },
  hajj_begins: {
    name: "\u064A\u0648\u0645 \u0627\u0644\u062A\u0631\u0648\u064A\u0629",
  },
  days_of_tashreeq_1: {
    name: "\u0623\u064A\u0627\u0645 \u0627\u0644\u062A\u0634\u0631\u064A\u0642 (1)",
  },
  days_of_tashreeq_2: {
    name: "\u0623\u064A\u0627\u0645 \u0627\u0644\u062A\u0634\u0631\u064A\u0642 (2)",
  },
  days_of_tashreeq_3: {
    name: "\u0623\u064A\u0627\u0645 \u0627\u0644\u062A\u0634\u0631\u064A\u0642 (3)",
  },
  rajab_start: {
    name: "\u0628\u062F\u0627\u064A\u0629 \u0631\u062C\u0628",
  },
  shaban_start: {
    name: "\u0628\u062F\u0627\u064A\u0629 \u0634\u0639\u0628\u0627\u0646",
  },
  dhul_qidah_start: {
    name: "\u0628\u062F\u0627\u064A\u0629 \u0630\u0648 \u0627\u0644\u0642\u0639\u062F\u0629",
  },
  dhul_hijjah_start: {
    name: "\u0628\u062F\u0627\u064A\u0629 \u0630\u0648 \u0627\u0644\u062D\u062C\u0629",
  },
  muharram_start: {
    name: "\u0628\u062F\u0627\u064A\u0629 \u0645\u062D\u0631\u0645",
  },
};

// ============================================================================
// Urdu Translations
// ============================================================================

const UR: Record<string, FestivalTranslation> = {
  eid_al_fitr: {
    name: "\u0639\u06CC\u062F \u0627\u0644\u0641\u0637\u0631",
  },
  eid_al_adha: {
    name: "\u0639\u06CC\u062F \u0627\u0644\u0627\u0636\u062D\u06CC",
  },
  ramadan_start: {
    name: "\u0631\u0645\u0636\u0627\u0646 \u06A9\u06CC \u0634\u0631\u0648\u0639\u0627\u062A",
  },
  ramadan_end: {
    name: "\u0631\u0645\u0636\u0627\u0646 \u06A9\u0627 \u0622\u062E\u0631\u06CC \u062F\u0646",
  },
  ashura_eve: {
    name: "\u062A\u0627\u0633\u0648\u0639\u0627",
  },
  ashura: {
    name: "\u06CC\u0648\u0645 \u0639\u0627\u0634\u0648\u0631\u0627",
  },
  day_of_arafah: {
    name: "\u06CC\u0648\u0645 \u0639\u0631\u0641\u06C1",
  },
  shawwal_fasting_start: {
    name: "\u0634\u0648\u0627\u0644 \u06A9\u06D2 \u0686\u06BE \u0631\u0648\u0632\u06D2",
  },
  laylat_al_qadr_27: {
    name: "\u0634\u0628 \u0642\u062F\u0631",
  },
  shab_e_barat: {
    name: "\u0634\u0628 \u0628\u0631\u0627\u062A",
  },
  laylat_al_raghaib: {
    name: "\u0644\u06CC\u0644\u0629 \u0627\u0644\u0631\u063A\u0627\u0626\u0628",
  },
  hijri_new_year: {
    name: "\u06CC\u0648\u0645 \u06C1\u062C\u0631\u06CC",
  },
  mawlid: {
    name: "\u0639\u06CC\u062F \u0645\u06CC\u0644\u0627\u062F \u0627\u0644\u0646\u0628\u06CC",
  },
  isra_miraj: {
    name: "\u0634\u0628 \u0645\u0639\u0631\u0627\u062C",
  },
  wafat_al_nabi: {
    name: "\u0648\u0641\u0627\u062A \u0627\u0644\u0646\u0628\u06CC",
  },
  hajj_begins: {
    name: "\u062D\u062C \u06A9\u06CC \u0634\u0631\u0648\u0639\u0627\u062A",
  },
  days_of_tashreeq_1: {
    name: "\u0627\u06CC\u0627\u0645 \u062A\u0634\u0631\u06CC\u0642 (1)",
  },
  days_of_tashreeq_2: {
    name: "\u0627\u06CC\u0627\u0645 \u062A\u0634\u0631\u06CC\u0642 (2)",
  },
  days_of_tashreeq_3: {
    name: "\u0627\u06CC\u0627\u0645 \u062A\u0634\u0631\u06CC\u0642 (3)",
  },
};

// ============================================================================
// Malay Translations
// ============================================================================

const MS: Record<string, FestivalTranslation> = {
  eid_al_fitr: {
    name: "Hari Raya Aidilfitri",
  },
  eid_al_adha: {
    name: "Hari Raya Haji",
  },
  ramadan_start: {
    name: "Awal Ramadan",
  },
  ashura: {
    name: "Hari Asyura",
  },
  mawlid: {
    name: "Maulidur Rasul",
  },
  isra_miraj: {
    name: "Israk Mikraj",
  },
  hijri_new_year: {
    name: "Awal Muharram",
  },
  laylat_al_qadr_27: {
    name: "Nuzul al-Quran",
  },
  shab_e_barat: {
    name: "Nisfu Syaaban",
  },
};

// ============================================================================
// Lookup Map
// ============================================================================

const TRANSLATIONS: Record<IslamicLocale, Record<string, FestivalTranslation>> = {
  en: {},  // English is the default in the rule itself
  ar: AR,
  ur: UR,
  ms: MS,
};

// ============================================================================
// Public API
// ============================================================================

/**
 * Get a translated festival name (falls back to English from rule).
 */
export function getTranslatedFestivalName(
  festivalId: string,
  locale: IslamicLocale,
  fallbackName: string,
): string {
  if (locale === "en") return fallbackName;
  return TRANSLATIONS[locale]?.[festivalId]?.name ?? fallbackName;
}

/**
 * Get a translated festival description (falls back to English from rule).
 */
export function getTranslatedFestivalDescription(
  festivalId: string,
  locale: IslamicLocale,
  fallbackDesc: string,
): string {
  if (locale === "en") return fallbackDesc;
  return TRANSLATIONS[locale]?.[festivalId]?.description ?? fallbackDesc;
}

/**
 * Check if a locale is valid.
 */
export function isValidIslamicLocale(s: string): s is IslamicLocale {
  return s === "en" || s === "ar" || s === "ur" || s === "ms";
}
