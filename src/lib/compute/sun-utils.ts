/**
 * Sun/Moon calculation utilities using SunCalc algorithm
 *
 * Based on: https://github.com/mourner/suncalc
 * Accuracy: ~1 minute for sunrise/sunset (sufficient for panchanga civil day labeling)
 *
 * This is a pure TypeScript implementation suitable for Deno Edge Functions.
 */

// Constants
const PI = Math.PI;
const RAD = PI / 180;
const DAY_MS = 1000 * 60 * 60 * 24;
const J1970 = 2440588;
const J2000 = 2451545;

// Sun calculation constants
const e = RAD * 23.4397; // obliquity of the Earth

/**
 * Convert Date to Julian Day
 */
export function dateToJd(date: Date): number {
  return date.valueOf() / DAY_MS - 0.5 + J1970;
}

/**
 * Convert Julian Day to Date
 */
export function jdToDate(jd: number): Date {
  return new Date((jd + 0.5 - J1970) * DAY_MS);
}

/**
 * Convert Julian Day to days since J2000
 */
function toDays(date: Date): number {
  return dateToJd(date) - J2000;
}

// Trigonometry helpers
function sin(x: number): number { return Math.sin(x); }
function cos(x: number): number { return Math.cos(x); }
function tan(x: number): number { return Math.tan(x); }
function asin(x: number): number { return Math.asin(x); }
function acos(x: number): number { return Math.acos(x); }
function atan2(y: number, x: number): number { return Math.atan2(y, x); }

/**
 * Get right ascension
 */
function rightAscension(l: number, b: number): number {
  return atan2(sin(l) * cos(e) - tan(b) * sin(e), cos(l));
}

/**
 * Get declination
 */
function declination(l: number, b: number): number {
  return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));
}

/**
 * Get azimuth
 */
function azimuth(H: number, phi: number, dec: number): number {
  return atan2(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi));
}

/**
 * Get altitude
 */
function altitude(H: number, phi: number, dec: number): number {
  return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
}

/**
 * Get sidereal time (Meeus eq. 12.4, accurate to ~0.001 degree)
 */
function siderealTime(d: number, lw: number): number {
  const T = d / 36525;
  return RAD * (280.46061837 + 360.98564736629 * d + 0.000387933 * T * T) - lw;
}

/**
 * Get solar mean anomaly
 */
function solarMeanAnomaly(d: number): number {
  return RAD * (357.5291 + 0.98560028 * d);
}

/**
 * Get ecliptic longitude
 */
function eclipticLongitude(M: number): number {
  const C = RAD * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)); // equation of center
  const P = RAD * 102.9372; // perihelion of the Earth
  return M + C + P + PI;
}

/**
 * Get sun coordinates using Meeus-quality formulas.
 * More accurate than the original SunCalc for dates far from J2000,
 * accounting for perihelion drift, obliquity change, and better equation of center.
 */
function sunCoords(d: number): { dec: number; ra: number } {
  const T = d / 36525;
  // Sun's geometric mean longitude (Meeus)
  const L0 = RAD * ((280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360);
  // Sun's mean anomaly (Meeus)
  const M = RAD * ((357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360);
  // Equation of center with time-dependent coefficients (Meeus)
  const C = RAD * (
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) +
    (0.019993 - 0.000101 * T) * sin(2 * M) +
    0.000289 * sin(3 * M)
  );
  // Sun's true longitude
  const sunLon = L0 + C;
  // Mean obliquity (Meeus, simplified)
  const eps = RAD * (23.439291 - 0.0130042 * T);
  return {
    dec: asin(sin(eps) * sin(sunLon)),
    ra: atan2(cos(eps) * sin(sunLon), cos(sunLon)),
  };
}

/**
 * Calculate sun position at a given time
 */
export function getSunPosition(date: Date, lat: number, lon: number): { azimuth: number; altitude: number } {
  const lw = RAD * -lon;
  const phi = RAD * lat;
  const d = toDays(date);
  const c = sunCoords(d);
  const H = siderealTime(d, lw) - c.ra;

  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: altitude(H, phi, c.dec),
  };
}

// Sun times calculation
const J0 = 0.0009;

/**
 * Get Julian cycle
 */
