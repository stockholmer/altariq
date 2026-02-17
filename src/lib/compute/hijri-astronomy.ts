/**
 * Hijri Crescent Astronomy Module
 *
 * Pure math for computing crescent visibility parameters at sunset.
 * Used by hijri-criteria.ts to evaluate different crescent sighting methods.
 *
 * References:
 * - Yallop 1997: "A Method for Predicting the First Sighting of the New Crescent Moon"
 * - Odeh 2004: "New Criterion for Lunar Crescent Visibility"
 * - Ilyas 1994: "Lunar Crescent Visibility Criterion and Islamic Calendar"
 */

import {
  getSunset,
  getSunrise,
  getMoonPosition,
  getMoonset,
  getSunPosition,
  dateToJd,
  jdToDate,
} from "./sun-utils";
import { ttToUT } from "./delta-t";

// ============================================================================
// Constants
// ============================================================================

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

// ============================================================================
// Types
// ============================================================================

/** Raw parameters gathered at sunset for a given location */
export interface CrescentParams {
  /** JD (UT) of sunset */
  sunset_jd: number;
  /** Moon altitude at sunset (degrees, geometric + refraction) */
  moon_alt: number;
  /** Sun altitude at sunset (degrees, should be ~ -0.833) */
  sun_alt: number;
  /** Moon azimuth at sunset (degrees, 0=S, increasing W) */
  moon_az: number;
  /** Sun azimuth at sunset (degrees) */
  sun_az: number;
  /** Moon distance in km */
  moon_distance_km: number;
  /** JD (UT) of moonset (null if moon doesn't set) */
  moonset_jd: number | null;
  /** JD (TT) of the new moon conjunction */
  conjunction_jd_tt: number;
  /** JD (UT) of sunrise on this day */
  sunrise_jd: number | null;
}

/** Derived crescent visibility parameters */
export interface CrescentVisibility {
  /** Arc of Light: geocentric elongation between sun and moon (degrees) */
  ARCL: number;
  /** Arc of Vision: moon altitude minus sun altitude (degrees) */
  ARCV: number;
  /** Difference in Azimuth between moon and sun (degrees) */
  DAZ: number;
  /** Crescent width (arcminutes) */
  W: number;
  /** Moon semi-diameter (arcminutes) */
  SD: number;
  /** Moon age since conjunction (hours) */
  moon_age_hours: number;
  /** Lag time: moonset minus sunset (minutes) */
  lag_minutes: number;
  /** Yallop q-value */
  q_yallop: number;
  /** Best observation time JD (UT) - sunset + 4/9 * lag */
  best_time_jd: number;
  /** Illuminated fraction of the moon (percent 0-100) */
  illumination_pct: number;
  /** Moon altitude at best observation time (degrees) */
  moon_alt_best: number;
}

// ============================================================================
// Core Geometry Functions
// ============================================================================

/**
 * Compute geocentric elongation (ARCL) between moon and sun using spherical trig.
 * cos(ARCL) = sin(alt_m)*sin(alt_s) + cos(alt_m)*cos(alt_s)*cos(az_m - az_s)
 */
export function elongation(
  moonAlt: number,
  sunAlt: number,
  moonAz: number,
  sunAz: number,
): number {
  const mAlt = moonAlt * RAD;
  const sAlt = sunAlt * RAD;
  const dAz = (moonAz - sunAz) * RAD;

  const cosARCL =
    Math.sin(mAlt) * Math.sin(sAlt) +
    Math.cos(mAlt) * Math.cos(sAlt) * Math.cos(dAz);

  // Clamp to [-1, 1] for numerical safety
  return Math.acos(Math.max(-1, Math.min(1, cosARCL))) * DEG;
}

/**
 * Moon semi-diameter from distance in km.
 * SD = asin(1737.4 / dist) converted to arcminutes.
 */
export function moonSemiDiameter(distKm: number): number {
  return Math.asin(1737.4 / distKm) * DEG * 60; // arcminutes
}

/**
 * Crescent width W = SD * (1 - cos(ARCL))
 * Result in arcminutes.
 */
export function crescentWidth(SD: number, ARCL: number): number {
  return SD * (1 - Math.cos(ARCL * RAD));
}

/**
 * Yallop q-value: q = (ARCV - polynomial(W)) / 10
 *
 * The polynomial is Yallop's best-fit for the visibility limit:
 *   ARCV_limit = 11.8371 - 6.3226*W + 0.7319*W^2 - 0.1018*W^3
 *
 * Where W is crescent width in arcminutes.
 *
 * Classification:
 *   q > +0.216  => A (easily visible)
 *   q > -0.014  => B (visible under perfect conditions)
 *   q > -0.160  => C (may need optical aid)
 *   q > -0.232  => D (visible only with optical aid)
 *   q > -0.293  => E (not visible with telescope)
 *   q <= -0.293 => F (not visible, below Danjon limit)
 */
export function yallopQ(ARCV: number, W: number): number {
  const limit = 11.8371 - 6.3226 * W + 0.7319 * W * W - 0.1018 * W * W * W;
  return (ARCV - limit) / 10;
}

/**
 * Yallop visibility zone from q-value.
 */
export function yallopZone(q: number): string {
  if (q > 0.216) return "A";
  if (q > -0.014) return "B";
  if (q > -0.160) return "C";
  if (q > -0.232) return "D";
  if (q > -0.293) return "E";
  return "F";
}

/**
 * Moon age in hours since conjunction.
 */
export function moonAge(currentJdUT: number, conjJdTT: number): number {
  const conjJdUT = ttToUT(conjJdTT);
  return (currentJdUT - conjJdUT) * 24;
}

