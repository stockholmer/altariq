/**
 * Hijri Multi-Criterion Engine
 *
 * Evaluates 8 crescent visibility criteria for determining the start
 * of Islamic (Hijri) months. Each criterion represents a different
 * community's method for new month determination.
 *
 * Criteria range from purely arithmetic (tabular) to complex
 * observational models (Yallop, Odeh).
 */

import {
  computeCrescentParams,
  computeVisibility,
  yallopZone,
  type CrescentParams,
  type CrescentVisibility,
} from "./hijri-astronomy";

// ============================================================================
// Types
// ============================================================================

export type CriterionId =
  | "umm_al_qura"
  | "isna"
  | "mabims"
  | "yallop"
  | "odeh"
  | "pakistan"
  | "turkey"
  | "tabular";

export interface CriterionResult {
  /** Which criterion was evaluated */
  criterion: CriterionId;
  /** Whether the new month starts on the NEXT day (evening sighting -> next civil day) */
  new_month_starts: boolean;
  /** Human-readable explanation */
  reason: string;
  /** For probabilistic criteria: visibility zone/category */
  zone?: string;
  /** Confidence: "certain" for deterministic, "probable"/"possible" for probabilistic */
  confidence: "certain" | "probable" | "possible" | "unlikely";
  /** Raw crescent visibility data (null for tabular) */
  visibility?: CrescentVisibility;
  /** Raw crescent params (null for tabular) */
  params?: CrescentParams;
}

export interface CriterionMeta {
  id: CriterionId;
  name: string;
  description: string;
  type: "deterministic" | "probabilistic" | "arithmetic";
  region: string;
  fixed_location?: { lat: number; lon: number; name: string };
}

// ============================================================================
// Criterion Metadata
// ============================================================================

export const CRITERIA: Record<CriterionId, CriterionMeta> = {
  umm_al_qura: {
    id: "umm_al_qura",
    name: "Umm al-Qura",
    description:
      "Saudi Arabia official calendar. New month if conjunction before sunset AND moonset after sunset at Mecca.",
    type: "deterministic",
    region: "Saudi Arabia, Gulf states",
    fixed_location: { lat: 21.4225, lon: 39.8262, name: "Mecca" },
  },
  isna: {
    id: "isna",
    name: "ISNA / FCNA",
    description:
      "Islamic Society of North America. Elongation >= 8 deg AND moon altitude >= 5 deg at sunset.",
    type: "deterministic",
    region: "North America",
  },
  mabims: {
    id: "mabims",
    name: "MABIMS",
    description:
      "SE Asian standard (Malaysia, Indonesia, Brunei, Singapore). Moon alt > 3 deg, elongation > 6.4 deg, age > 8 hours.",
    type: "deterministic",
    region: "Southeast Asia",
  },
  yallop: {
    id: "yallop",
    name: "Yallop 1997",
    description:
      "Probabilistic model using q-value. Zones A (easy) through F (impossible).",
    type: "probabilistic",
    region: "Academic / international",
  },
  odeh: {
    id: "odeh",
    name: "Odeh 2004",
    description:
      "Improved probabilistic model. Topocentric ARCV vs W boundary curve.",
    type: "probabilistic",
    region: "Academic / international",
  },
  pakistan: {
    id: "pakistan",
    name: "Pakistan",
    description:
      "Pakistan Ruet-e-Hilal Committee criteria. Alt >= 6.5 deg, W >= 0.17', illum >= 0.8% OR elong >= 9 deg, lag >= 38 min.",
    type: "deterministic",
    region: "Pakistan",
  },
  turkey: {
    id: "turkey",
    name: "Turkey / Diyanet",
    description:
      "Turkish Presidency of Religious Affairs. Conjunction before sunset AND moonset after sunset at Ankara.",
    type: "deterministic",
    region: "Turkey",
    fixed_location: { lat: 39.9334, lon: 32.8597, name: "Ankara" },
  },
  tabular: {
    id: "tabular",
    name: "Tabular (Arithmetic)",
    description:
      "30-year cycle with alternating 30/29 day months. No astronomy needed. Used as fallback.",
    type: "arithmetic",
    region: "Universal (computational)",
  },
};

