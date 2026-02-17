/**
 * Islamic Calendar Compute - Constants
 *
 * Prayer convention configurations and criterion metadata.
 */

import type { PrayerConvention, PrayerConventionId } from "./types";

// ============================================================================
// Prayer Conventions
// ============================================================================

/**
 * Prayer time calculation conventions used by different organizations/regions.
 *
 * Fajr angle: sun depression angle for Fajr prayer
 * Isha angle: sun depression angle for Isha prayer (or fixed offset)
 */
export const PRAYER_CONVENTIONS: Record<PrayerConventionId, PrayerConvention> = {
  mwl: {
    id: "mwl",
    name: "Muslim World League",
    fajr_angle: 18,
    isha_angle: 17,
    isha_offset_min: null,
    region: "Europe, Far East, parts of USA",
  },
  isna: {
    id: "isna",
    name: "Islamic Society of North America",
    fajr_angle: 15,
    isha_angle: 15,
    isha_offset_min: null,
    region: "North America",
  },
  egypt: {
    id: "egypt",
    name: "Egyptian General Authority of Survey",
    fajr_angle: 19.5,
    isha_angle: 17.5,
    isha_offset_min: null,
    region: "Africa, Syria, Lebanon, Malaysia",
  },
  makkah: {
    id: "makkah",
    name: "Umm al-Qura University, Makkah",
    fajr_angle: 18.5,
    isha_angle: null,
    isha_offset_min: 90, // 90 minutes after Maghrib
    region: "Arabian Peninsula",
  },
  karachi: {
    id: "karachi",
    name: "University of Islamic Sciences, Karachi",
    fajr_angle: 18,
    isha_angle: 18,
    isha_offset_min: null,
    region: "Pakistan, Bangladesh, India, Afghanistan",
  },
  tehran: {
    id: "tehran",
    name: "Institute of Geophysics, University of Tehran",
    fajr_angle: 17.7,
    isha_angle: 14,
    isha_offset_min: null,
    region: "Iran, parts of Afghanistan",
  },
  jafari: {
    id: "jafari",
    name: "Shia Ithna-Ashari (Jafari)",
    fajr_angle: 16,
    isha_angle: 14,
    isha_offset_min: null,
    region: "Shia communities worldwide",
  },
};

// ============================================================================
// Kaaba Coordinates (for Qibla calculation)
// ============================================================================

/** Kaaba, Mecca - coordinates */
export const KAABA_LAT = 21.4225;
export const KAABA_LON = 39.8262;

// ============================================================================
// Weekday Names
// ============================================================================

/** Islamic weekday names */
export const WEEKDAY_NAMES = [
  "al-Ahad",    // Sunday
  "al-Ithnayn", // Monday
  "ath-Thulatha", // Tuesday
  "al-Arbi'a",  // Wednesday
  "al-Khamis",  // Thursday
  "al-Jumu'ah", // Friday
  "as-Sabt",    // Saturday
];

export const WEEKDAY_NAMES_EN = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];