function julianCycle(d: number, lw: number): number {
  return Math.round(d - J0 - lw / (2 * PI));
}

/**
 * Get approximate transit
 */
function approxTransit(Ht: number, lw: number, n: number): number {
  return J0 + (Ht + lw) / (2 * PI) + n;
}

/**
 * Get solar transit J
 */
function solarTransitJ(ds: number, M: number, L: number): number {
  return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L);
}

/**
 * Get hour angle
 */
function hourAngle(h: number, phi: number, d: number): number {
  return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d)));
}

/**
 * Get observer angle for altitude correction
 */
function observerAngle(height: number): number {
  return -2.076 * Math.sqrt(height) / 60;
}

/**
 * Get time for a given angle
 */
function getSetJ(h: number, lw: number, phi: number, dec: number, n: number, M: number, L: number): number {
  const w = hourAngle(h, phi, dec);
  const a = approxTransit(w, lw, n);
  return solarTransitJ(a, M, L);
}

// Sun times configuration
// Angle below horizon for different events
const TIMES = {
  sunrise: -0.833,      // sunrise (top edge of sun at horizon, refraction corrected)
  sunset: -0.833,       // sunset
  sunriseEnd: -0.3,     // sunrise ends (bottom edge of sun at horizon)
  sunsetStart: -0.3,    // sunset starts
  dawn: -6,             // civil dawn
  dusk: -6,             // civil dusk
  nauticalDawn: -12,    // nautical dawn
  nauticalDusk: -12,    // nautical dusk
  nightEnd: -18,        // astronomical dawn
  night: -18,           // astronomical dusk (night starts)
  goldenHourEnd: 6,     // golden hour end (morning)
  goldenHour: 6,        // golden hour start (evening)
};

/**
 * Refine a sunrise/sunset estimate using bisection on actual sun altitude.
 */
function refineSunEvent(
  estimate: Date,
  lat: number,
  lon: number,
  targetAlt: number,
  isRising: boolean,
): Date {
  const WINDOW_MS = 20 * 60 * 1000;
  let lo = new Date(estimate.getTime() - WINDOW_MS);
  let hi = new Date(estimate.getTime() + WINDOW_MS);

  const altLo = getSunPosition(lo, lat, lon).altitude;
  const altHi = getSunPosition(hi, lat, lon).altitude;

  if (isRising) {
    if (altLo >= targetAlt || altHi <= targetAlt) return estimate;
  } else {
    if (altLo <= targetAlt || altHi >= targetAlt) return estimate;
  }

  for (let i = 0; i < 20; i++) {
    const mid = new Date((lo.getTime() + hi.getTime()) / 2);
    const altMid = getSunPosition(mid, lat, lon).altitude;

    if (isRising) {
      if (altMid < targetAlt) lo = mid; else hi = mid;
    } else {
      if (altMid > targetAlt) lo = mid; else hi = mid;
    }
  }

  return new Date((lo.getTime() + hi.getTime()) / 2);
}

/**
 * Calculate sun times for a given date and location
 */
function getSunTimes(date: Date, lat: number, lon: number, height = 0): Record<string, Date | null> {
  const lw = RAD * -lon;
  const phi = RAD * lat;

  const dh = observerAngle(height);
  const d = toDays(date);
  const n = julianCycle(d + 0.5 + lw / (2 * PI), lw);
  const ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds);
  const L = eclipticLongitude(M);
  const dec = declination(L, 0);
  const Jnoon = solarTransitJ(ds, M, L);

  const result: Record<string, Date | null> = {
    solarNoon: jdToDate(Jnoon),
    nadir: jdToDate(Jnoon - 0.5),
  };

  for (const [name, angle] of Object.entries(TIMES)) {
    const h = (angle + dh) * RAD;

    try {
      const cosH = (sin(h) - sin(phi) * sin(dec)) / (cos(phi) * cos(dec));

      if (cosH > 1 || cosH < -1) {
        result[name] = null;
        continue;
      }

      const Jset = getSetJ(h, lw, phi, dec, n, M, L);

      if (name.endsWith('End') || name === 'goldenHourEnd') {
        result[name] = jdToDate(Jnoon - (Jset - Jnoon));
      } else if (name.startsWith('sunrise') || name === 'dawn' || name === 'nauticalDawn' || name === 'nightEnd') {
        result[name] = jdToDate(Jnoon - (Jset - Jnoon));
      } else {
        result[name] = jdToDate(Jset);
      }
    } catch {
      result[name] = null;
    }
  }

  const sunriseTargetAlt = (TIMES.sunrise + dh) * RAD;
  const sunsetTargetAlt = (TIMES.sunset + dh) * RAD;

  if (result.sunrise) {
    result.sunrise = refineSunEvent(result.sunrise, lat, lon, sunriseTargetAlt, true);
  }
  if (result.sunset) {
    result.sunset = refineSunEvent(result.sunset, lat, lon, sunsetTargetAlt, false);
  }

  return result;
}