// ============================================================================
// Individual Criterion Evaluators
// ============================================================================

/**
 * Umm al-Qura: conjunction before sunset AND moonset after sunset at Mecca.
 * Uses fixed location: Mecca (21.4225N, 39.8262E).
 */
function evaluateUmmAlQura(
  dateStr: string,
  _lat: number,
  _lon: number,
  conjunctionJdTT: number,
): CriterionResult {
  // Always evaluate at Mecca
  const meccaLat = 21.4225;
  const meccaLon = 39.8262;

  const params = computeCrescentParams(dateStr, meccaLat, meccaLon, conjunctionJdTT);
  if (!params) {
    return {
      criterion: "umm_al_qura",
      new_month_starts: false,
      reason: "No sunset at Mecca (should not happen)",
      confidence: "certain",
    };
  }

  const visibility = computeVisibility(params);

  // Conjunction must be before sunset (in UT)
  const conjUT = conjunctionJdTT - 69.7 / 86400; // approximate TT->UT
  const conjBeforeSunset = conjUT < params.sunset_jd;

  // Moonset must be after sunset
  const moonsetAfterSunset =
    params.moonset_jd !== null && params.moonset_jd > params.sunset_jd;

  const starts = conjBeforeSunset && moonsetAfterSunset;

  let reason: string;
  if (starts) {
    reason = `Conjunction before sunset and moonset after sunset at Mecca. Lag: ${visibility.lag_minutes.toFixed(1)} min.`;
  } else if (!conjBeforeSunset) {
    reason = "Conjunction occurs after sunset at Mecca.";
  } else {
    reason = "Moon sets before sunset at Mecca.";
  }

  return {
    criterion: "umm_al_qura",
    new_month_starts: starts,
    reason,
    confidence: "certain",
    visibility,
    params,
  };
}

/**
 * ISNA/FCNA: elongation >= 8 deg AND moon altitude >= 5 deg at sunset.
 * Location-dependent (observer's location).
 */
function evaluateISNA(
  dateStr: string,
  lat: number,
  lon: number,
  conjunctionJdTT: number,
): CriterionResult {
  const params = computeCrescentParams(dateStr, lat, lon, conjunctionJdTT);
  if (!params) {
    return {
      criterion: "isna",
      new_month_starts: false,
      reason: "No sunset at observer location.",
      confidence: "certain",
    };
  }

  const visibility = computeVisibility(params);

  const elongOk = visibility.ARCL >= 8;
  const altOk = params.moon_alt >= 5;
  const starts = elongOk && altOk;

  let reason: string;
  if (starts) {
    reason = `Elongation ${visibility.ARCL.toFixed(1)} deg >= 8 deg, moon alt ${params.moon_alt.toFixed(1)} deg >= 5 deg.`;
  } else {
    const parts: string[] = [];
    if (!elongOk) parts.push(`elongation ${visibility.ARCL.toFixed(1)} deg < 8 deg`);
    if (!altOk) parts.push(`moon alt ${params.moon_alt.toFixed(1)} deg < 5 deg`);
    reason = `Crescent not visible: ${parts.join(", ")}.`;
  }

  return {
    criterion: "isna",
    new_month_starts: starts,
    reason,
    confidence: "certain",
    visibility,
    params,
  };
}

/**
 * MABIMS (2021 revised): moon alt > 3 deg, elongation > 6.4 deg, age > 8 hours.
 * Location-dependent.
 */
function evaluateMABIMS(
  dateStr: string,
  lat: number,
  lon: number,
  conjunctionJdTT: number,
): CriterionResult {
  const params = computeCrescentParams(dateStr, lat, lon, conjunctionJdTT);
  if (!params) {
    return {
      criterion: "mabims",
      new_month_starts: false,
      reason: "No sunset at observer location.",
      confidence: "certain",
    };
  }

  const visibility = computeVisibility(params);

  const altOk = params.moon_alt > 3;
  const elongOk = visibility.ARCL > 6.4;
  const ageOk = visibility.moon_age_hours > 8;
  const starts = altOk && elongOk && ageOk;

  let reason: string;
  if (starts) {
    reason = `Alt ${params.moon_alt.toFixed(1)} > 3 deg, elong ${visibility.ARCL.toFixed(1)} > 6.4 deg, age ${visibility.moon_age_hours.toFixed(1)}h > 8h.`;
  } else {
    const parts: string[] = [];
    if (!altOk) parts.push(`alt ${params.moon_alt.toFixed(1)} <= 3 deg`);
    if (!elongOk) parts.push(`elong ${visibility.ARCL.toFixed(1)} <= 6.4 deg`);
    if (!ageOk) parts.push(`age ${visibility.moon_age_hours.toFixed(1)}h <= 8h`);
    reason = `MABIMS criteria not met: ${parts.join(", ")}.`;
  }

  return {
    criterion: "mabims",
    new_month_starts: starts,
    reason,
    confidence: "certain",
    visibility,
    params,
  };
}

