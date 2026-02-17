/**
 * Hijri Calendar Engine
 *
 * Date conversion, month naming, Islamic event mapping.
 * Supports both tabular (arithmetic) and astronomical Hijri calendars.
 *
 * Tabular calendar: 30-year cycle with fixed leap year pattern.
 * Astronomical calendar: based on actual new moon sighting criteria.
 */

import { ttToUT } from "./delta-t";
import { jdToDate } from "./sun-utils";

// ============================================================================
// Constants
// ============================================================================

/** Julian Day of the Hijri epoch: 1 Muharram 1 AH = July 16, 622 CE (Julian) */
export const HIJRI_EPOCH_JD = 1948439.5;

/** Average length of a Hijri month in the tabular calendar */
const TABULAR_MONTH_LENGTH = 29.530588853;

/** 30-year cycle length in days (360 months) */
const TABULAR_CYCLE_DAYS = 10631;

/** Leap years in a 30-year cycle (have 355 days instead of 354) */
const TABULAR_LEAP_YEARS = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];

/** Month lengths in a common (non-leap) year: alternating 30/29 */
const COMMON_MONTH_LENGTHS = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

/** Month lengths in a leap year: last month (Dhul Hijjah) gets 30 instead of 29 */
const LEAP_MONTH_LENGTHS = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30];

// ============================================================================
// Month Names
// ============================================================================

export interface HijriMonthInfo {
  /** 1-based month number */
  number: number;
  /** English transliteration */
  name: string;
  /** Arabic name (Unicode escapes for Windows cp1252 safety) */
  arabic: string;
  /** Short English name */
  short: string;
}

export const HIJRI_MONTH_NAMES: HijriMonthInfo[] = [
  { number: 1, name: "Muharram", arabic: "\u0645\u062D\u0631\u0645", short: "Muh" },
  { number: 2, name: "Safar", arabic: "\u0635\u0641\u0631", short: "Saf" },
  { number: 3, name: "Rabi al-Awwal", arabic: "\u0631\u0628\u064A\u0639 \u0627\u0644\u0623\u0648\u0644", short: "Rb1" },
  { number: 4, name: "Rabi al-Thani", arabic: "\u0631\u0628\u064A\u0639 \u0627\u0644\u062B\u0627\u0646\u064A", short: "Rb2" },
  { number: 5, name: "Jumada al-Ula", arabic: "\u062C\u0645\u0627\u062F\u0649 \u0627\u0644\u0623\u0648\u0644\u0649", short: "Jm1" },
  { number: 6, name: "Jumada al-Thani", arabic: "\u062C\u0645\u0627\u062F\u0649 \u0627\u0644\u062B\u0627\u0646\u064A\u0629", short: "Jm2" },
  { number: 7, name: "Rajab", arabic: "\u0631\u062C\u0628", short: "Raj" },
  { number: 8, name: "Sha'ban", arabic: "\u0634\u0639\u0628\u0627\u0646", short: "Sha" },
  { number: 9, name: "Ramadan", arabic: "\u0631\u0645\u0636\u0627\u0646", short: "Ram" },
  { number: 10, name: "Shawwal", arabic: "\u0634\u0648\u0627\u0644", short: "Shw" },
  { number: 11, name: "Dhul Qi'dah", arabic: "\u0630\u0648 \u0627\u0644\u0642\u0639\u062F\u0629", short: "DhQ" },
  { number: 12, name: "Dhul Hijjah", arabic: "\u0630\u0648 \u0627\u0644\u062D\u062C\u0629", short: "DhH" },
];

// ============================================================================
// Islamic Events
// ============================================================================