/**
 * Get sunrise time for a date and location
 */
export function getSunrise(date: Date, lat: number, lon: number, height = 0): Date | null {
  const times = getSunTimes(date, lat, lon, height);
  return times.sunrise;
}

/**
 * Get sunset time for a date and location
 */
export function getSunset(date: Date, lat: number, lon: number, height = 0): Date | null {
  const times = getSunTimes(date, lat, lon, height);
  return times.sunset;
}

/**
 * Get solar noon for a date and location
 */
export function getSolarNoon(date: Date, lat: number, lon: number, height = 0): Date | null {
  const times = getSunTimes(date, lat, lon, height);
  return times.solarNoon;
}

// ============================================================================
// Moon calculations (Meeus Chapter 47 - ELP 2000-82)
// ============================================================================

// Longitude/distance coefficients: [D, M, M', F, Sl, Sr]
const LR_TABLE: number[][] = [
  [0, 0, 1, 0, 6288774, -20905355],
  [2, 0, -1, 0, 1274027, -3699111],
  [2, 0, 0, 0, 658314, -2955968],
  [0, 0, 2, 0, 213618, -569925],
  [0, 1, 0, 0, -185116, 48888],
  [0, 0, 0, 2, -114332, -3149],
  [2, 0, -2, 0, 58793, 246158],
  [2, -1, -1, 0, 57066, -152138],
  [2, 0, 1, 0, 53322, -170733],
  [2, -1, 0, 0, 45758, -204586],
  [0, 1, -1, 0, -40923, -129620],
  [1, 0, 0, 0, -34720, 108743],
  [0, 1, 1, 0, -30383, 104755],
  [2, 0, 0, -2, 15327, 10321],
  [0, 0, 1, 2, -12528, 0],
  [0, 0, 1, -2, 10980, 79661],
  [4, 0, -1, 0, 10675, -34782],
  [0, 0, 3, 0, 10034, -23210],
  [4, 0, -2, 0, 8548, -21636],
  [2, 1, -1, 0, -7888, 24208],
  [2, 1, 0, 0, -6766, 30824],
  [1, 0, -1, 0, -5163, -8379],
  [1, 1, 0, 0, 4987, -16675],
  [2, -1, 1, 0, 4036, -12831],
  [2, 0, 2, 0, 3994, -10445],
  [4, 0, 0, 0, 3861, -11650],
  [2, 0, -3, 0, 3665, 14403],
  [0, 1, -2, 0, -2689, -7003],
  [2, 0, -1, 2, -2602, 0],
  [2, -1, -2, 0, 2390, 10056],
  [1, 0, 1, 0, -2348, 6322],
  [2, -2, 0, 0, 2236, -9884],
  [0, 1, 2, 0, -2120, 5751],
  [0, 2, 0, 0, -2069, 0],
  [2, -2, -1, 0, 2048, -4950],
  [2, 0, 1, -2, -1773, 4130],
  [2, 0, 0, 2, -1595, 0],
  [4, -1, -1, 0, 1215, -3958],
  [0, 0, 2, 2, -1110, 0],
  [3, 0, -1, 0, -892, 3258],
  [2, 1, 1, 0, -810, 2616],
  [4, -1, -2, 0, 759, -1897],
  [0, 2, -1, 0, -713, -2117],
  [2, 2, -1, 0, -700, 2354],
  [2, 1, -2, 0, 691, 0],
  [2, -1, 0, -2, 596, 0],
  [4, 0, 1, 0, 549, -1423],
  [0, 0, 4, 0, 537, -1117],
  [4, -1, 0, 0, 520, -1571],
  [1, 0, -2, 0, -487, -1739],
  [2, 1, 0, -2, -399, 0],
  [0, 0, 2, -2, -381, -4421],
  [1, 1, 1, 0, 351, 0],
  [3, 0, -2, 0, -340, 0],
  [4, 0, -3, 0, 330, 0],
  [2, -1, 2, 0, 327, 0],
  [0, 2, 1, 0, -323, 1165],
  [1, 1, -1, 0, 299, 0],
  [2, 0, 3, 0, 294, 0],
  [2, 0, -1, -2, 0, 8752],
];

