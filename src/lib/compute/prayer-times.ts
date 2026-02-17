/**
 * Prayer Time Calculations
 *
 * Computes Islamic prayer times based on solar position.
 * Supports 7 prayer conventions and 2 Asr methods.
 *
 * Based on the PrayTimes algorithm (praytimes.org) and
 * "Prayer Times Calculation" by Hamid Zarrabi-Zadeh.
 */

import {
  getSunrise,
  getSunset,
  getSunPosition,
  dateToJd,
  jdToDate,
} from "./sun-utils";
import { PRAYER_CONVENTIONS, KAABA_LAT, KAABA_LON } from "./constants";
import type { PrayerConventionId, PrayerTimes, QiblaInfo } from "./types";

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

// ============================================================================
// Core Solar Position
// ============================================================================

/**
 * Find time when sun reaches a given altitude (degrees below horizon).
 * Returns Date or null if sun never reaches that altitude.
 *
 * @param date - Reference date
 * @param lat - Observer latitude
 * @param lon - Observer longitude
 * @param angle - Target sun altitude in degrees (negative = below horizon)
 * @param rising - true for morning (Fajr), false for evening (Isha)
 */
function sunAngleTime(
  date: Date,
  lat: number,
  lon: number,
  angle: number,
  rising: boolean,
): Date | null {
  // Get solar noon first
  const noon = solarNoon(date, lon);
  if (!noon) return null;

  // Sun declination at noon
  const d = daysSinceJ2000(noon);
  const decl = sunDeclination(d);

  // Hour angle for target altitude
  const latRad = lat * RAD;
  const angleRad = angle * RAD;

  const cosHA =
    (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decl)) /
    (Math.cos(latRad) * Math.cos(decl));

  if (cosHA > 1 || cosHA < -1) return null; // Never reaches this angle

  const HA = Math.acos(cosHA) / (2 * Math.PI); // in fraction of day

  const noonJd = dateToJd(noon);
  const timeJd = rising ? noonJd - HA : noonJd + HA;
  return jdToDate(timeJd);
}

/**
 * Calculate solar noon for a date and longitude.
 */
function solarNoon(date: Date, lon: number): Date {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();

  // Start at noon UTC
  const noonUTC = new Date(Date.UTC(y, m, d, 12, 0, 0));

  // Equation of time correction
  const days = daysSinceJ2000(noonUTC);
  const eot = equationOfTime(days); // in minutes

  // Transit time = 12:00 - eot - lon/15 (in hours)
  const transitHours = 12 - eot / 60 - lon / 15;
  const transitMs = transitHours * 3600000;

  return new Date(Date.UTC(y, m, d, 0, 0, 0) + transitMs);
}

/**
 * Days since J2000.0 epoch.
 */
function daysSinceJ2000(date: Date): number {
  return dateToJd(date) - 2451545.0;
}

/**
 * Sun declination (radians) from days since J2000.
 */
function sunDeclination(d: number): number {
  const M = (357.5291 + 0.98560028 * d) * RAD;
  const C = (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) * RAD;
  const L = M + C + 102.9372 * RAD + Math.PI;
  return Math.asin(Math.sin(23.4397 * RAD) * Math.sin(L));
}

/**
 * Equation of time (minutes).
 * Difference between apparent and mean solar time.
 */
function equationOfTime(d: number): number {
  const M = (357.5291 + 0.98560028 * d) * RAD;
  const C = (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) * RAD;
  const L = M + C + 102.9372 * RAD + Math.PI;
  const ra = Math.atan2(
    Math.sin(L) * Math.cos(23.4397 * RAD),
    Math.cos(L),
  );

  // EoT = mean solar time - apparent solar time
  const meanAnomaly = M;
  const eot = (meanAnomaly + 102.9372 * RAD + Math.PI - ra) / (2 * Math.PI) * 1440;

  // Normalize to [-720, 720] minutes
  let result = eot % 1440;
  if (result > 720) result -= 1440;
  if (result < -720) result += 1440;
  return result;
}

// ============================================================================
// Asr Calculation
// ============================================================================

/**
 * Calculate Asr prayer time.
 *
 * The Asr time is when the shadow of an object equals
 * its height multiplied by a factor plus the noon shadow.
 *
 * @param factor - 1 for Shafi'i, 2 for Hanafi
 */
function asrTime(
  date: Date,
  lat: number,
  lon: number,
  factor: number,
): Date | null {
  const noon = solarNoon(date, lon);
  if (!noon) return null;

  const d = daysSinceJ2000(noon);
  const decl = sunDeclination(d);
  const latRad = lat * RAD;

  // Shadow ratio at noon
  const noonAlt = Math.asin(
    Math.sin(latRad) * Math.sin(decl) +
    Math.cos(latRad) * Math.cos(decl),
  );

  // Target: shadow = factor * object + noon shadow
  // noon_shadow / object_height = 1/tan(noonAlt) (or cot(noonAlt))
  // shadow / object = factor + cot(noonAlt)
  // target alt = acot(factor + cot(noonAlt)) = atan(1/(factor + cot(noonAlt)))

  const noonShadowRatio = noonAlt > 0 ? 1 / Math.tan(noonAlt) : 100;
  const asrShadowRatio = factor + noonShadowRatio;
  const asrAlt = Math.atan(1 / asrShadowRatio) * DEG;

  // Find time when sun reaches Asr altitude (afternoon)
  return sunAngleTime(date, lat, lon, asrAlt, false);
}