export interface IslamicEvent {
  /** Event identifier */
  key: string;
  /** Display name */
  name: string;
  /** Hijri month (1-12) */
  hijri_month: number;
  /** Hijri day (1-30) */
  hijri_day: number;
  /** Whether this is a major/public holiday */
  is_major: boolean;
  /** Brief description */
  description: string;
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    key: "hijri_new_year",
    name: "Islamic New Year",
    hijri_month: 1,
    hijri_day: 1,
    is_major: true,
    description: "First day of Muharram, start of the Islamic year.",
  },
  {
    key: "ashura",
    name: "Day of Ashura",
    hijri_month: 1,
    hijri_day: 10,
    is_major: true,
    description: "10th Muharram. Day of fasting and remembrance.",
  },
  {
    key: "mawlid",
    name: "Mawlid al-Nabi",
    hijri_month: 3,
    hijri_day: 12,
    is_major: true,
    description: "Birthday of Prophet Muhammad (PBUH). 12th Rabi al-Awwal.",
  },
  {
    key: "isra_miraj",
    name: "Isra and Mi'raj",
    hijri_month: 7,
    hijri_day: 27,
    is_major: true,
    description: "Night Journey and Ascension. 27th Rajab.",
  },
  {
    key: "shab_e_barat",
    name: "Shab-e-Barat",
    hijri_month: 8,
    hijri_day: 15,
    is_major: false,
    description: "Night of Fortune. 15th Sha'ban.",
  },
  {
    key: "ramadan_start",
    name: "Start of Ramadan",
    hijri_month: 9,
    hijri_day: 1,
    is_major: true,
    description: "First day of fasting month.",
  },
  {
    key: "laylat_al_qadr_21",
    name: "Laylat al-Qadr (21st)",
    hijri_month: 9,
    hijri_day: 21,
    is_major: false,
    description: "Night of Power candidate (odd night of last 10 days).",
  },
  {
    key: "laylat_al_qadr_23",
    name: "Laylat al-Qadr (23rd)",
    hijri_month: 9,
    hijri_day: 23,
    is_major: false,
    description: "Night of Power candidate (odd night of last 10 days).",
  },
  {
    key: "laylat_al_qadr_25",
    name: "Laylat al-Qadr (25th)",
    hijri_month: 9,
    hijri_day: 25,
    is_major: false,
    description: "Night of Power candidate (odd night of last 10 days).",
  },
  {
    key: "laylat_al_qadr_27",
    name: "Laylat al-Qadr (27th)",
    hijri_month: 9,
    hijri_day: 27,
    is_major: true,
    description: "Night of Power (most widely observed candidate). 27th Ramadan.",
  },
  {
    key: "laylat_al_qadr_29",
    name: "Laylat al-Qadr (29th)",
    hijri_month: 9,
    hijri_day: 29,
    is_major: false,
    description: "Night of Power candidate (odd night of last 10 days).",
  },
  {
    key: "eid_al_fitr",
    name: "Eid al-Fitr",
    hijri_month: 10,
    hijri_day: 1,
    is_major: true,
    description: "Festival of Breaking the Fast. 1st Shawwal.",
  },
  {
    key: "day_of_arafah",
    name: "Day of Arafah",
    hijri_month: 12,
    hijri_day: 9,
    is_major: true,
    description: "Day of standing at Arafah during Hajj. 9th Dhul Hijjah.",
  },
  {
    key: "eid_al_adha",
    name: "Eid al-Adha",
    hijri_month: 12,
    hijri_day: 10,
    is_major: true,
    description: "Festival of Sacrifice. 10th Dhul Hijjah.",
  },
];

// ============================================================================
// Hijri Date Type
// ============================================================================

export interface HijriDate {
  /** Hijri year */
  year: number;
  /** Hijri month (1-12) */
  month: number;
  /** Hijri day (1-30) */
  day: number;
  /** Month name info */
  month_info: HijriMonthInfo;
  /** Day of week (0=Sunday .. 6=Saturday) */
  weekday?: number;
}

// ============================================================================
// Tabular Calendar Functions
// ============================================================================

/**
 * Check if a Hijri year is a leap year in the tabular calendar.
 */
export function isTabularLeapYear(hijriYear: number): boolean {
  const yearInCycle = ((hijriYear - 1) % 30) + 1;
  return TABULAR_LEAP_YEARS.includes(yearInCycle);
}