/**
 * Yallop 1997: probabilistic q-value classification.
 * Zones A-F. New month if zone A or B.
 */
function evaluateYallop(
  dateStr: string,
  lat: number,
  lon: number,
  conjunctionJdTT: number,
): CriterionResult {
  const params = computeCrescentParams(dateStr, lat, lon, conjunctionJdTT);
  if (!params) {
    return {
      criterion: "yallop",
      new_month_starts: false,
      reason: "No sunset at observer location.",
      confidence: "certain",
    };
  }

  const visibility = computeVisibility(params);
  const zone = yallopZone(visibility.q_yallop);

  let confidence: "certain" | "probable" | "possible" | "unlikely";
  let starts: boolean;

  switch (zone) {
    case "A":
      starts = true;
      confidence = "certain";
      break;
    case "B":
      starts = true;
      confidence = "probable";
      break;
    case "C":
      starts = false;
      confidence = "possible";
      break;
    case "D":
      starts = false;
      confidence = "unlikely";
      break;
    default:
      starts = false;
      confidence = "unlikely";
  }

  const zoneDescriptions: Record<string, string> = {
    A: "Easily visible to the naked eye",
    B: "Visible under perfect conditions",
    C: "May need optical aid to find crescent",
    D: "Visible only with optical aid",
    E: "Not visible even with telescope",
    F: "Not visible (below Danjon limit)",
  };

  return {
    criterion: "yallop",
    new_month_starts: starts,
    reason: `Yallop zone ${zone} (q=${visibility.q_yallop.toFixed(3)}): ${zoneDescriptions[zone] || "Unknown"}.`,
    zone,
    confidence,
    visibility,
    params,
  };
}

/**
 * Odeh 2004: improved model using topocentric ARCV vs W.
 *
 * Boundary curves (W in arcminutes, ARCV in degrees):
 *   Zone A (visible): ARCV >= 12 - 0.4 * W (simplified)
 *   The actual Odeh curve is more complex; we use piecewise:
 *     if W >= 0.1': ARCV_limit = a + b*W + c*W^2
 *     a=5.493, b=12.7107, c=-2.6242 (from Odeh's paper)
 */
function evaluateOdeh(
  dateStr: string,
  lat: number,
  lon: number,
  conjunctionJdTT: number,
): CriterionResult {
  const params = computeCrescentParams(dateStr, lat, lon, conjunctionJdTT);
  if (!params) {
    return {
      criterion: "odeh",
      new_month_starts: false,
      reason: "No sunset at observer location.",
      confidence: "certain",
    };
  }

  const visibility = computeVisibility(params);

  // Odeh's ARCV limit as function of W (topocentric crescent width)
  const W = visibility.W;
  let arcvLimit: number;

  if (W < 0.05) {
    // Below Danjon limit - not visible
    arcvLimit = Infinity;
  } else {
    // Odeh 2004 polynomial: ARCV_limit = a - b*W + c*W^2
    arcvLimit = 5.493 + 12.7107 * W - 2.6242 * W * W;
  }

  // Determine zone
  let zone: string;
  let starts: boolean;
  let confidence: "certain" | "probable" | "possible" | "unlikely";

  const diff = visibility.ARCV - arcvLimit;

  if (diff >= 2) {
    zone = "A";
    starts = true;
    confidence = "certain";
  } else if (diff >= 0) {
    zone = "B";
    starts = true;
    confidence = "probable";
  } else if (diff >= -2) {
    zone = "C";
    starts = false;
    confidence = "possible";
  } else {
    zone = "D";
    starts = false;
    confidence = "unlikely";
  }

  const zoneDescriptions: Record<string, string> = {
    A: "Crescent visible by naked eye",
    B: "Crescent visible under perfect conditions",
    C: "Crescent needs optical aid",
    D: "Not visible",
  };

  return {
    criterion: "odeh",
    new_month_starts: starts,
    reason: `Odeh zone ${zone}: ARCV=${visibility.ARCV.toFixed(1)}, limit=${arcvLimit === Infinity ? "inf" : arcvLimit.toFixed(1)}, W=${W.toFixed(2)}'. ${zoneDescriptions[zone]}.`,
    zone,
    confidence,
    visibility,
    params,
  };
}