// Latitude coefficients: [D, M, M', F, Sb]
const B_TABLE: number[][] = [
  [0, 0, 0, 1, 5128122],
  [0, 0, 1, 1, 280602],
  [0, 0, 1, -1, 277693],
  [2, 0, 0, -1, 173237],
  [2, 0, -1, 1, 55413],
  [2, 0, -1, -1, 46271],
  [2, 0, 0, 1, 32573],
  [0, 0, 2, 1, 17198],
  [2, 0, 1, -1, 9266],
  [0, 0, 2, -1, 8822],
  [2, -1, 0, -1, 8216],
  [2, 0, -2, -1, 4324],
  [2, 0, 1, 1, 4200],
  [2, 1, 0, -1, -3359],
  [2, -1, -1, 1, 2463],
  [2, -1, 0, 1, 2211],
  [2, -1, -1, -1, 2065],
  [0, 1, -1, -1, -1870],
  [4, 0, -1, -1, 1828],
  [0, 1, 0, 1, -1794],
  [0, 0, 0, 3, -1749],
  [0, 1, -1, 1, -1565],
  [1, 0, 0, 1, -1491],
  [0, 1, 1, 1, -1475],
  [0, 1, 1, -1, -1410],
  [0, 1, 0, -1, -1344],
  [1, 0, 0, -1, -1335],
  [0, 0, 3, 1, 1107],
  [4, 0, 0, -1, 1021],
  [4, 0, -1, 1, 833],
  [0, 0, 1, -3, 777],
  [4, 0, -2, 1, 671],
  [2, 0, 0, -3, 607],
  [2, 0, 2, -1, 596],
  [2, -1, 1, -1, 491],
  [2, 0, -2, 1, -451],
  [0, 0, 3, -1, 439],
  [2, 0, 2, 1, 422],
  [2, 0, -3, -1, 421],
  [2, 1, -1, 1, -366],
  [2, 1, 0, 1, -351],
  [4, 0, 0, 1, 331],
  [2, -1, 1, 1, 315],
  [2, -2, 0, -1, 302],
  [0, 0, 1, 3, -283],
  [2, 1, 1, -1, -229],
  [1, 1, 0, -1, 223],
  [1, 1, 0, 1, 223],
  [0, 1, -2, -1, -220],
  [2, 1, -1, -1, -220],
  [1, 0, 1, 1, -185],
  [2, -1, -2, -1, 181],
  [0, 1, 2, 1, -177],
  [4, 0, -2, -1, 176],
  [4, -1, -1, -1, 166],
  [1, 0, 1, -1, -164],
  [4, 0, 1, -1, 132],
  [1, 0, -1, -1, -119],
  [4, -1, 0, -1, 115],
  [2, -2, 0, 1, 107],
];

/**
 * Moon geocentric coordinates using Meeus Chapter 47 (ELP 2000-82).
 */