/**
 * Days in a Hijri month (tabular calendar).
 */
export function tabularMonthDays(hijriYear: number, hijriMonth: number): number {
  const lengths = isTabularLeapYear(hijriYear)
    ? LEAP_MONTH_LENGTHS
    : COMMON_MONTH_LENGTHS;
  return lengths[hijriMonth - 1];
}

/**
 * Days in a Hijri year (tabular calendar).
 */
export function tabularYearDays(hijriYear: number): number {
  return isTabularLeapYear(hijriYear) ? 355 : 354;
}

/**
 * Convert Gregorian date to Hijri (tabular algorithm).
 *
 * Based on the algorithm from:
 * "Mapping the Islamic and Gregorian calendars" by Khalid Chraibi
 */
export function gregorianToHijriTabular(
  year: number,
  month: number,
  day: number,
): HijriDate {
  // Convert Gregorian to JD
  const jd = gregorianToJd(year, month, day);

  // Days since Hijri epoch
  const daysSinceEpoch = Math.floor(jd - HIJRI_EPOCH_JD);

  // 30-year cycles
  const cycles = Math.floor(daysSinceEpoch / TABULAR_CYCLE_DAYS);
  let remaining = daysSinceEpoch - cycles * TABULAR_CYCLE_DAYS;

  // Find year within cycle
  let hijriYear = cycles * 30 + 1;
  while (remaining > 0) {
    const yearDays = tabularYearDays(hijriYear);
    if (remaining < yearDays) break;
    remaining -= yearDays;
    hijriYear++;
  }

  // Find month
  let hijriMonth = 1;
  while (hijriMonth <= 12) {
    const monthDays = tabularMonthDays(hijriYear, hijriMonth);
    if (remaining < monthDays) break;
    remaining -= monthDays;
    hijriMonth++;
  }

  // Remaining days + 1 (1-indexed)
  const hijriDay = remaining + 1;

  return {
    year: hijriYear,
    month: hijriMonth,
    day: hijriDay,
    month_info: HIJRI_MONTH_NAMES[hijriMonth - 1],
  };
}

/**
 * Convert Hijri date to Gregorian (tabular algorithm).
 * Returns { year, month, day } in Gregorian.
 */
export function hijriToGregorianTabular(
  hijriYear: number,
  hijriMonth: number,
  hijriDay: number,
): { year: number; month: number; day: number } {
  // Count days from Hijri epoch
  let days = 0;

  // Full 30-year cycles
  const cycles = Math.floor((hijriYear - 1) / 30);
  days += cycles * TABULAR_CYCLE_DAYS;

  // Remaining years
  const startYear = cycles * 30 + 1;
  for (let y = startYear; y < hijriYear; y++) {
    days += tabularYearDays(y);
  }

  // Months
  for (let m = 1; m < hijriMonth; m++) {
    days += tabularMonthDays(hijriYear, m);
  }

  // Days (0-indexed from epoch, so day-1)
  days += hijriDay - 1;

  // Convert to JD then to Gregorian
  const jd = HIJRI_EPOCH_JD + days;
  return jdToGregorian(jd);
}

// ============================================================================
// Astronomical Calendar Functions
// ============================================================================

/** Month start entry from pre-computed or runtime data */
export interface HijriMonthStart {
  /** Hijri year */
  hijri_year: number;
  /** Hijri month (1-12) */
  hijri_month: number;
  /** Gregorian date string "YYYY-MM-DD" of first day of month */
  gregorian_start: string;
  /** JD (TT) of the new moon conjunction that started this month */
  conjunction_jd_tt: number;
}

/**
 * Convert Gregorian date to Hijri using pre-computed month starts.
 * Falls back to tabular if month starts don't cover the date.
 */
