/**
 * Islamic Festival Lens - Translations
 *
 * Translations for all festival rules across all supported locales.
 * All non-ASCII characters use Unicode escapes for Windows cp1252 safety.
 */

// ============================================================================
// Types
// ============================================================================

export type IslamicLocale = "en" | "ar" | "ur" | "ms" | "bn" | "hi" | "fa" | "tr" | "id";

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
// Bengali Translations
// ============================================================================

const BN: Record<string, FestivalTranslation> = {
  eid_al_fitr: {
    name: "\u0988\u09A6\u09C1\u09B2 \u09AB\u09BF\u09A4\u09B0",
  },
  eid_al_adha: {
    name: "\u0988\u09A6\u09C1\u09B2 \u0986\u09AF\u09B9\u09BE",
  },
  ramadan_start: {
    name: "\u09B0\u09AE\u099C\u09BE\u09A8\u09C7\u09B0 \u09B6\u09C1\u09B0\u09C1",
  },
  ramadan_end: {
    name: "\u09B0\u09AE\u099C\u09BE\u09A8\u09C7\u09B0 \u09B6\u09C7\u09B7 \u09A6\u09BF\u09A8",
  },
  ashura_eve: {
    name: "\u09A4\u09BE\u09B8\u09C1\u09AF\u09BC\u09BE",
  },
  ashura: {
    name: "\u0986\u09B6\u09C1\u09B0\u09BE",
  },
  day_of_arafah: {
    name: "\u0986\u09B0\u09BE\u09AB\u09BE\u09A4\u09C7\u09B0 \u09A6\u09BF\u09A8",
  },
  shawwal_fasting_start: {
    name: "\u09B6\u09BE\u0993\u09AF\u09BC\u09BE\u09B2\u09C7\u09B0 \u099B\u09AF\u09BC \u09B0\u09CB\u099C\u09BE",
  },
  laylat_al_qadr_27: {
    name: "\u09B2\u09BE\u0987\u09B2\u09BE\u09A4\u09C1\u09B2 \u0995\u09A6\u09B0",
  },
  shab_e_barat: {
    name: "\u09B6\u09AC\u09C7 \u09AC\u09B0\u09BE\u09A4",
  },
  laylat_al_raghaib: {
    name: "\u09B2\u09BE\u0987\u09B2\u09BE\u09A4\u09C1\u09B2 \u09B0\u09BE\u0997\u09BE\u0987\u09AC",
  },
  hijri_new_year: {
    name: "\u0987\u09B8\u09B2\u09BE\u09AE\u09BF\u0995 \u09A8\u09AC\u09AC\u09B0\u09CD\u09B7",
  },
  mawlid: {
    name: "\u0988\u09A6\u09C7 \u09AE\u09BF\u09B2\u09BE\u09A6\u09C1\u09A8\u09CD\u09A8\u09AC\u09C0",
  },
  isra_miraj: {
    name: "\u09B6\u09AC\u09C7 \u09AE\u09C7\u09B0\u09BE\u099C",
  },
  wafat_al_nabi: {
    name: "\u09A8\u09AC\u09C0\u09B0 \u0993\u09AB\u09BE\u09A4",
  },
  hajj_begins: {
    name: "\u09B9\u099C\u09CD\u099C\u09C7\u09B0 \u09B6\u09C1\u09B0\u09C1",
  },
  days_of_tashreeq_1: {
    name: "\u09A4\u09BE\u09B6\u09B0\u09C0\u0995\u09C7\u09B0 \u09A6\u09BF\u09A8 (1)",
  },
  days_of_tashreeq_2: {
    name: "\u09A4\u09BE\u09B6\u09B0\u09C0\u0995\u09C7\u09B0 \u09A6\u09BF\u09A8 (2)",
  },
  days_of_tashreeq_3: {
    name: "\u09A4\u09BE\u09B6\u09B0\u09C0\u0995\u09C7\u09B0 \u09A6\u09BF\u09A8 (3)",
  },
  rajab_start: {
    name: "\u09B0\u099C\u09AC\u09C7\u09B0 \u09B6\u09C1\u09B0\u09C1",
  },
  shaban_start: {
    name: "\u09B6\u09BE\u09AC\u09BE\u09A8\u09C7\u09B0 \u09B6\u09C1\u09B0\u09C1",
  },
  dhul_qidah_start: {
    name: "\u099C\u09BF\u09B2\u0995\u09A6\u09C7\u09B0 \u09B6\u09C1\u09B0\u09C1",
  },
  dhul_hijjah_start: {
    name: "\u099C\u09BF\u09B2\u09B9\u099C\u09CD\u099C\u09C7\u09B0 \u09B6\u09C1\u09B0\u09C1",
  },
  muharram_start: {
    name: "\u09AE\u09B9\u09B0\u09AE\u09C7\u09B0 \u09B6\u09C1\u09B0\u09C1",
  },
};