function moonCoords(d: number): { ra: number; dec: number; dist: number } {
  const T = d / 36525;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;

  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2
    + T3 / 538841 - T4 / 65194000;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2
    + T3 / 545868 - T4 / 113065000;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2
    + T3 / 24490000;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2
    + T3 / 69699 - T4 / 14712000;
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T2
    - T3 / 3526000 + T4 / 863310000;

  const A1 = 119.75 + 131.849 * T;
  const A2 = 53.09 + 479264.290 * T;
  const A3 = 313.45 + 481266.484 * T;

  const Dr = D * RAD, Mr = M * RAD, Mpr = Mp * RAD, Fr = F * RAD;

  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const E2 = E * E;

  let sumL = 0;
  let sumR = 0;
  for (const row of LR_TABLE) {
    const arg = row[0] * Dr + row[1] * Mr + row[2] * Mpr + row[3] * Fr;
    const mAbs = Math.abs(row[1]);
    const eCorr = mAbs === 2 ? E2 : mAbs === 1 ? E : 1;
    sumL += row[4] * eCorr * sin(arg);
    sumR += row[5] * eCorr * cos(arg);
  }

  let sumB = 0;
  for (const row of B_TABLE) {
    const arg = row[0] * Dr + row[1] * Mr + row[2] * Mpr + row[3] * Fr;
    const mAbs = Math.abs(row[1]);
    const eCorr = mAbs === 2 ? E2 : mAbs === 1 ? E : 1;
    sumB += row[4] * eCorr * sin(arg);
  }

  const A1r = A1 * RAD, A2r = A2 * RAD, A3r = A3 * RAD;
  const LpFr = Lp * RAD - Fr;
  sumL += 3958 * sin(A1r) + 1962 * sin(LpFr) + 318 * sin(A2r);
  sumB += -2235 * sin(Lp * RAD) + 382 * sin(A3r) + 175 * sin(A1r - Fr)
    + 175 * sin(A1r + Fr) + 127 * sin(Lp * RAD - Mpr)
    - 115 * sin(Lp * RAD + Mpr);

  const lambda = (Lp + sumL / 1000000) * RAD;
  const beta = (sumB / 1000000) * RAD;
  const dist = 385000.56 + sumR / 1000;

  const eps = (23.439291 - 0.0130042 * T) * RAD;

  return {
    ra: atan2(sin(lambda) * cos(eps) - tan(beta) * sin(eps), cos(lambda)),
    dec: asin(sin(beta) * cos(eps) + cos(beta) * sin(eps) * sin(lambda)),
    dist,
  };
}

/**
 * Get moon position at a given time (geocentric, with refraction).
 */
export function getMoonPosition(date: Date, lat: number, lon: number): {
  azimuth: number;
  altitude: number;
  distance: number;
  parallacticAngle: number;
} {
  const lw = RAD * -lon;
  const phi = RAD * lat;
  const d = toDays(date);
  const c = moonCoords(d);
  const H = siderealTime(d, lw) - c.ra;
  let h = altitude(H, phi, c.dec);

  h = h + RAD * 0.017 / tan(h + RAD * 10.26 / (h + RAD * 5.10));

  const pa = atan2(sin(H), tan(phi) * cos(c.dec) - sin(c.dec) * cos(H));

  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: h,
    distance: c.dist,
    parallacticAngle: pa,
  };
}

/**
 * Compute Moon's altitude above the rise/set threshold.
 */
function moonAltAboveHorizon(
  date: Date,
  phi: number,
  lw: number,
): number {
  const d = toDays(date);
  const c = moonCoords(d);
  const H = siderealTime(d, lw) - c.ra;
  const h_geo = altitude(H, phi, c.dec);

  const hp = asin(6378.14 / c.dist);
  const h0 = 0.7275 * hp - 34 / 60 * RAD;

  return h_geo - h0;
}

/**
 * Refine a moonrise/moonset estimate using bisection.
 */
function refineMoonEvent(
  estimate: Date,
  phi: number,
  lw: number,
  isRising: boolean,
): Date {
  const WINDOW_MS = 30 * 60 * 1000;
  let lo = new Date(estimate.getTime() - WINDOW_MS);
  let hi = new Date(estimate.getTime() + WINDOW_MS);

  const altLo = moonAltAboveHorizon(lo, phi, lw);
  const altHi = moonAltAboveHorizon(hi, phi, lw);

  if (isRising) {
    if (altLo >= 0 || altHi <= 0) return estimate;
  } else {
    if (altLo <= 0 || altHi >= 0) return estimate;
  }

  for (let i = 0; i < 20; i++) {
    const mid = new Date((lo.getTime() + hi.getTime()) / 2);
    const altMid = moonAltAboveHorizon(mid, phi, lw);
    if (isRising) {
      if (altMid < 0) lo = mid; else hi = mid;
    } else {
      if (altMid > 0) lo = mid; else hi = mid;
    }
  }
  return new Date((lo.getTime() + hi.getTime()) / 2);
}

/**
 * Calculate moon rise/set times using iterative search with parallax.
 */
