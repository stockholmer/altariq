/**
 * Delta T (ΔT) Utilities
 *
 * ΔT is the difference between Terrestrial Time (TT) and Universal Time (UT):
 *   TT = UT + ΔT
 *
 * Pre-computed astronomical data (tithi/nakshatra boundaries) uses TT (via JPL ephemeris),
 * while sunrise/sunset calculations use UT. This module provides conversion functions.
 *
 * ΔT values:
 * - Historical values from IERS (International Earth Rotation Service)
 * - Future values are predicted and may vary by ~1 second
 *
 * Accuracy: ±0.1 seconds for historical, ±1-2 seconds for predictions
 */

// ΔT lookup table (TT - UT in seconds) for 1900-2100
// Sources:
// - 1900-1999: IERS/USNO historical values (Morrison & Stephenson 2004, IERS)
// - 2000-2024: IERS Bulletin A historical values
// - 2025-2100: Polynomial extrapolation (NASA/USNO models)
const DELTA_T_TABLE: { year: number; dt: number }[] = [
  // Historical values 1900-1999 (5-year intervals, IERS/USNO)
  { year: 1900, dt: -2.72 },
  { year: 1905, dt: 3.86 },
  { year: 1910, dt: 10.38 },
  { year: 1915, dt: 17.20 },
  { year: 1920, dt: 21.16 },
  { year: 1925, dt: 23.62 },
  { year: 1930, dt: 24.02 },
  { year: 1935, dt: 23.93 },
  { year: 1940, dt: 24.33 },
  { year: 1945, dt: 26.77 },
  { year: 1950, dt: 29.15 },
  { year: 1955, dt: 31.07 },
  { year: 1960, dt: 33.15 },
  { year: 1965, dt: 35.73 },
  { year: 1970, dt: 40.18 },
  { year: 1975, dt: 45.48 },
  { year: 1980, dt: 50.54 },
  { year: 1985, dt: 54.34 },
  { year: 1990, dt: 56.86 },
  { year: 1995, dt: 60.79 },
  // Modern values 2000-2024
  { year: 2000, dt: 63.83 },
  { year: 2001, dt: 64.09 },
  { year: 2002, dt: 64.30 },
  { year: 2003, dt: 64.47 },
  { year: 2004, dt: 64.57 },
  { year: 2005, dt: 64.69 },
  { year: 2006, dt: 64.85 },
  { year: 2007, dt: 65.15 },
  { year: 2008, dt: 65.46 },
  { year: 2009, dt: 65.78 },
  { year: 2010, dt: 66.07 },
  { year: 2011, dt: 66.32 },
  { year: 2012, dt: 66.60 },
  { year: 2013, dt: 66.91 },
  { year: 2014, dt: 67.28 },
  { year: 2015, dt: 67.64 },
  { year: 2016, dt: 68.12 },
  { year: 2017, dt: 68.59 },
  { year: 2018, dt: 68.97 },
  { year: 2019, dt: 69.22 },
  { year: 2020, dt: 69.36 },
  { year: 2021, dt: 69.29 },  // ΔT started decreasing slightly
  { year: 2022, dt: 69.18 },
  { year: 2023, dt: 69.10 },
  { year: 2024, dt: 69.20 },
  // Predicted values (conservative estimates)
  { year: 2025, dt: 69.5 },
  { year: 2026, dt: 69.7 },
  { year: 2027, dt: 69.9 },
  { year: 2028, dt: 70.1 },
  { year: 2029, dt: 70.3 },
  { year: 2030, dt: 70.5 },
  { year: 2035, dt: 71.5 },
  { year: 2040, dt: 73.0 },
  { year: 2045, dt: 75.0 },
  { year: 2050, dt: 77.0 },
  { year: 2060, dt: 82.0 },
  { year: 2070, dt: 88.0 },
  { year: 2080, dt: 95.0 },
  { year: 2090, dt: 103.0 },
  { year: 2100, dt: 112.0 },
];

/**
 * Get ΔT (TT - UT) in seconds for a given year.
 *
 * Uses linear interpolation between table values.
 *
 * @param year - Calendar year (fractional years supported)
 * @returns ΔT in seconds
 */
export function getDeltaT(year: number): number {
  // Handle edge cases
  if (year <= DELTA_T_TABLE[0].year) {
    return DELTA_T_TABLE[0].dt;
  }

  const lastEntry = DELTA_T_TABLE[DELTA_T_TABLE.length - 1];
  if (year >= lastEntry.year) {
    return lastEntry.dt;
  }

  // Find bracketing entries and interpolate
  for (let i = 0; i < DELTA_T_TABLE.length - 1; i++) {
    const entry = DELTA_T_TABLE[i];
    const nextEntry = DELTA_T_TABLE[i + 1];

    if (year >= entry.year && year < nextEntry.year) {
      const fraction = (year - entry.year) / (nextEntry.year - entry.year);
      return entry.dt + fraction * (nextEntry.dt - entry.dt);
    }
  }

  // Fallback (shouldn't reach here)
  return 69.0;
}

/**
 * Convert Julian Day in UT to Julian Day in TT.
 *
 * @param jd_ut - Julian Day in Universal Time
 * @returns Julian Day in Terrestrial Time
 */
export function utToTT(jd_ut: number): number {
  // Convert JD to approximate year for ΔT lookup
  // JD 2451545.0 = 2000-01-01 12:00 TT (J2000.0)
  const year = 2000 + (jd_ut - 2451545.0) / 365.25;

  const deltaT = getDeltaT(year);

  // ΔT is in seconds, JD is in days
  // jd_tt = jd_ut + ΔT/86400
  return jd_ut + deltaT / 86400;
}

/**
 * Convert Julian Day in TT to Julian Day in UT.
 *
 * @param jd_tt - Julian Day in Terrestrial Time
 * @returns Julian Day in Universal Time
 */
export function ttToUT(jd_tt: number): number {
  // Convert JD to approximate year for ΔT lookup
  const year = 2000 + (jd_tt - 2451545.0) / 365.25;

  const deltaT = getDeltaT(year);

  // jd_ut = jd_tt - ΔT/86400
  return jd_tt - deltaT / 86400;
}

/**
 * Get ΔT in days for a given Julian Day.
 *
 * Useful for direct JD arithmetic.
 *
 * @param jd - Julian Day (in either TT or UT, the difference is negligible for lookup)
 * @returns ΔT in days
 */
export function getDeltaTDays(jd: number): number {
  const year = 2000 + (jd - 2451545.0) / 365.25;
  return getDeltaT(year) / 86400;
}