// ============================================================================
// Hindi Translations
// ============================================================================

const HI: Record<string, FestivalTranslation> = {
  eid_al_fitr: {
    name: "\u0908\u0926 \u0909\u0932 \u092B\u093F\u0924\u094D\u0930",
  },
  eid_al_adha: {
    name: "\u0908\u0926 \u0909\u0932 \u0905\u091C\u093C\u0939\u093E",
  },
  ramadan_start: {
    name: "\u0930\u092E\u091C\u093C\u093E\u0928 \u0915\u0940 \u0936\u0941\u0930\u0941\u0906\u0924",
  },
  ramadan_end: {
    name: "\u0930\u092E\u091C\u093C\u093E\u0928 \u0915\u093E \u0906\u0916\u093F\u0930\u0940 \u0926\u093F\u0928",
  },
  ashura_eve: {
    name: "\u0924\u093E\u0938\u0942\u0906",
  },
  ashura: {
    name: "\u0906\u0936\u0942\u0930\u093E",
  },
  day_of_arafah: {
    name: "\u0905\u0930\u092B\u093E\u0924 \u0915\u093E \u0926\u093F\u0928",
  },
  shawwal_fasting_start: {
    name: "\u0936\u0935\u094D\u0935\u093E\u0932 \u0915\u0947 \u091B\u0939 \u0930\u094B\u091C\u093C\u0947",
  },
  laylat_al_qadr_27: {
    name: "\u0936\u092C\u0947 \u0915\u093C\u0926\u094D\u0930",
  },
  shab_e_barat: {
    name: "\u0936\u092C\u0947 \u092C\u0930\u093E\u0924",
  },
  laylat_al_raghaib: {
    name: "\u0932\u0948\u0932\u0924\u0941\u0932 \u0930\u0917\u093C\u093E\u0907\u092C",
  },
  hijri_new_year: {
    name: "\u0907\u0938\u094D\u0932\u093E\u092E\u0940 \u0928\u092F\u093E \u0938\u093E\u0932",
  },
  mawlid: {
    name: "\u0908\u0926\u0947 \u092E\u0940\u0932\u093E\u0926\u0941\u0928\u094D\u0928\u092C\u0940",
  },
  isra_miraj: {
    name: "\u0936\u092C\u0947 \u092E\u0947\u0930\u093E\u091C",
  },
  wafat_al_nabi: {
    name: "\u0935\u092B\u093C\u093E\u0924 \u0909\u0928 \u0928\u092C\u0940",
  },
  hajj_begins: {
    name: "\u0939\u091C\u094D\u091C \u0915\u0940 \u0936\u0941\u0930\u0941\u0906\u0924",
  },
  days_of_tashreeq_1: {
    name: "\u0924\u0936\u0930\u0940\u0915\u093C \u0915\u0947 \u0926\u093F\u0928 (1)",
  },
  days_of_tashreeq_2: {
    name: "\u0924\u0936\u0930\u0940\u0915\u093C \u0915\u0947 \u0926\u093F\u0928 (2)",
  },
  days_of_tashreeq_3: {
    name: "\u0924\u0936\u0930\u0940\u0915\u093C \u0915\u0947 \u0926\u093F\u0928 (3)",
  },
  rajab_start: {
    name: "\u0930\u091C\u092C \u0915\u0940 \u0936\u0941\u0930\u0941\u0906\u0924",
  },
  shaban_start: {
    name: "\u0936\u093E\u092C\u093E\u0928 \u0915\u0940 \u0936\u0941\u0930\u0941\u0906\u0924",
  },
  dhul_qidah_start: {
    name: "\u091C\u093C\u0941\u0932 \u0915\u093C\u0926\u0939 \u0915\u0940 \u0936\u0941\u0930\u0941\u0906\u0924",
  },
  dhul_hijjah_start: {
    name: "\u091C\u093C\u0941\u0932 \u0939\u093F\u091C\u094D\u091C\u0939 \u0915\u0940 \u0936\u0941\u0930\u0941\u0906\u0924",
  },
  muharram_start: {
    name: "\u092E\u0941\u0939\u0930\u094D\u0930\u092E \u0915\u0940 \u0936\u0941\u0930\u0941\u0906\u0924",
  },
};