/**
 * Best observation time: sunset + 4/9 * lag
 * Yallop's optimum time for naked-eye sighting.
 */
export function bestObservationTime(
  sunsetJd: number,
  moonsetJd: number | null,
): number {
  if (moonsetJd === null || moonsetJd <= sunsetJd) {
    // Moon sets before/at sunset - no observation window
    return sunsetJd;
  }
  const lag = moonsetJd - sunsetJd;
  return sunsetJd + (4 / 9) * lag;
}

/**
 * Illuminated fraction of the moon (0-1) from elongation.
 * Uses the simple approximation: k = (1 - cos(ARCL)) / 2
 */
export function illuminatedFraction(ARCL: number): number {
  return (1 - Math.cos(ARCL * RAD)) / 2;
}

// ============================================================================
// Main Computation Functions
// ============================================================================

/**
 * Gather all raw crescent parameters at sunset for a date and location.
 *
 * @param dateStr - Date string "YYYY-MM-DD" (Gregorian, the evening to check)
 * @param lat - Observer latitude (degrees)
 * @param lon - Observer longitude (degrees)
 * @param conjunctionJdTT - JD (TT) of the new moon conjunction
 * @returns CrescentParams or null if sunset doesn't occur
 */
export function computeCrescentParams(
  dateStr: string,
  lat: number,
  lon: number,
  conjunctionJdTT: number,
): CrescentParams | null {
  // Parse date - we want the evening of this date
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0)); // noon UTC as seed

  // Get sunset
  const sunset = getSunset(date, lat, lon);
  if (!sunset) return null; // no sunset (polar)

  const sunsetJd = dateToJd(sunset);

  // Get sunrise (same day)
  const sunrise = getSunrise(date, lat, lon);
  const sunriseJd = sunrise ? dateToJd(sunrise) : null;

  // Moon position at sunset
  const moonPos = getMoonPosition(sunset, lat, lon);
  const moonAltDeg = moonPos.altitude * DEG;
  const moonAzDeg = moonPos.azimuth * DEG;
  const moonDistKm = moonPos.distance;

  // Sun position at sunset
  const sunPos = getSunPosition(sunset, lat, lon);
  const sunAltDeg = sunPos.altitude * DEG;
  const sunAzDeg = sunPos.azimuth * DEG;

  // Moonset - search from the sunset day
  const moonset = getMoonset(date, lat, lon);
  let moonsetJd: number | null = null;
  if (moonset) {
    const msJd = dateToJd(moonset);
    // Only use moonset if it's after sunset
    if (msJd > sunsetJd) {
      moonsetJd = msJd;
    } else {
      // Try next day moonset
      const nextDay = new Date(date.getTime() + 86400000);
      const moonsetNext = getMoonset(nextDay, lat, lon);
      if (moonsetNext) {
        const msJd2 = dateToJd(moonsetNext);
        if (msJd2 > sunsetJd) {
          moonsetJd = msJd2;
        }
      }
    }
  }

  return {
    sunset_jd: sunsetJd,
    moon_alt: moonAltDeg,
    sun_alt: sunAltDeg,
    moon_az: moonAzDeg,
    sun_az: sunAzDeg,
    moon_distance_km: moonDistKm,
    moonset_jd: moonsetJd,
    conjunction_jd_tt: conjunctionJdTT,
    sunrise_jd: sunriseJd,
  };
}

/**
 * Derive all crescent visibility parameters from raw params.
 */
export function computeVisibility(params: CrescentParams): CrescentVisibility {
  const ARCL = elongation(
    params.moon_alt,
    params.sun_alt,
    params.moon_az,
    params.sun_az,
  );

  const ARCV = params.moon_alt - params.sun_alt;
  const DAZ = Math.abs(params.moon_az - params.sun_az);

  const SD = moonSemiDiameter(params.moon_distance_km);
  const W = crescentWidth(SD, ARCL);

  const age = moonAge(params.sunset_jd, params.conjunction_jd_tt);

  // Lag time in minutes
  let lag = 0;
  if (params.moonset_jd !== null && params.moonset_jd > params.sunset_jd) {
    lag = (params.moonset_jd - params.sunset_jd) * 24 * 60;
  }

  const q = yallopQ(ARCV, W);

  const bestJd = bestObservationTime(params.sunset_jd, params.moonset_jd);

  const illum = illuminatedFraction(ARCL) * 100;

  // Moon altitude at best observation time
  let moonAltBest = params.moon_alt; // fallback
  if (bestJd > params.sunset_jd) {
    try {
      // Extract lat/lon isn't stored, so we use the sunset moon_alt as approximation
      // The calling code can re-compute if needed
      moonAltBest = params.moon_alt;
    } catch {
      moonAltBest = params.moon_alt;
    }
  }

  return {
    ARCL,
    ARCV,
    DAZ,
    W,
    SD,
    moon_age_hours: age,
    lag_minutes: lag,
    q_yallop: q,
    best_time_jd: bestJd,
    illumination_pct: illum,
    moon_alt_best: moonAltBest,
  };
}

/**
 * Full crescent computation: params + visibility in one call.
 */
export function computeCrescent(
  dateStr: string,
  lat: number,
  lon: number,
  conjunctionJdTT: number,
): { params: CrescentParams; visibility: CrescentVisibility } | null {
  const params = computeCrescentParams(dateStr, lat, lon, conjunctionJdTT);
  if (!params) return null;
  const visibility = computeVisibility(params);
  return { params, visibility };
}
