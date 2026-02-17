/**
 * Islamic Festival Rules Engine
 *
 * ~30 festival rules with O(1) indexed lookup by Hijri month-day.
 * Follows the festival-lens pattern but simplified: Islamic festivals
 * map to fixed Hijri dates (no kala-window or tithi-overlap complexity).
 *
 * Multi-day events (Eid al-Adha, Days of Tashreeq) are indexed for each
 * day they span so a single lookup returns all matches.
 */

// ============================================================================
// Types
// ============================================================================

export type FestivalImportance = "major" | "significant" | "observance";

export type FestivalCategory =
  | "eid"
  | "fasting"
  | "hajj"
  | "remembrance"
  | "night_worship"
  | "sacred_month";

export type ObservanceType = "day" | "night" | "both";

export interface IslamicFestivalRule {
  /** Unique identifier, e.g. "ramadan_start" */
  id: string;
  /** English display name */
  name: string;
  /** Hijri month (1-12) */
  hijri_month: number;
  /** Hijri day (1-30) */
  hijri_day: number;
  /** How many Gregorian days the event spans */
  duration_days: number;
  /** Significance level */
  importance: FestivalImportance;
  /** Thematic categories */
  categories: FestivalCategory[];
  /** Whether observance is daytime, nighttime (starts previous evening), or both */
  observance_type: ObservanceType;
  /** Brief English description */
  description: string;
  /** Brief tradition/practice note */
  traditions?: string;
}

export interface IslamicFestivalMatch {
  /** The rule that matched */
  rule: IslamicFestivalRule;
  /** For multi-day events, which day this is (1-based) */
  day_of_event: number;
  /** Hijri year in which this occurrence falls */
  hijri_year: number;
}

// ============================================================================
// Festival Rules (~30)
// ============================================================================