// ============================================================================
// Farsi (Persian) Translations
// ============================================================================

const FA: Record<string, FestivalTranslation> = {
  eid_al_fitr: {
    name: "\u0639\u06CC\u062F \u0641\u0637\u0631",
  },
  eid_al_adha: {
    name: "\u0639\u06CC\u062F \u0642\u0631\u0628\u0627\u0646",
  },
  ramadan_start: {
    name: "\u0622\u063A\u0627\u0632 \u0631\u0645\u0636\u0627\u0646",
  },
  ramadan_end: {
    name: "\u067E\u0627\u06CC\u0627\u0646 \u0631\u0645\u0636\u0627\u0646",
  },
  ashura_eve: {
    name: "\u062A\u0627\u0633\u0648\u0639\u0627",
  },
  ashura: {
    name: "\u0639\u0627\u0634\u0648\u0631\u0627",
  },
  day_of_arafah: {
    name: "\u0631\u0648\u0632 \u0639\u0631\u0641\u0647",
  },
  shawwal_fasting_start: {
    name: "\u0634\u0634 \u0631\u0648\u0632 \u0634\u0648\u0627\u0644",
  },
  laylat_al_qadr_27: {
    name: "\u0634\u0628 \u0642\u062F\u0631",
  },
  shab_e_barat: {
    name: "\u0646\u06CC\u0645\u0647 \u0634\u0639\u0628\u0627\u0646",
  },
  laylat_al_raghaib: {
    name: "\u0644\u06CC\u0644\u0629 \u0627\u0644\u0631\u063A\u0627\u0626\u0628",
  },
  hijri_new_year: {
    name: "\u0633\u0627\u0644 \u0646\u0648 \u0647\u062C\u0631\u06CC",
  },
  mawlid: {
    name: "\u0645\u06CC\u0644\u0627\u062F \u067E\u06CC\u0627\u0645\u0628\u0631",
  },
  isra_miraj: {
    name: "\u0627\u0633\u0631\u0627\u0621 \u0648 \u0645\u0639\u0631\u0627\u062C",
  },
  wafat_al_nabi: {
    name: "\u0631\u062D\u0644\u062A \u067E\u06CC\u0627\u0645\u0628\u0631",
  },
  hajj_begins: {
    name: "\u0622\u063A\u0627\u0632 \u062D\u062C",
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
  rajab_start: {
    name: "\u0622\u063A\u0627\u0632 \u0631\u062C\u0628",
  },
  shaban_start: {
    name: "\u0622\u063A\u0627\u0632 \u0634\u0639\u0628\u0627\u0646",
  },
  dhul_qidah_start: {
    name: "\u0622\u063A\u0627\u0632 \u0630\u0648\u0627\u0644\u0642\u0639\u062F\u0647",
  },
  dhul_hijjah_start: {
    name: "\u0622\u063A\u0627\u0632 \u0630\u0648\u0627\u0644\u062D\u062C\u0647",
  },
  muharram_start: {
    name: "\u0622\u063A\u0627\u0632 \u0645\u062D\u0631\u0645",
  },
};

// ============================================================================
// Turkish Translations
// ============================================================================

const TR: Record<string, FestivalTranslation> = {
  eid_al_fitr: {
    name: "Ramazan Bayram\u0131",
  },
  eid_al_adha: {
    name: "Kurban Bayram\u0131",
  },
  ramadan_start: {
    name: "Ramazan\u0131n Ba\u015Flang\u0131c\u0131",
  },
  ramadan_end: {
    name: "Ramazan\u0131n Son G\u00FCn\u00FC",
  },
  ashura_eve: {
    name: "Ta\u015Fua G\u00FCn\u00FC",
  },
  ashura: {
    name: "A\u015Fure G\u00FCn\u00FC",
  },
  day_of_arafah: {
    name: "Arife G\u00FCn\u00FC",
  },
  shawwal_fasting_start: {
    name: "\u015Eevval\u0131n Alt\u0131 G\u00FCn\u00FC",
  },
  laylat_al_qadr_27: {
    name: "Kadir Gecesi",
  },
  shab_e_barat: {
    name: "Berat Kandili",
  },
  laylat_al_raghaib: {
    name: "Regaib Kandili",
  },
  hijri_new_year: {
    name: "Hicri Y\u0131lba\u015F\u0131",
  },
  mawlid: {
    name: "Mevlid Kandili",
  },
  isra_miraj: {
    name: "Mira\u00E7 Kandili",
  },
  wafat_al_nabi: {
    name: "Hz. Muhammed'in Vefat\u0131",
  },
  hajj_begins: {
    name: "Hac Ba\u015Flang\u0131c\u0131",
  },
  days_of_tashreeq_1: {
    name: "Te\u015Frik G\u00FCnleri (1)",
  },
  days_of_tashreeq_2: {
    name: "Te\u015Frik G\u00FCnleri (2)",
  },
  days_of_tashreeq_3: {
    name: "Te\u015Frik G\u00FCnleri (3)",
  },
  rajab_start: {
    name: "Recep Ay\u0131 Ba\u015Flang\u0131c\u0131",
  },
  shaban_start: {
    name: "\u015Eaban Ay\u0131 Ba\u015Flang\u0131c\u0131",
  },
  dhul_qidah_start: {
    name: "Zilkade Ba\u015Flang\u0131c\u0131",
  },
  dhul_hijjah_start: {
    name: "Zilhicce Ba\u015Flang\u0131c\u0131",
  },
  muharram_start: {
    name: "Muharrem Ba\u015Flang\u0131c\u0131",
  },
};

// ============================================================================
// Indonesian Translations
// ============================================================================

const ID: Record<string, FestivalTranslation> = {
  eid_al_fitr: {
    name: "Idul Fitri",
  },
  eid_al_adha: {
    name: "Idul Adha",
  },
  ramadan_start: {
    name: "Awal Ramadan",
  },
  ramadan_end: {
    name: "Hari Terakhir Ramadan",
  },
  ashura_eve: {
    name: "Tasu'a",
  },
  ashura: {
    name: "Hari Asyura",
  },
  day_of_arafah: {
    name: "Hari Arafah",
  },
  shawwal_fasting_start: {
    name: "Puasa Enam Hari Syawal",
  },
  laylat_al_qadr_27: {
    name: "Lailatul Qadar",
  },
  shab_e_barat: {
    name: "Nisfu Sya'ban",
  },
  laylat_al_raghaib: {
    name: "Lailatur Raghaib",
  },
  hijri_new_year: {
    name: "Tahun Baru Islam",
  },
  mawlid: {
    name: "Maulid Nabi",
  },
  isra_miraj: {
    name: "Isra Mi'raj",
  },
  wafat_al_nabi: {
    name: "Wafat Nabi Muhammad",
  },
  hajj_begins: {
    name: "Awal Haji",
  },
  days_of_tashreeq_1: {
    name: "Hari Tasyrik (1)",
  },
  days_of_tashreeq_2: {
    name: "Hari Tasyrik (2)",
  },
  days_of_tashreeq_3: {
    name: "Hari Tasyrik (3)",
  },
  rajab_start: {
    name: "Awal Rajab",
  },
  shaban_start: {
    name: "Awal Sya'ban",
  },
  dhul_qidah_start: {
    name: "Awal Zulkaidah",
  },
  dhul_hijjah_start: {
    name: "Awal Zulhijjah",
  },
  muharram_start: {
    name: "Awal Muharram",
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
  bn: BN,
  hi: HI,
  fa: FA,
  tr: TR,
  id: ID,
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
  return ["en", "ar", "ur", "ms", "bn", "hi", "fa", "tr", "id"].includes(s);
}