// ============================================================================
// Main Prayer Time Function
// ============================================================================

/**
 * Calculate all prayer times for a given date, location, and convention.
 *
 * @param dateStr - "YYYY-MM-DD"
 * @param lat - Observer latitude
 * @param lon - Observer longitude
 * @param tz - Timezone name (e.g., "Asia/Riyadh")
 * @param conventionId - Prayer convention
 * @param asrMethod - "shafii" (factor=1) or "hanafi" (factor=2)
 */
export function computePrayerTimes(
  dateStr: string,
  lat: number,
  lon: number,
  tz: string,
  conventionId: PrayerConventionId = "mwl",
  asrMethod: "shafii" | "hanafi" = "shafii",
): PrayerTimes {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

  const convention = PRAYER_CONVENTIONS[conventionId];
  if (!convention) {
    throw new Error(`Unknown prayer convention: ${conventionId}`);
  }

  // 1. Fajr: sun at -fajr_angle
  const fajr = sunAngleTime(date, lat, lon, -convention.fajr_angle, true);

  // 2. Sunrise
  const sunrise = getSunrise(date, lat, lon);

  // 3. Dhuhr: solar noon + 1 minute safety margin
  const noon = solarNoon(date, lon);
  const dhuhr = noon ? new Date(noon.getTime() + 60000) : null; // +1 min

  // 4. Asr
  const asrFactor = asrMethod === "hanafi" ? 2 : 1;
  const asr = asrTime(date, lat, lon, asrFactor);

  // 5. Maghrib: sunset
  const maghrib = getSunset(date, lat, lon);

  // 6. Isha: sun at -isha_angle OR fixed offset after Maghrib
  let isha: Date | null = null;
  if (convention.isha_angle !== null) {
    isha = sunAngleTime(date, lat, lon, -convention.isha_angle, false);
  } else if (convention.isha_offset_min !== null && maghrib) {
    isha = new Date(maghrib.getTime() + convention.isha_offset_min * 60000);
  }

  // 7. Islamic midnight: midpoint between Maghrib and next Fajr
  let midnight: Date | null = null;
  if (maghrib && fajr) {
    // Next Fajr (tomorrow)
    const nextDate = new Date(Date.UTC(y, m - 1, d + 1, 12, 0, 0));
    const nextFajr = sunAngleTime(nextDate, lat, lon, -convention.fajr_angle, true);
    if (nextFajr) {
      const midMs = (maghrib.getTime() + nextFajr.getTime()) / 2;
      midnight = new Date(midMs);
    }
  }

  return {
    fajr: formatTimeInTz(fajr, tz),
    sunrise: formatTimeInTz(sunrise, tz),
    dhuhr: formatTimeInTz(dhuhr, tz),
    asr: formatTimeInTz(asr, tz),
    maghrib: formatTimeInTz(maghrib, tz),
    isha: formatTimeInTz(isha, tz),
    midnight: formatTimeInTz(midnight, tz),
  };
}

/**
 * Format a Date to "HH:MM" in a given timezone.
 */
function formatTimeInTz(date: Date | null, tz: string): string | null {
  if (!date) return null;

  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return formatter.format(date);
  } catch {
    // Fallback: UTC
    const h = String(date.getUTCHours()).padStart(2, "0");
    const m = String(date.getUTCMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }
}

// ============================================================================
// Qibla Direction
// ============================================================================

/**
 * Calculate Qibla direction (bearing to Kaaba from observer location).
 *
 * Uses great circle bearing formula:
 *   bearing = atan2(sin(dLon)*cos(lat2), cos(lat1)*sin(lat2) - sin(lat1)*cos(lat2)*cos(dLon))
 *
 * @returns bearing in degrees from North (0-360, clockwise)
 */
export function computeQiblaDirection(lat: number, lon: number): number {
  const lat1 = lat * RAD;
  const lon1 = lon * RAD;
  const lat2 = KAABA_LAT * RAD;
  const lon2 = KAABA_LON * RAD;

  const dLon = lon2 - lon1;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = Math.atan2(y, x) * DEG;

  // Normalize to 0-360
  bearing = (bearing + 360) % 360;

  return bearing;
}

/**
 * Calculate great circle distance to Kaaba in km.
 */
export function computeQiblaDistance(lat: number, lon: number): number {
  const R = 6371; // Earth radius in km
  const lat1 = lat * RAD;
  const lon1 = lon * RAD;
  const lat2 = KAABA_LAT * RAD;
  const lon2 = KAABA_LON * RAD;

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Compute full Qibla info.
 */
export function computeQibla(lat: number, lon: number): QiblaInfo {
  return {
    direction: Math.round(computeQiblaDirection(lat, lon) * 100) / 100,
    distance_km: Math.round(computeQiblaDistance(lat, lon)),
  };
}