export const ISLAMIC_FESTIVAL_RULES: IslamicFestivalRule[] = [
  // -- EID --
  {
    id: "eid_al_fitr",
    name: "Eid al-Fitr",
    hijri_month: 10,
    hijri_day: 1,
    duration_days: 3,
    importance: "major",
    categories: ["eid"],
    observance_type: "day",
    description: "Festival of Breaking the Fast. Marks the end of Ramadan.",
    traditions: "Eid prayer, Zakat al-Fitr, family gatherings, new clothes, feasting.",
  },
  {
    id: "eid_al_adha",
    name: "Eid al-Adha",
    hijri_month: 12,
    hijri_day: 10,
    duration_days: 3,
    importance: "major",
    categories: ["eid", "hajj"],
    observance_type: "day",
    description: "Festival of Sacrifice. Commemorates Ibrahim's willingness to sacrifice his son.",
    traditions: "Eid prayer, Qurbani (animal sacrifice), distributing meat to the poor.",
  },

  // -- FASTING --
  {
    id: "ramadan_start",
    name: "Start of Ramadan",
    hijri_month: 9,
    hijri_day: 1,
    duration_days: 1,
    importance: "major",
    categories: ["fasting"],
    observance_type: "both",
    description: "First day of the month of fasting.",
    traditions: "Pre-dawn meal (Suhoor), fasting from dawn to sunset, Taraweeh prayers.",
  },
  {
    id: "ramadan_end",
    name: "Last Day of Ramadan",
    hijri_month: 9,
    hijri_day: 29,
    duration_days: 1,
    importance: "significant",
    categories: ["fasting"],
    observance_type: "day",
    description: "Last possible day of Ramadan (29th or 30th depending on moon sighting).",
  },
  {
    id: "ashura_eve",
    name: "9th Muharram (Tasu'a)",
    hijri_month: 1,
    hijri_day: 9,
    duration_days: 1,
    importance: "significant",
    categories: ["fasting", "remembrance"],
    observance_type: "day",
    description: "Day before Ashura. Recommended fasting day.",
    traditions: "Voluntary fasting, paired with 10th Muharram.",
  },
  {
    id: "ashura",
    name: "Day of Ashura",
    hijri_month: 1,
    hijri_day: 10,
    duration_days: 1,
    importance: "major",
    categories: ["fasting", "remembrance"],
    observance_type: "day",
    description: "10th Muharram. Day of fasting and remembrance.",
    traditions: "Voluntary fasting (Sunni), mourning of Hussain (Shia), charity.",
  },
  {
    id: "day_of_arafah",
    name: "Day of Arafah",
    hijri_month: 12,
    hijri_day: 9,
    duration_days: 1,
    importance: "major",
    categories: ["fasting", "hajj"],
    observance_type: "day",
    description: "Day of standing at Arafah. Fasting recommended for non-pilgrims.",
    traditions: "Fasting (non-pilgrims), du'a, Hajj pilgrims stand at Arafah.",
  },
  {
    id: "shawwal_fasting_start",
    name: "Six Days of Shawwal (Start)",
    hijri_month: 10,
    hijri_day: 4,
    duration_days: 1,
    importance: "observance",
    categories: ["fasting"],
    observance_type: "day",
    description: "Start of the recommended six days of voluntary fasting in Shawwal.",
    traditions: "Fasting six days after Eid al-Fitr for reward of fasting the whole year.",
  },

  // -- NIGHT WORSHIP --
  {
    id: "laylat_al_qadr_21",
    name: "Laylat al-Qadr (21st)",
    hijri_month: 9,
    hijri_day: 21,
    duration_days: 1,
    importance: "observance",
    categories: ["night_worship"],
    observance_type: "night",
    description: "Night of Power candidate (odd night of last 10 days of Ramadan).",
  },
  {
    id: "laylat_al_qadr_23",
    name: "Laylat al-Qadr (23rd)",
    hijri_month: 9,
    hijri_day: 23,
    duration_days: 1,
    importance: "observance",
    categories: ["night_worship"],
    observance_type: "night",
    description: "Night of Power candidate (odd night of last 10 days of Ramadan).",
  },
  {
    id: "laylat_al_qadr_25",
    name: "Laylat al-Qadr (25th)",
    hijri_month: 9,
    hijri_day: 25,
    duration_days: 1,
    importance: "observance",
    categories: ["night_worship"],
    observance_type: "night",
    description: "Night of Power candidate (odd night of last 10 days of Ramadan).",
  },
  {
    id: "laylat_al_qadr_27",
    name: "Laylat al-Qadr (27th)",
    hijri_month: 9,
    hijri_day: 27,
    duration_days: 1,
    importance: "major",
    categories: ["night_worship"],
    observance_type: "night",
    description: "Night of Power (most widely observed). Better than a thousand months.",
    traditions: "Night prayer, Quran recitation, I'tikaf, du'a.",
  },
  {
    id: "laylat_al_qadr_29",
    name: "Laylat al-Qadr (29th)",
    hijri_month: 9,
    hijri_day: 29,
    duration_days: 1,
    importance: "observance",
    categories: ["night_worship"],
    observance_type: "night",
    description: "Night of Power candidate (odd night of last 10 days of Ramadan).",
  },
  {
    id: "shab_e_barat",
    name: "Shab-e-Barat",
    hijri_month: 8,
    hijri_day: 15,
    duration_days: 1,
    importance: "significant",
    categories: ["night_worship"],
    observance_type: "night",
    description: "Night of Fortune / Mid-Sha'ban. Night of forgiveness and prayer.",
    traditions: "Night prayer, visiting graves, asking forgiveness.",
  },
  {
    id: "laylat_al_raghaib",
    name: "Laylat al-Raghaib",
    hijri_month: 7,
    hijri_day: 1,
    duration_days: 1,
    importance: "observance",
    categories: ["night_worship"],
    observance_type: "night",
    description: "Night of Wishes. First Friday night of Rajab (approximated as 1 Rajab).",
  },

  // -- REMEMBRANCE --
  {
    id: "hijri_new_year",
    name: "Islamic New Year",
    hijri_month: 1,
    hijri_day: 1,
    duration_days: 1,
    importance: "major",
    categories: ["remembrance"],
    observance_type: "day",
    description: "First day of Muharram. Start of the Islamic calendar year.",
    traditions: "Reflection, recounting the Hijrah of the Prophet.",
  },
  {
    id: "mawlid",
    name: "Mawlid al-Nabi",
    hijri_month: 3,
    hijri_day: 12,
    duration_days: 1,
    importance: "major",
    categories: ["remembrance"],
    observance_type: "both",
    description: "Birthday of Prophet Muhammad (PBUH). 12th Rabi al-Awwal.",
    traditions: "Recitation of the Seerah, nasheed, community gatherings, charity.",
  },
  {
    id: "isra_miraj",
    name: "Isra and Mi'raj",
    hijri_month: 7,
    hijri_day: 27,
    duration_days: 1,
    importance: "major",
    categories: ["remembrance", "night_worship"],
    observance_type: "night",
    description: "Night Journey and Ascension of the Prophet. 27th Rajab.",
    traditions: "Night prayer, recounting the journey, reflection on the five daily prayers.",
  },
  {
    id: "wafat_al_nabi",
    name: "Wafat al-Nabi",
    hijri_month: 3,
    hijri_day: 17,
    duration_days: 1,
    importance: "significant",
    categories: ["remembrance"],
    observance_type: "day",
    description: "Passing of Prophet Muhammad (PBUH). 17th Rabi al-Awwal (Shia date: 28th Safar).",
  },

  // -- HAJJ --
  {
    id: "hajj_begins",
    name: "Hajj Begins",
    hijri_month: 12,
    hijri_day: 8,
    duration_days: 1,
    importance: "significant",
    categories: ["hajj"],
    observance_type: "day",
    description: "Day of Tarwiyah. Pilgrims proceed to Mina. 8th Dhul Hijjah.",
  },
  {
    id: "days_of_tashreeq_1",
    name: "Days of Tashreeq (Day 1)",
    hijri_month: 12,
    hijri_day: 11,
    duration_days: 1,
    importance: "significant",
    categories: ["hajj"],
    observance_type: "day",
    description: "11th Dhul Hijjah. Pilgrims stone the Jamarat. Fasting prohibited.",
    traditions: "Stoning of Jamarat, Takbeer after prayers.",
  },
  {
    id: "days_of_tashreeq_2",
    name: "Days of Tashreeq (Day 2)",
    hijri_month: 12,
    hijri_day: 12,
    duration_days: 1,
    importance: "significant",
    categories: ["hajj"],
    observance_type: "day",
    description: "12th Dhul Hijjah. Second day of Tashreeq. Fasting prohibited.",
    traditions: "Stoning of Jamarat, some pilgrims depart Mina.",
  },
  {
    id: "days_of_tashreeq_3",
    name: "Days of Tashreeq (Day 3)",
    hijri_month: 12,
    hijri_day: 13,
    duration_days: 1,
    importance: "significant",
    categories: ["hajj"],
    observance_type: "day",
    description: "13th Dhul Hijjah. Last day of Tashreeq. Fasting prohibited.",
    traditions: "Final stoning of Jamarat, pilgrims depart Mina.",
  },

  // -- SACRED MONTHS --
  {
    id: "rajab_start",
    name: "Start of Rajab",
    hijri_month: 7,
    hijri_day: 1,
    duration_days: 1,
    importance: "observance",
    categories: ["sacred_month"],
    observance_type: "day",
    description: "Beginning of the sacred month of Rajab.",
    traditions: "Increased worship, voluntary fasting.",
  },
  {
    id: "shaban_start",
    name: "Start of Sha'ban",
    hijri_month: 8,
    hijri_day: 1,
    duration_days: 1,
    importance: "observance",
    categories: ["sacred_month"],
    observance_type: "day",
    description: "Beginning of Sha'ban, month before Ramadan.",
    traditions: "Increased fasting, preparation for Ramadan.",
  },
  {
    id: "dhul_qidah_start",
    name: "Start of Dhul Qi'dah",
    hijri_month: 11,
    hijri_day: 1,
    duration_days: 1,
    importance: "observance",
    categories: ["sacred_month"],
    observance_type: "day",
    description: "Beginning of the sacred month of Dhul Qi'dah.",
  },
  {
    id: "dhul_hijjah_start",
    name: "Start of Dhul Hijjah",
    hijri_month: 12,
    hijri_day: 1,
    duration_days: 1,
    importance: "observance",
    categories: ["sacred_month"],
    observance_type: "day",
    description: "Beginning of the month of Hajj pilgrimage.",
    traditions: "First 10 days are most virtuous; recommended fasting on days 1-9.",
  },
  {
    id: "muharram_start",
    name: "Start of Muharram",
    hijri_month: 1,
    hijri_day: 1,
    duration_days: 1,
    importance: "observance",
    categories: ["sacred_month"],
    observance_type: "day",
    description: "Beginning of the sacred month of Muharram (overlaps Islamic New Year).",
  },
];