export function gregorianToHijri(
  dateStr: string,
  monthStarts: HijriMonthStart[],
): HijriDate {
  if (monthStarts.length === 0) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return gregorianToHijriTabular(y, m, d);
  }

  // Sort by gregorian_start descending to find the latest start <= dateStr
  const sorted = [...monthStarts].sort(
    (a, b) => b.gregorian_start.localeCompare(a.gregorian_start),
  );

  for (const ms of sorted) {
    if (ms.gregorian_start <= dateStr) {
      // This month contains our date
      const startParts = ms.gregorian_start.split("-").map(Number);
      const dateParts = dateStr.split("-").map(Number);

      const startDate = new Date(
        Date.UTC(startParts[0], startParts[1] - 1, startParts[2]),
      );
      const targetDate = new Date(
        Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]),
      );

      const dayDiff = Math.round(
        (targetDate.getTime() - startDate.getTime()) / 86400000,
      );

      return {
        year: ms.hijri_year,
        month: ms.hijri_month,
        day: dayDiff + 1,
        month_info: HIJRI_MONTH_NAMES[ms.hijri_month - 1],
      };
    }
  }

  // Fallback to tabular
  const [y, m, d] = dateStr.split("-").map(Number);
  return gregorianToHijriTabular(y, m, d);
}

/**
 * Get Islamic events that fall on a given Hijri date.
 */
export function getEventsForDate(hijriDate: HijriDate): IslamicEvent[] {
  return ISLAMIC_EVENTS.filter(
    (e) =>
      e.hijri_month === hijriDate.month && e.hijri_day === hijriDate.day,
  );
}

/**
 * Get all events for a Hijri month.
 */
export function getEventsForMonth(
  hijriMonth: number,
): IslamicEvent[] {
  return ISLAMIC_EVENTS.filter((e) => e.hijri_month === hijriMonth);
}

/**
 * Get Gregorian date range for a Hijri month using month starts.
 */
export function hijriMonthToGregorianRange(
  hYear: number,
  hMonth: number,
  monthStarts: HijriMonthStart[],
): { start: string; end: string; days: number } | null {
  // Find this month's start
  const thisMonth = monthStarts.find(
    (ms) => ms.hijri_year === hYear && ms.hijri_month === hMonth,
  );
  if (!thisMonth) return null;

  // Find next month's start
  const nextHMonth = hMonth === 12 ? 1 : hMonth + 1;
  const nextHYear = hMonth === 12 ? hYear + 1 : hYear;
  const nextMonth = monthStarts.find(
    (ms) => ms.hijri_year === nextHYear && ms.hijri_month === nextHMonth,
  );

  if (!nextMonth) {
    // Estimate 29 or 30 days
    const days = tabularMonthDays(hYear, hMonth);
    const startParts = thisMonth.gregorian_start.split("-").map(Number);
    const startDate = new Date(
      Date.UTC(startParts[0], startParts[1] - 1, startParts[2]),
    );
    const endDate = new Date(
      startDate.getTime() + (days - 1) * 86400000,
    );
    const endStr = `${endDate.getUTCFullYear()}-${String(endDate.getUTCMonth() + 1).padStart(2, "0")}-${String(endDate.getUTCDate()).padStart(2, "0")}`;
    return { start: thisMonth.gregorian_start, end: endStr, days };
  }

  // Calculate days between starts
  const startParts = thisMonth.gregorian_start.split("-").map(Number);
  const endParts = nextMonth.gregorian_start.split("-").map(Number);
  const startDate = new Date(
    Date.UTC(startParts[0], startParts[1] - 1, startParts[2]),
  );
  const endDate = new Date(
    Date.UTC(endParts[0], endParts[1] - 1, endParts[2]),
  );
  const days = Math.round(
    (endDate.getTime() - startDate.getTime()) / 86400000,
  );

  // Last day of this month = day before next month starts
  const lastDay = new Date(endDate.getTime() - 86400000);
  const lastDayStr = `${lastDay.getUTCFullYear()}-${String(lastDay.getUTCMonth() + 1).padStart(2, "0")}-${String(lastDay.getUTCDate()).padStart(2, "0")}`;

  return { start: thisMonth.gregorian_start, end: lastDayStr, days };
}