function getMoonTimes(date: Date, lat: number, lon: number, inUTC = false): {
  rise: Date | null;
  set: Date | null;
  alwaysUp: boolean;
  alwaysDown: boolean;
} {
  const t = new Date(date);
  if (inUTC) {
    t.setUTCHours(0, 0, 0, 0);
  } else {
    t.setHours(0, 0, 0, 0);
  }

  const approxOffsetHours = Math.round(lon / 15);
  const localMidnightMs = t.getTime() - approxOffsetHours * 3600000 - 1 * 3600000;
  const localEndMs = localMidnightMs + 26 * 3600000;
  const searchStart = new Date(localMidnightMs - 3 * 3600000);

  const phi = RAD * lat;
  const lw = RAD * -lon;

  let h0 = moonAltAboveHorizon(searchStart, phi, lw);
  let rise: Date | null = null;
  let set: Date | null = null;

  for (let i = 1; i <= 30; i += 2) {
    const t1 = new Date(searchStart.getTime() + i * 3600000);
    const t2 = new Date(searchStart.getTime() + (i + 1) * 3600000);

    const h1 = moonAltAboveHorizon(t1, phi, lw);
    const h2 = moonAltAboveHorizon(t2, phi, lw);

    const a = (h0 + h2) / 2 - h1;
    const b = (h2 - h0) / 2;
    const xe = -b / (2 * a);
    const ye = (a * xe + b) * xe + h1;
    const disc = b * b - 4 * a * h1;
    let roots = 0;
    let x1 = 0, x2 = 0;

    if (disc >= 0) {
      const dx = Math.sqrt(disc) / (Math.abs(a) * 2);
      x1 = xe - dx;
      x2 = xe + dx;
      if (Math.abs(x1) <= 1) roots++;
      if (Math.abs(x2) <= 1) roots++;
      if (x1 < -1) x1 = x2;
    }

    if (roots === 1) {
      const candidate = new Date(searchStart.getTime() + (i + x1) * 3600000);
      const ms = candidate.getTime();
      if (ms >= localMidnightMs && ms < localEndMs) {
        if (h0 < 0 && !rise) {
          rise = candidate;
        } else if (h0 >= 0 && !set) {
          set = candidate;
        }
      }
    } else if (roots === 2) {
      const riseCandidate = new Date(searchStart.getTime() + (i + (ye < 0 ? x2 : x1)) * 3600000);
      const setCandidate = new Date(searchStart.getTime() + (i + (ye < 0 ? x1 : x2)) * 3600000);
      if (!rise && riseCandidate.getTime() >= localMidnightMs && riseCandidate.getTime() < localEndMs) {
        rise = riseCandidate;
      }
      if (!set && setCandidate.getTime() >= localMidnightMs && setCandidate.getTime() < localEndMs) {
        set = setCandidate;
      }
    }

    if (rise && set) break;
    h0 = h2;
  }

  if (rise) rise = refineMoonEvent(rise, phi, lw, true);
  if (set) set = refineMoonEvent(set, phi, lw, false);

  return {
    rise,
    set,
    alwaysUp: !rise && !set && h0 > 0,
    alwaysDown: !rise && !set && h0 <= 0,
  };
}

/**
 * Get moonrise time for a date and location
 */
export function getMoonrise(date: Date, lat: number, lon: number): Date | null {
  return getMoonTimes(date, lat, lon).rise;
}

/**
 * Get moonset time for a date and location
 */
export function getMoonset(date: Date, lat: number, lon: number): Date | null {
  return getMoonTimes(date, lat, lon).set;
}

// ============================================================================
// Utility functions
// ============================================================================

/**
 * Format duration in milliseconds to "Xh Ym" string
 */
export function formatDuration(ms: number): string {
  const totalMinutes = Math.round(ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

/**
 * Convert degrees to hours, minutes, seconds
 */
export function degreesToHMS(degrees: number): { hours: number; minutes: number; seconds: number } {
  const totalHours = degrees / 15;
  const hours = Math.floor(totalHours);
  const remainingMinutes = (totalHours - hours) * 60;
  const minutes = Math.floor(remainingMinutes);
  const seconds = Math.round((remainingMinutes - minutes) * 60);
  return { hours, minutes, seconds };
}