// ============================================================================
// Index (O(1) lookup by "month-day")
// ============================================================================

/** Pre-built index: key = "M-D", value = array of rules for that date */
const _festivalIndex = new Map<string, IslamicFestivalRule[]>();

function _buildIndex(): void {
  if (_festivalIndex.size > 0) return;

  for (const rule of ISLAMIC_FESTIVAL_RULES) {
    // Index each day of multi-day events
    for (let d = 0; d < rule.duration_days; d++) {
      let dayNum = rule.hijri_day + d;
      let month = rule.hijri_month;

      // Handle month overflow (e.g., Eid al-Fitr day 3 = 3 Shawwal)
      const maxDay = 30; // Hijri months are at most 30 days
      if (dayNum > maxDay) {
        dayNum -= maxDay;
        month = month === 12 ? 1 : month + 1;
      }

      const key = `${month}-${dayNum}`;
      const arr = _festivalIndex.get(key) ?? [];
      arr.push(rule);
      _festivalIndex.set(key, arr);
    }
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Get all Islamic festivals matching a Hijri date.
 *
 * @param hijriMonth  Hijri month (1-12)
 * @param hijriDay    Hijri day (1-30)
 * @param hijriYear   Hijri year (for the match result)
 * @param weekday     Day of week (0=Sunday, used for Jumu'ah flagging)
 * @returns Array of festival matches (may be empty)
 */
export function getIslamicFestivalsForDate(
  hijriMonth: number,
  hijriDay: number,
  hijriYear: number,
  weekday?: number,
): IslamicFestivalMatch[] {
  _buildIndex();

  const key = `${hijriMonth}-${hijriDay}`;
  const rules = _festivalIndex.get(key);
  if (!rules) return [];

  return rules.map((rule) => {
    // Calculate day_of_event for multi-day events
    let dayOfEvent = 1;
    if (rule.duration_days > 1) {
      // How far is this date from the rule's start date?
      let diff = hijriDay - rule.hijri_day;
      if (diff < 0) {
        // Crossed month boundary
        diff += 30;
      }
      dayOfEvent = diff + 1;
    }

    return {
      rule,
      day_of_event: dayOfEvent,
      hijri_year: hijriYear,
    };
  });
}

/**
 * Get all festival rules, optionally filtered by category or importance.
 */
export function getAllFestivalRules(
  filter?: {
    category?: FestivalCategory;
    importance?: FestivalImportance;
  },
): IslamicFestivalRule[] {
  let rules = ISLAMIC_FESTIVAL_RULES;

  if (filter?.category) {
    rules = rules.filter((r) => r.categories.includes(filter.category!));
  }
  if (filter?.importance) {
    rules = rules.filter((r) => r.importance === filter.importance);
  }

  return rules;
}

/**
 * Get all festivals for a given Hijri month.
 */
export function getFestivalsForHijriMonth(
  hijriMonth: number,
): IslamicFestivalRule[] {
  return ISLAMIC_FESTIVAL_RULES.filter((r) => r.hijri_month === hijriMonth);
}

/**
 * Count of festival rules.
 */
export const FESTIVAL_RULE_COUNT = ISLAMIC_FESTIVAL_RULES.length;