/**
 * Pakistan Ruet-e-Hilal: two alternative criteria (OR):
 *   1. alt >= 6.5 deg AND W >= 0.17' AND illum >= 0.8%
 *   2. elongation >= 9 deg AND lag >= 38 min
 */
function evaluatePakistan(
  dateStr: string,
  lat: number,
  lon: number,
  conjunctionJdTT: number,
): CriterionResult {
  const params = computeCrescentParams(dateStr, lat, lon, conjunctionJdTT);
  if (!params) {
    return {
      criterion: "pakistan",
      new_month_starts: false,
      reason: "No sunset at observer location.",
      confidence: "certain",
    };
  }

  const visibility = computeVisibility(params);

  // Criterion 1: alt + width + illumination
  const c1 =
    params.moon_alt >= 6.5 &&
    visibility.W >= 0.17 &&
    visibility.illumination_pct >= 0.8;

  // Criterion 2: elongation + lag
  const c2 = visibility.ARCL >= 9 && visibility.lag_minutes >= 38;

  const starts = c1 || c2;

  let reason: string;
  if (c1 && c2) {
    reason = "Both Pakistan criteria met.";
  } else if (c1) {
    reason = `Alt ${params.moon_alt.toFixed(1)} >= 6.5, W ${visibility.W.toFixed(2)}' >= 0.17, illum ${visibility.illumination_pct.toFixed(1)}% >= 0.8%.`;
  } else if (c2) {
    reason = `Elong ${visibility.ARCL.toFixed(1)} >= 9 deg, lag ${visibility.lag_minutes.toFixed(1)} >= 38 min.`;
  } else {
    reason = `Pakistan criteria not met: alt=${params.moon_alt.toFixed(1)}, W=${visibility.W.toFixed(2)}', illum=${visibility.illumination_pct.toFixed(1)}%, elong=${visibility.ARCL.toFixed(1)}, lag=${visibility.lag_minutes.toFixed(1)} min.`;
  }

  return {
    criterion: "pakistan",
    new_month_starts: starts,
    reason,
    confidence: "certain",
    visibility,
    params,
  };
}

/**
 * Turkey/Diyanet: conjunction before sunset AND moonset after sunset at Ankara.
 * Same logic as Umm al-Qura but for Ankara (39.9334N, 32.8597E).
 */
function evaluateTurkey(
  dateStr: string,
  _lat: number,
  _lon: number,
  conjunctionJdTT: number,
): CriterionResult {
  const ankaraLat = 39.9334;
  const ankaraLon = 32.8597;

  const params = computeCrescentParams(dateStr, ankaraLat, ankaraLon, conjunctionJdTT);
  if (!params) {
    return {
      criterion: "turkey",
      new_month_starts: false,
      reason: "No sunset at Ankara.",
      confidence: "certain",
    };
  }

  const visibility = computeVisibility(params);

  const conjUT = conjunctionJdTT - 69.7 / 86400;
  const conjBeforeSunset = conjUT < params.sunset_jd;
  const moonsetAfterSunset =
    params.moonset_jd !== null && params.moonset_jd > params.sunset_jd;

  const starts = conjBeforeSunset && moonsetAfterSunset;

  let reason: string;
  if (starts) {
    reason = `Conjunction before sunset and moonset after sunset at Ankara. Lag: ${visibility.lag_minutes.toFixed(1)} min.`;
  } else if (!conjBeforeSunset) {
    reason = "Conjunction occurs after sunset at Ankara.";
  } else {
    reason = "Moon sets before sunset at Ankara.";
  }

  return {
    criterion: "turkey",
    new_month_starts: starts,
    reason,
    confidence: "certain",
    visibility,
    params,
  };
}

