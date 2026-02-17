/**
 * Islamic Calendar Compute - Type Definitions
 */

import type { CriterionId } from "./hijri-criteria";
import type { HijriDate, IslamicEvent, HijriMonthStart } from "./hijri-calendar";
import type { CrescentVisibility, CrescentParams } from "./hijri-astronomy";

// ============================================================================
// Request Types
// ============================================================================

export interface DayRequest {
  lat: number;
  lon: number;
  tz: string;
  date: string; // YYYY-MM-DD
  criterion: CriterionId;
}

export interface MonthRequest {
  hijri_year: number;
  hijri_month: number;
  criterion: CriterionId;
  lat?: number;
  lon?: number;
  tz?: string;
}

export interface YearRequest {
  year: number; // Gregorian year
  criterion: CriterionId;
  lat?: number;
  lon?: number;
}

export interface EventsRequest {
  year: number; // Gregorian year
  criterion: CriterionId;
  lat?: number;
  lon?: number;
}

export interface PrayerRequest {
  lat: number;
  lon: number;
  tz: string;
  date: string; // YYYY-MM-DD
  convention: PrayerConventionId;
  asr: "shafii" | "hanafi";
}

// ============================================================================
// Response Types
// ============================================================================

export interface DayResponse {
  date: string;
  hijri: HijriDate;
  criterion: CriterionId;
  events: IslamicEvent[];
  crescent?: {
    visibility?: CrescentVisibility;
    params?: CrescentParams;
  };
}

export interface MonthResponse {
  hijri_year: number;
  hijri_month: number;
  month_name: string;
  month_name_arabic: string;
  gregorian_range: {
    start: string;
    end: string;
    days: number;
  } | null;
  events: IslamicEvent[];
  days: MonthDayEntry[];
}

export interface MonthDayEntry {
  hijri_day: number;
  gregorian_date: string;
  weekday: string;
  events: IslamicEvent[];
}

export interface YearResponse {
  gregorian_year: number;
  criterion: CriterionId;
  month_starts: HijriMonthStart[];
}

export interface EventsResponse {
  gregorian_year: number;
  criterion: CriterionId;
  events: EventWithGregorian[];
}

export interface EventWithGregorian {
  event: IslamicEvent;
  gregorian_date: string;
  hijri_date: string;
}

export interface PrayerTimesResponse {
  date: string;
  location: { lat: number; lon: number };
  timezone: string;
  convention: PrayerConventionId;
  asr_method: "shafii" | "hanafi";
  times: PrayerTimes;
  qibla: QiblaInfo;
}

export interface PrayerTimes {
  fajr: string | null;
  sunrise: string | null;
  dhuhr: string | null;
  asr: string | null;
  maghrib: string | null;
  isha: string | null;
  midnight: string | null;
}

export interface QiblaInfo {
  direction: number; // degrees from North, clockwise
  distance_km: number;
}

// ============================================================================
// Prayer Convention Types
// ============================================================================

export type PrayerConventionId =
  | "mwl"
  | "isna"
  | "egypt"
  | "makkah"
  | "karachi"
  | "tehran"
  | "jafari";

export interface PrayerConvention {
  id: PrayerConventionId;
  name: string;
  fajr_angle: number; // degrees below horizon
  isha_angle: number | null; // degrees below horizon (null = use fixed offset)
  isha_offset_min: number | null; // fixed minutes after Maghrib (if isha_angle is null)
  region: string;
}