/**
 * Get all month starts for a Gregorian year using new moon data and a criterion.
 * This is the core runtime function for astronomical calendars.
 *
 * @param newMoonJdTTs - Array of new moon JD (TT) values for the year (and adjacent years)
 * @param criterion - Criterion ID to use
 * @param lat - Observer latitude
 * @param lon - Observer longitude
 * @param evaluator - The criterion evaluation function
 * @returns Array of month starts
 */
export function computeMonthStarts(
  newMoonJdTTs: number[],
  evaluator: (
    dateStr: string,
    lat: number,
    lon: number,
    conjJdTT: number,
  ) => { new_month_starts: boolean },
  lat: number,
  lon: number,
): HijriMonthStart[] {
  const monthStarts: HijriMonthStart[] = [];

  for (const conjJdTT of newMoonJdTTs) {
    // Search up to 4 days after conjunction for first sighting
    const conjUT = ttToUT(conjJdTT);
    const conjDate = jdToDate(conjUT);

    for (let d = 0; d < 4; d++) {
      const checkDate = new Date(conjDate.getTime() + d * 86400000);
      const y = checkDate.getUTCFullYear();
      const m = String(checkDate.getUTCMonth() + 1).padStart(2, "0");
      const day = String(checkDate.getUTCDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${day}`;

      const result = evaluator(dateStr, lat, lon, conjJdTT);
      if (result.new_month_starts) {
        // The new month starts the NEXT day (sighting is evening, month starts next morning)
        const nextDay = new Date(checkDate.getTime() + 86400000);
        const ny = nextDay.getUTCFullYear();
        const nm = String(nextDay.getUTCMonth() + 1).padStart(2, "0");
        const nd = String(nextDay.getUTCDate()).padStart(2, "0");

        monthStarts.push({
          hijri_year: 0, // Will be assigned later
          hijri_month: 0,
          gregorian_start: `${ny}-${nm}-${nd}`,
          conjunction_jd_tt: conjJdTT,
        });
        break;
      }
    }
  }

  return monthStarts;
}

/**
 * Assign Hijri year/month numbers to a sequence of month starts.
 * Requires knowing at least one anchor point (e.g., Muharram 1 of a known year).
 */
export function assignHijriNumbers(
  monthStarts: HijriMonthStart[],
  anchorYear: number,
  anchorMonth: number,
  anchorIndex: number,
): void {
  // Forward from anchor
  let hYear = anchorYear;
  let hMonth = anchorMonth;

  for (let i = anchorIndex; i < monthStarts.length; i++) {
    monthStarts[i].hijri_year = hYear;
    monthStarts[i].hijri_month = hMonth;
    hMonth++;
    if (hMonth > 12) {
      hMonth = 1;
      hYear++;
    }
  }

  // Backward from anchor
  hYear = anchorYear;
  hMonth = anchorMonth;

  for (let i = anchorIndex - 1; i >= 0; i--) {
    hMonth--;
    if (hMonth < 1) {
      hMonth = 12;
      hYear--;
    }
    monthStarts[i].hijri_year = hYear;
    monthStarts[i].hijri_month = hMonth;
  }
}

// ============================================================================
// JD <-> Gregorian Helpers
// ============================================================================

/**
 * Convert Gregorian date to Julian Day.
 */
export function gregorianToJd(
  year: number,
  month: number,
  day: number,
): number {
  // Meeus algorithm
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    B -
    1524.5
  );
}

/**
 * Convert Julian Day to Gregorian date.
 */
export function jdToGregorian(jd: number): {
  year: number;
  month: number;
  day: number;
} {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let A: number;
  if (z < 2299161) {
    A = z;
  } else {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    A = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E) + Math.round(f);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  return { year, month, day };
}

/**
 * Format a HijriDate as a human-readable string.
 */
export function formatHijriDate(h: HijriDate): string {
  return `${h.day} ${h.month_info.name} ${h.year} AH`;
}