/**
 * Tabular (arithmetic): 30-year cycle, no astronomy needed.
 * This is a stub that always returns false - actual tabular calculations
 * are done in hijri-calendar.ts using the arithmetic algorithm.
 */
function evaluateTabular(
  _dateStr: string,
  _lat: number,
  _lon: number,
  _conjunctionJdTT: number,
): CriterionResult {
  return {
    criterion: "tabular",
    new_month_starts: false,
    reason: "Tabular criterion uses arithmetic conversion (see hijri-calendar.ts).",
    confidence: "certain",
  };
}

// ============================================================================
// Main Evaluator
// ============================================================================

/**
 * Evaluate a single criterion for a given date/location/conjunction.
 *
 * @param criterionId - Which criterion to evaluate
 * @param dateStr - "YYYY-MM-DD" evening to check for crescent
 * @param lat - Observer latitude (ignored for fixed-location criteria)
 * @param lon - Observer longitude (ignored for fixed-location criteria)
 * @param conjunctionJdTT - JD (TT) of the new moon
 */
export function evaluateCriterion(
  criterionId: CriterionId,
  dateStr: string,
  lat: number,
  lon: number,
  conjunctionJdTT: number,
): CriterionResult {
  switch (criterionId) {
    case "umm_al_qura":
      return evaluateUmmAlQura(dateStr, lat, lon, conjunctionJdTT);
    case "isna":
      return evaluateISNA(dateStr, lat, lon, conjunctionJdTT);
    case "mabims":
      return evaluateMABIMS(dateStr, lat, lon, conjunctionJdTT);
    case "yallop":
      return evaluateYallop(dateStr, lat, lon, conjunctionJdTT);
    case "odeh":
      return evaluateOdeh(dateStr, lat, lon, conjunctionJdTT);
    case "pakistan":
      return evaluatePakistan(dateStr, lat, lon, conjunctionJdTT);
    case "turkey":
      return evaluateTurkey(dateStr, lat, lon, conjunctionJdTT);
    case "tabular":
      return evaluateTabular(dateStr, lat, lon, conjunctionJdTT);
    default:
      return {
        criterion: criterionId,
        new_month_starts: false,
        reason: `Unknown criterion: ${criterionId}`,
        confidence: "certain",
      };
  }
}

/**
 * Evaluate ALL criteria for a given date/location/conjunction.
 * Useful for comparison views.
 */
export function evaluateAllCriteria(
  dateStr: string,
  lat: number,
  lon: number,
  conjunctionJdTT: number,
): CriterionResult[] {
  const ids: CriterionId[] = [
    "umm_al_qura",
    "isna",
    "mabims",
    "yallop",
    "odeh",
    "pakistan",
    "turkey",
    "tabular",
  ];
  return ids.map((id) => evaluateCriterion(id, dateStr, lat, lon, conjunctionJdTT));
}

/**
 * Find the first evening (after conjunction) when the crescent is visible
 * for a given criterion, searching up to maxDays evenings.
 *
 * @returns dateStr of first sighting evening, or null
 */
export function findFirstSighting(
  criterionId: CriterionId,
  conjunctionJdTT: number,
  lat: number,
  lon: number,
  maxDays: number = 4,
): { dateStr: string; result: CriterionResult } | null {
  // Start from the day of conjunction (UT)
  const conjUT = conjunctionJdTT - 69.7 / 86400;
  const conjDate = new Date((conjUT - 2440587.5) * 86400000);

  for (let d = 0; d < maxDays; d++) {
    const checkDate = new Date(conjDate.getTime() + d * 86400000);
    const y = checkDate.getUTCFullYear();
    const m = String(checkDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(checkDate.getUTCDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${day}`;

    const result = evaluateCriterion(
      criterionId,
      dateStr,
      lat,
      lon,
      conjunctionJdTT,
    );

    if (result.new_month_starts) {
      return { dateStr, result };
    }
  }

  return null;
}
