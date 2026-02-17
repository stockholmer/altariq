/**
 * Comprehensive Compute Module Test Suite
 *
 * Validates prayer times, Hijri calendar, crescent criteria, and festival
 * computations across ~225 cities and 5 years of data (2025-2029).
 *
 * Run: npx tsx scripts/test-compute.ts
 * Exit 0 = all pass, 1 = failures, 2 = fatal error.
 */

// ============================================================================
// Imports
// ============================================================================

import {
  computePrayerTimes,
  computeQibla,
  computeQiblaDirection,
  computeQiblaDistance,
} from "../src/lib/compute/prayer-times";
import {
  gregorianToHijri,
  gregorianToHijriTabular,
  hijriToGregorianTabular,
  hijriMonthToGregorianRange,
  tabularMonthDays,
  tabularYearDays,
  isTabularLeapYear,
  HIJRI_MONTH_NAMES,
  ISLAMIC_EVENTS,
  computeMonthStarts,
  assignHijriNumbers,
  type HijriMonthStart,
} from "../src/lib/compute/hijri-calendar";
import { evaluateCriterion, evaluateAllCriteria, CRITERIA, type CriterionId } from "../src/lib/compute/hijri-criteria";
import {
  getIslamicFestivalsForDate,
  ISLAMIC_FESTIVAL_RULES,
  getFestivalsForHijriMonth,
  FESTIVAL_RULE_COUNT,
} from "../src/lib/compute/islamic-festivals";
import { NEW_MOONS } from "../src/lib/compute/new-moons";
import { PRAYER_CONVENTIONS } from "../src/lib/compute/constants";
import { ttToUT } from "../src/lib/compute/delta-t";
import { jdToDate } from "../src/lib/compute/sun-utils";
import { CITIES, type City } from "../src/lib/data/cities";
import type { PrayerConventionId, PrayerTimes } from "../src/lib/compute/types";

// ============================================================================
// Test Harness
// ============================================================================

interface TestFailure {
  suite: string;
  test: string;
  message: string;
}

const results = {
  passed: 0,
  failed: 0,
  failures: [] as TestFailure[],
  suiteCounts: {} as Record<string, { passed: number; failed: number }>,
};

let currentSuite = "";

function setSuite(name: string): void {
  currentSuite = name;
  if (!results.suiteCounts[name]) {
    results.suiteCounts[name] = { passed: 0, failed: 0 };
  }
}

function assert(condition: boolean, testName: string, message: string): void {
  if (condition) {
    results.passed++;
    results.suiteCounts[currentSuite].passed++;
  } else {
    results.failed++;
    results.suiteCounts[currentSuite].failed++;
    results.failures.push({ suite: currentSuite, test: testName, message });
  }
}

function assertApprox(
  actual: number,
  expected: number,
  tolerance: number,
  testName: string,
  message: string,
): void {
  const diff = Math.abs(actual - expected);
  assert(diff <= tolerance, testName, `${message} (got ${actual}, expected ~${expected}, diff=${diff.toFixed(4)}, tol=${tolerance})`);
}

function printSummary(): void {
  console.log("\n" + "=".repeat(70));
  console.log("TEST SUMMARY");
  console.log("=".repeat(70));

  for (const [suite, counts] of Object.entries(results.suiteCounts)) {
    const total = counts.passed + counts.failed;
    const status = counts.failed === 0 ? "PASS" : "FAIL";
    console.log(`  [${status}] ${suite}: ${counts.passed}/${total} passed`);
  }

  console.log("-".repeat(70));
  const total = results.passed + results.failed;
  console.log(`  TOTAL: ${results.passed}/${total} passed, ${results.failed} failed`);
  console.log("=".repeat(70));

  if (results.failures.length > 0) {
    const maxShow = 50;
    console.log(`\nFAILURES (showing first ${Math.min(maxShow, results.failures.length)} of ${results.failures.length}):\n`);
    for (const f of results.failures.slice(0, maxShow)) {
      console.log(`  [${f.suite}] ${f.test}`);
      console.log(`    ${f.message}`);
    }
    if (results.failures.length > maxShow) {
      console.log(`  ... and ${results.failures.length - maxShow} more`);
    }
  }
}

// ============================================================================
// Helpers
// ============================================================================

/** Parse "HH:MM" to minutes since midnight */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Check if a string matches HH:MM format */
function isValidTimeFormat(time: string | null): boolean {
  if (time === null) return false;
  return /^\d{2}:\d{2}$/.test(time);
}

/** Pad date parts */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Format a date as YYYY-MM-DD */
function fmtDate(y: number, m: number, d: number): string {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

/** Check if latitude is high enough that Fajr/Isha may be null in summer.
 *  With MWL (18° fajr), this starts around ~48.5° latitude near solstice. */
function isHighLat(lat: number): boolean {
  return Math.abs(lat) > 48;
}

/** Sample dates spread across a year */
const SAMPLE_DATES_PER_YEAR = [
  { m: 1, d: 1 },   // Winter
  { m: 2, d: 15 },
  { m: 3, d: 21 },  // Spring equinox
  { m: 6, d: 21 },  // Summer solstice
  { m: 9, d: 22 },  // Autumn equinox
  { m: 10, d: 15 },
  { m: 11, d: 15 },
  { m: 12, d: 21 }, // Winter solstice
];

const YEARS = [2025, 2026, 2027, 2028, 2029];

const CONVENTION_IDS: PrayerConventionId[] = ["mwl", "isna", "egypt", "makkah", "karachi", "tehran", "jafari"];

/** Find city by name */
function findCity(name: string): City | undefined {
  return CITIES.find((c) => c.city.toLowerCase() === name.toLowerCase());
}

// ============================================================================
// Suite 1: Prayer Times
// ============================================================================

function testPrayerTimes(): void {
  setSuite("1. Prayer Times");
  console.log("\n[Suite 1] Prayer Times - all cities x 8 dates x 5 years...");

  let count = 0;

  // Main test: all cities, all dates, all years, default convention
  for (const city of CITIES) {
    for (const year of YEARS) {
      for (const { m, d } of SAMPLE_DATES_PER_YEAR) {
        const dateStr = fmtDate(year, m, d);
        const label = `${city.city}/${dateStr}`;

        let times: PrayerTimes;
        try {
          times = computePrayerTimes(dateStr, city.lat, city.lon, city.timezone);
        } catch (e: any) {
          assert(false, label, `computePrayerTimes threw: ${e.message}`);
          continue;
        }

        const highLat = isHighLat(city.lat);
        const isSummer = (city.lat > 0 && (m >= 5 && m <= 8)) || (city.lat < 0 && (m === 12 || m <= 2));

        // Dhuhr should always be non-null
        assert(times.dhuhr !== null, label, "Dhuhr is null");

        if (times.dhuhr !== null) {
          assert(isValidTimeFormat(times.dhuhr), `${label}/dhuhr-fmt`, `Dhuhr format invalid: ${times.dhuhr}`);
        }

        // For non-high latitudes, all 6 prayer times should be non-null
        if (!highLat) {
          const keys: (keyof PrayerTimes)[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
          for (const key of keys) {
            assert(times[key] !== null, `${label}/${key}`, `${key} is null at lat ${city.lat} (threshold 48)`);
          }
        } else if (highLat && isSummer) {
          // Fajr/Isha may be null at high latitudes in summer - that's expected
          // But sunrise, dhuhr, asr, maghrib should still exist
          const requiredKeys: (keyof PrayerTimes)[] = ["sunrise", "dhuhr", "asr", "maghrib"];
          for (const key of requiredKeys) {
            assert(times[key] !== null, `${label}/${key}`, `${key} is null at high lat (not fajr/isha)`);
          }
        }

        // Chronological order check (only when all non-null)
        if (times.fajr && times.sunrise && times.dhuhr && times.asr && times.maghrib && times.isha) {
          const fajrM = timeToMinutes(times.fajr);
          const sunriseM = timeToMinutes(times.sunrise);
          const dhuhrM = timeToMinutes(times.dhuhr);
          const asrM = timeToMinutes(times.asr);
          const maghribM = timeToMinutes(times.maghrib);
          let ishaM = timeToMinutes(times.isha);

          // Isha can wrap past midnight (e.g. 00:06) at high latitudes in summer.
          // If Isha value is less than Maghrib, it means next day - add 24h.
          if (ishaM < maghribM) {
            ishaM += 1440;
          }

          const ordered = [fajrM, sunriseM, dhuhrM, asrM, maghribM, ishaM];
          let chronoOk = true;
          for (let i = 1; i < ordered.length; i++) {
            if (ordered[i] <= ordered[i - 1]) {
              chronoOk = false;
              break;
            }
          }
          assert(chronoOk, `${label}/chrono`, `Times not chronological: F=${times.fajr} SR=${times.sunrise} D=${times.dhuhr} A=${times.asr} M=${times.maghrib} I=${times.isha}`);
        }

        // HH:MM format validation for all non-null times
        const allKeys: (keyof PrayerTimes)[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "midnight"];
        for (const key of allKeys) {
          if (times[key] !== null) {
            assert(isValidTimeFormat(times[key]), `${label}/${key}-fmt`, `${key} format invalid: ${times[key]}`);
          }
        }

        // Plausibility ranges (non-high-latitude)
        if (!highLat && times.fajr && times.dhuhr && times.maghrib) {
          const fajrMin = timeToMinutes(times.fajr);
          const dhuhrMin = timeToMinutes(times.dhuhr);
          const maghribMin = timeToMinutes(times.maghrib);

          assert(fajrMin >= 60 && fajrMin <= 480, `${label}/fajr-range`, `Fajr ${times.fajr} outside 01:00-08:00`);
          assert(dhuhrMin >= 660 && dhuhrMin <= 900, `${label}/dhuhr-range`, `Dhuhr ${times.dhuhr} outside 11:00-15:00`);
          assert(maghribMin >= 900 && maghribMin <= 1320, `${label}/maghrib-range`, `Maghrib ${times.maghrib} outside 15:00-22:00`);
        }

        count++;
      }
    }
  }

  // Hanafi Asr >= Shafii Asr (test on subset of cities)
  console.log("  Checking Hanafi >= Shafii Asr...");
  const subsetCities = CITIES.filter((_, i) => i % 10 === 0);
  for (const city of subsetCities) {
    for (const year of YEARS) {
      for (const { m, d } of SAMPLE_DATES_PER_YEAR) {
        const dateStr = fmtDate(year, m, d);
        const label = `${city.city}/${dateStr}/asr-compare`;

        try {
          const shafii = computePrayerTimes(dateStr, city.lat, city.lon, city.timezone, "mwl", "shafii");
          const hanafi = computePrayerTimes(dateStr, city.lat, city.lon, city.timezone, "mwl", "hanafi");

          if (shafii.asr && hanafi.asr) {
            const sMin = timeToMinutes(shafii.asr);
            const hMin = timeToMinutes(hanafi.asr);
            assert(hMin >= sMin, label, `Hanafi Asr (${hanafi.asr}) < Shafii Asr (${shafii.asr})`);
          }
        } catch (e: any) {
          assert(false, label, `Asr compare threw: ${e.message}`);
        }
      }
    }
  }

  // All 7 conventions produce valid dhuhr for subset cities
  console.log("  Checking all 7 conventions produce valid dhuhr...");
  for (const city of subsetCities) {
    const dateStr = "2026-03-21";
    for (const convId of CONVENTION_IDS) {
      const label = `${city.city}/${convId}/dhuhr`;
      try {
        const times = computePrayerTimes(dateStr, city.lat, city.lon, city.timezone, convId);
        assert(times.dhuhr !== null, label, `Dhuhr null for convention ${convId}`);
        if (times.dhuhr) {
          assert(isValidTimeFormat(times.dhuhr), `${label}-fmt`, `Dhuhr format invalid: ${times.dhuhr}`);
        }
      } catch (e: any) {
        assert(false, label, `Convention ${convId} threw: ${e.message}`);
      }
    }
  }

  console.log(`  Tested ${count} city/date combinations + Asr/convention checks`);
}

// ============================================================================
// Suite 2: Qibla Direction
// ============================================================================

function testQibla(): void {
  setSuite("2. Qibla Direction");
  console.log("\n[Suite 2] Qibla Direction - all cities + known bearings...");

  // Test all cities
  for (const city of CITIES) {
    const label = `${city.city}/qibla`;

    try {
      const qibla = computeQibla(city.lat, city.lon);

      // Direction 0-360
      assert(
        qibla.direction >= 0 && qibla.direction <= 360,
        `${label}/dir-range`,
        `Direction ${qibla.direction} out of [0,360]`,
      );

      // Distance > 0 and < 20,015 km (half earth circumference)
      assert(
        qibla.distance_km >= 0 && qibla.distance_km < 20015,
        `${label}/dist-range`,
        `Distance ${qibla.distance_km} km out of range`,
      );
    } catch (e: any) {
      assert(false, label, `computeQibla threw: ${e.message}`);
    }
  }

  // Mecca distance ~0
  const meccaCity = findCity("Mecca");
  if (meccaCity) {
    const qMecca = computeQibla(meccaCity.lat, meccaCity.lon);
    assert(qMecca.distance_km < 1, "Mecca/dist-zero", `Mecca distance should be ~0, got ${qMecca.distance_km}`);
  }

  // Known bearing checks with +/- 5 degrees tolerance
  const knownBearings: { city: string; expected: number; tolerance: number }[] = [
    { city: "London", expected: 119, tolerance: 5 },
    { city: "Tokyo", expected: 293, tolerance: 5 },
    { city: "Sydney", expected: 278, tolerance: 5 },
    { city: "Jakarta", expected: 295, tolerance: 5 },
    { city: "Istanbul", expected: 152, tolerance: 5 },
    { city: "Islamabad", expected: 255, tolerance: 5 },
  ];

  for (const { city: cityName, expected, tolerance } of knownBearings) {
    const city = findCity(cityName);
    if (city) {
      const dir = computeQiblaDirection(city.lat, city.lon);
      assertApprox(dir, expected, tolerance, `${cityName}/bearing`, `Qibla bearing for ${cityName}`);
    }
  }

  // Test computeQiblaDistance directly
  for (const city of CITIES) {
    const dist = computeQiblaDistance(city.lat, city.lon);
    assert(dist >= 0, `${city.city}/dist-pos`, `Distance negative: ${dist}`);
    assert(dist < 20015, `${city.city}/dist-max`, `Distance too large: ${dist}`);
  }

  console.log(`  Tested ${CITIES.length} cities + known bearings`);
}

// ============================================================================
// Suite 3: Hijri Calendar
// ============================================================================

function testHijriCalendar(): void {
  setSuite("3. Hijri Calendar");
  console.log("\n[Suite 3] Hijri Calendar - daily conversions 2025-2029...");

  // Test every day of 2025-2029 with tabular conversion
  let dayCount = 0;

  for (const year of YEARS) {
    const isLeapGreg = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInYear = isLeapGreg ? 366 : 365;

    for (let dayOfYear = 1; dayOfYear <= daysInYear; dayOfYear++) {
      const date = new Date(Date.UTC(year, 0, dayOfYear));
      const m = date.getUTCMonth() + 1;
      const d = date.getUTCDate();
      const dateStr = fmtDate(year, m, d);
      const label = `hijri-tab/${dateStr}`;

      // Convert Gregorian -> Hijri (tabular)
      const hijri = gregorianToHijriTabular(year, m, d);

      // Valid Hijri ranges
      assert(hijri.month >= 1 && hijri.month <= 12, `${label}/month`, `Month ${hijri.month} out of [1,12]`);
      assert(hijri.day >= 1 && hijri.day <= 30, `${label}/day`, `Day ${hijri.day} out of [1,30]`);
      assert(hijri.year >= 1446 && hijri.year <= 1452, `${label}/year`, `Year ${hijri.year} out of [1446,1452]`);

      // Month info exists
      assert(hijri.month_info !== undefined, `${label}/month-info`, "month_info undefined");
      assert(hijri.month_info.number === hijri.month, `${label}/month-info-num`, `month_info.number ${hijri.month_info.number} != ${hijri.month}`);

      // Roundtrip: Greg -> Hijri -> Greg
      const greg = hijriToGregorianTabular(hijri.year, hijri.month, hijri.day);
      assert(
        greg.year === year && greg.month === m && greg.day === d,
        `${label}/roundtrip`,
        `Roundtrip failed: ${year}-${m}-${d} -> H(${hijri.year}/${hijri.month}/${hijri.day}) -> ${greg.year}-${greg.month}-${greg.day}`,
      );

      dayCount++;
    }
  }

  console.log(`  Tested ${dayCount} days for tabular conversion + roundtrip`);

  // Month lengths should be 29 or 30
  console.log("  Checking month lengths...");
  for (let hYear = 1446; hYear <= 1452; hYear++) {
    let yearTotal = 0;
    for (let hMonth = 1; hMonth <= 12; hMonth++) {
      const days = tabularMonthDays(hYear, hMonth);
      assert(days === 29 || days === 30, `monthDays/${hYear}/${hMonth}`, `Month length ${days} not 29 or 30`);
      yearTotal += days;
    }
    // Year totals: 354 or 355
    const expectedTotal = isTabularLeapYear(hYear) ? 355 : 354;
    assert(yearTotal === expectedTotal, `yearDays/${hYear}`, `Year total ${yearTotal} != expected ${expectedTotal}`);
    assert(tabularYearDays(hYear) === expectedTotal, `yearDaysFn/${hYear}`, `tabularYearDays(${hYear}) mismatch`);
  }

  // Consecutive Gregorian dates produce consecutive Hijri dates
  console.log("  Checking consecutive date continuity...");
  for (const year of YEARS) {
    const isLeapGreg = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInYear = isLeapGreg ? 366 : 365;

    let prevHijri = gregorianToHijriTabular(year, 1, 1);

    for (let dayOfYear = 2; dayOfYear <= daysInYear; dayOfYear++) {
      const date = new Date(Date.UTC(year, 0, dayOfYear));
      const m = date.getUTCMonth() + 1;
      const d = date.getUTCDate();

      const hijri = gregorianToHijriTabular(year, m, d);

      // Should be exactly 1 day after prev
      if (hijri.month === prevHijri.month && hijri.year === prevHijri.year) {
        assert(
          hijri.day === prevHijri.day + 1,
          `consecutive/${fmtDate(year, m, d)}`,
          `Not consecutive: prev=${prevHijri.day}, curr=${hijri.day}`,
        );
      } else {
        // Month or year changed - current day should be 1
        assert(
          hijri.day === 1,
          `consecutive-newmonth/${fmtDate(year, m, d)}`,
          `New month but day=${hijri.day}, expected 1`,
        );
      }

      prevHijri = hijri;
    }
  }

  // HIJRI_MONTH_NAMES has 12 entries
  assert(HIJRI_MONTH_NAMES.length === 12, "month-names-length", `HIJRI_MONTH_NAMES.length=${HIJRI_MONTH_NAMES.length}`);
  for (let i = 0; i < 12; i++) {
    assert(HIJRI_MONTH_NAMES[i].number === i + 1, `month-name-${i}`, `Month number mismatch at index ${i}`);
    assert(HIJRI_MONTH_NAMES[i].name.length > 0, `month-name-${i}/name`, "Empty month name");
  }

  // ISLAMIC_EVENTS exists and has entries
  assert(ISLAMIC_EVENTS.length > 0, "events-exist", "ISLAMIC_EVENTS is empty");

  // All 8 crescent criteria return valid results for representative cities
  console.log("  Checking crescent criteria...");
  const criteriaIds: CriterionId[] = ["umm_al_qura", "isna", "mabims", "yallop", "odeh", "pakistan", "turkey", "tabular"];
  const testCities = [findCity("Mecca"), findCity("London"), findCity("Jakarta"), findCity("Islamabad")].filter(Boolean) as City[];
  // Use a sample conjunction from 2025
  const sampleConjunction = NEW_MOONS[2025][0];

  for (const critId of criteriaIds) {
    for (const city of testCities) {
      const label = `criterion/${critId}/${city.city}`;
      try {
        const result = evaluateCriterion(critId, "2025-01-30", city.lat, city.lon, sampleConjunction);
        assert(result.criterion === critId, `${label}/id`, `Criterion ID mismatch: ${result.criterion}`);
        assert(typeof result.new_month_starts === "boolean", `${label}/bool`, "new_month_starts not boolean");
        assert(result.reason.length > 0, `${label}/reason`, "Empty reason");
        assert(
          ["certain", "probable", "possible", "unlikely"].includes(result.confidence),
          `${label}/confidence`,
          `Invalid confidence: ${result.confidence}`,
        );
      } catch (e: any) {
        assert(false, label, `evaluateCriterion threw: ${e.message}`);
      }
    }
  }

  // gregorianToHijri with empty monthStarts falls back to tabular
  const hijriFallback = gregorianToHijri("2025-06-15", []);
  const hijriDirect = gregorianToHijriTabular(2025, 6, 15);
  assert(
    hijriFallback.year === hijriDirect.year &&
    hijriFallback.month === hijriDirect.month &&
    hijriFallback.day === hijriDirect.day,
    "fallback-tabular",
    "gregorianToHijri with empty monthStarts should match tabular",
  );
}

// ============================================================================
// Suite 4: Festivals
// ============================================================================

function testFestivals(): void {
  setSuite("4. Festivals");
  console.log("\n[Suite 4] Festivals - rules, lookups, key festivals...");

  // Festival rule count
  assert(FESTIVAL_RULE_COUNT >= 28, "rule-count", `Only ${FESTIVAL_RULE_COUNT} rules, expected >= 28`);
  assert(ISLAMIC_FESTIVAL_RULES.length === FESTIVAL_RULE_COUNT, "rule-count-match", "FESTIVAL_RULE_COUNT mismatch");

  // All rules have valid structure
  for (const rule of ISLAMIC_FESTIVAL_RULES) {
    const label = `rule/${rule.id}`;
    assert(rule.id.length > 0, `${label}/id`, "Empty rule ID");
    assert(rule.name.length > 0, `${label}/name`, "Empty rule name");
    assert(rule.hijri_month >= 1 && rule.hijri_month <= 12, `${label}/month`, `Month ${rule.hijri_month} out of [1,12]`);
    assert(rule.hijri_day >= 1 && rule.hijri_day <= 30, `${label}/day`, `Day ${rule.hijri_day} out of [1,30]`);
    assert(rule.duration_days >= 1, `${label}/duration`, `Duration ${rule.duration_days} < 1`);
    assert(
      ["major", "significant", "observance"].includes(rule.importance),
      `${label}/importance`,
      `Invalid importance: ${rule.importance}`,
    );
    assert(rule.categories.length > 0, `${label}/categories`, "No categories");
    assert(rule.description.length > 0, `${label}/description`, "Empty description");
  }

  // Key festivals must exist in rules
  const keyFestivalIds = [
    "eid_al_fitr",
    "eid_al_adha",
    "ramadan_start",
    "ashura",
    "mawlid",
    "isra_miraj",
    "hijri_new_year",
    "laylat_al_qadr_27",
    "day_of_arafah",
  ];

  for (const id of keyFestivalIds) {
    const found = ISLAMIC_FESTIVAL_RULES.find((r) => r.id === id);
    assert(found !== undefined, `key-festival/${id}`, `Key festival ${id} not found in rules`);
  }

  // Key festivals found for each Hijri year (using getIslamicFestivalsForDate)
  const keyFestivalDates: { name: string; month: number; day: number }[] = [
    { name: "Eid al-Fitr", month: 10, day: 1 },
    { name: "Eid al-Adha", month: 12, day: 10 },
    { name: "Ramadan start", month: 9, day: 1 },
    { name: "Ashura", month: 1, day: 10 },
    { name: "Mawlid", month: 3, day: 12 },
    { name: "Isra Mi'raj", month: 7, day: 27 },
    { name: "Islamic New Year", month: 1, day: 1 },
  ];

  for (let hYear = 1447; hYear <= 1451; hYear++) {
    for (const { name, month, day } of keyFestivalDates) {
      const matches = getIslamicFestivalsForDate(month, day, hYear);
      assert(matches.length > 0, `festival-found/${name}/${hYear}`, `${name} not found for Hijri year ${hYear}`);
      if (matches.length > 0) {
        assert(matches[0].hijri_year === hYear, `festival-year/${name}/${hYear}`, `Year mismatch in match`);
      }
    }
  }

  // Multi-day events: Eid al-Fitr days 1-3
  const eidFitrRule = ISLAMIC_FESTIVAL_RULES.find((r) => r.id === "eid_al_fitr");
  assert(eidFitrRule !== undefined, "eid-fitr-exists", "Eid al-Fitr rule not found");
  if (eidFitrRule) {
    assert(eidFitrRule.duration_days === 3, "eid-fitr-duration", `Eid al-Fitr duration ${eidFitrRule.duration_days} != 3`);

    // Day 1: 1 Shawwal
    const day1 = getIslamicFestivalsForDate(10, 1, 1447);
    const eidMatch1 = day1.find((m) => m.rule.id === "eid_al_fitr");
    assert(eidMatch1 !== undefined, "eid-fitr-day1", "Eid al-Fitr not found on 1 Shawwal");
    if (eidMatch1) {
      assert(eidMatch1.day_of_event === 1, "eid-fitr-day1-num", `Day of event ${eidMatch1.day_of_event} != 1`);
    }

    // Day 2: 2 Shawwal
    const day2 = getIslamicFestivalsForDate(10, 2, 1447);
    const eidMatch2 = day2.find((m) => m.rule.id === "eid_al_fitr");
    assert(eidMatch2 !== undefined, "eid-fitr-day2", "Eid al-Fitr not found on 2 Shawwal");
    if (eidMatch2) {
      assert(eidMatch2.day_of_event === 2, "eid-fitr-day2-num", `Day of event ${eidMatch2.day_of_event} != 2`);
    }

    // Day 3: 3 Shawwal
    const day3 = getIslamicFestivalsForDate(10, 3, 1447);
    const eidMatch3 = day3.find((m) => m.rule.id === "eid_al_fitr");
    assert(eidMatch3 !== undefined, "eid-fitr-day3", "Eid al-Fitr not found on 3 Shawwal");
    if (eidMatch3) {
      assert(eidMatch3.day_of_event === 3, "eid-fitr-day3-num", `Day of event ${eidMatch3.day_of_event} != 3`);
    }
  }

  // Eid al-Adha multi-day
  const eidAdhaRule = ISLAMIC_FESTIVAL_RULES.find((r) => r.id === "eid_al_adha");
  assert(eidAdhaRule !== undefined, "eid-adha-exists", "Eid al-Adha rule not found");
  if (eidAdhaRule) {
    assert(eidAdhaRule.duration_days === 3, "eid-adha-duration", `Eid al-Adha duration ${eidAdhaRule.duration_days} != 3`);
  }

  // getFestivalsForHijriMonth returns correct festivals
  for (let month = 1; month <= 12; month++) {
    const festivals = getFestivalsForHijriMonth(month);
    for (const f of festivals) {
      assert(f.hijri_month === month, `month-filter/${month}/${f.id}`, `Festival ${f.id} has month ${f.hijri_month}, expected ${month}`);
    }
  }

  // Ramadan (month 9) should have at least the start and Laylat al-Qadr entries
  const ramadanFestivals = getFestivalsForHijriMonth(9);
  assert(ramadanFestivals.length >= 5, "ramadan-festivals-count", `Only ${ramadanFestivals.length} Ramadan festivals, expected >= 5`);

  // Ramadan length check via tabular: should be 29 or 30
  for (let hYear = 1446; hYear <= 1452; hYear++) {
    const ramadanDays = tabularMonthDays(hYear, 9);
    assert(
      ramadanDays === 29 || ramadanDays === 30,
      `ramadan-length/${hYear}`,
      `Ramadan ${hYear} is ${ramadanDays} days`,
    );
  }

  console.log(`  Tested ${FESTIVAL_RULE_COUNT} rules + key festivals + multi-day events`);
}

// ============================================================================
// Suite 5: Edge Cases
// ============================================================================

function testEdgeCases(): void {
  setSuite("5. Edge Cases");
  console.log("\n[Suite 5] Edge Cases - extreme latitudes, hemispheres, boundaries...");

  // ---- Extreme north cities ----
  const extremeNorthNames = ["Helsinki", "Stockholm", "Oslo", "Tallinn"];
  const extremeNorthCities = extremeNorthNames.map(findCity).filter(Boolean) as City[];

  for (const city of extremeNorthCities) {
    // Summer: null Fajr/Isha is acceptable
    const summerDate = "2026-06-21";
    const label = `extreme-north/${city.city}`;

    try {
      const summer = computePrayerTimes(summerDate, city.lat, city.lon, city.timezone);
      // Fajr/Isha may be null - that's OK
      // Sunrise, Dhuhr, Asr, Maghrib should still work
      assert(summer.dhuhr !== null, `${label}/summer-dhuhr`, "Dhuhr null in summer");
      assert(summer.sunrise !== null, `${label}/summer-sunrise`, "Sunrise null in summer");
      assert(summer.maghrib !== null, `${label}/summer-maghrib`, "Maghrib null in summer");
    } catch (e: any) {
      assert(false, `${label}/summer`, `Summer compute threw: ${e.message}`);
    }

    // Winter: all times should be valid
    const winterDate = "2026-01-15";
    try {
      const winter = computePrayerTimes(winterDate, city.lat, city.lon, city.timezone);
      const keys: (keyof PrayerTimes)[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
      for (const key of keys) {
        assert(winter[key] !== null, `${label}/winter-${key}`, `${key} null in winter`);
      }
    } catch (e: any) {
      assert(false, `${label}/winter`, `Winter compute threw: ${e.message}`);
    }
  }

  // ---- Southern hemisphere: seasons inverted ----
  console.log("  Checking southern hemisphere season inversion...");
  const southCities = ["Sydney", "Melbourne", "Auckland"].map(findCity).filter(Boolean) as City[];

  for (const city of southCities) {
    const label = `southern/${city.city}`;
    try {
      const june = computePrayerTimes("2026-06-21", city.lat, city.lon, city.timezone);
      const dec = computePrayerTimes("2026-12-21", city.lat, city.lon, city.timezone);

      if (june.maghrib && dec.maghrib) {
        const juneMaghrib = timeToMinutes(june.maghrib);
        const decMaghrib = timeToMinutes(dec.maghrib);
        // In southern hemisphere winter (June), sunset is earlier
        assert(
          juneMaghrib < decMaghrib,
          `${label}/season-inversion`,
          `June Maghrib (${june.maghrib}) should be earlier than Dec (${dec.maghrib})`,
        );
      }
    } catch (e: any) {
      assert(false, label, `Southern hemisphere threw: ${e.message}`);
    }
  }

  // ---- Date line cities ----
  console.log("  Checking date line cities...");
  const dateLineCities = ["Auckland", "Honolulu"].map(findCity).filter(Boolean) as City[];

  for (const city of dateLineCities) {
    const label = `dateline/${city.city}`;
    try {
      const times = computePrayerTimes("2026-03-21", city.lat, city.lon, city.timezone);
      assert(times.dhuhr !== null, `${label}/dhuhr`, "Dhuhr null at date line city");
      assert(times.sunrise !== null, `${label}/sunrise`, "Sunrise null at date line city");
      assert(times.maghrib !== null, `${label}/maghrib`, "Maghrib null at date line city");
    } catch (e: any) {
      assert(false, label, `Date line city threw: ${e.message}`);
    }
  }

  // ---- Equatorial cities: ~12h day length at equinox ----
  console.log("  Checking equatorial cities day length...");
  const equatorialCities = CITIES.filter((c) => Math.abs(c.lat) < 5);

  for (const city of equatorialCities) {
    const label = `equatorial/${city.city}`;
    try {
      const times = computePrayerTimes("2026-03-21", city.lat, city.lon, city.timezone);
      if (times.sunrise && times.maghrib) {
        const sunriseMin = timeToMinutes(times.sunrise);
        const maghribMin = timeToMinutes(times.maghrib);
        const dayLengthHours = (maghribMin - sunriseMin) / 60;
        // Equatorial day length should be ~12 hours (+/- 1 hour for practical tolerance)
        assertApprox(dayLengthHours, 12, 1, `${label}/daylength`, `Equatorial day length at equinox`);
      }
    } catch (e: any) {
      assert(false, label, `Equatorial city threw: ${e.message}`);
    }
  }

  // ---- Year boundaries: Dec 31 -> Jan 1 ----
  console.log("  Checking year boundaries...");
  for (const year of [2025, 2026, 2027, 2028]) {
    const dec31 = gregorianToHijriTabular(year, 12, 31);
    const jan1 = gregorianToHijriTabular(year + 1, 1, 1);
    const label = `year-boundary/${year}`;

    // Should be consecutive
    if (dec31.month === jan1.month && dec31.year === jan1.year) {
      assert(jan1.day === dec31.day + 1, `${label}/consecutive`, `Not consecutive across year boundary`);
    } else {
      assert(jan1.day === 1, `${label}/new-month`, `New month at year boundary but day=${jan1.day}`);
    }
  }

  // ---- Hijri year boundaries: Dhul Hijjah -> Muharram ----
  console.log("  Checking Hijri year boundaries...");
  for (let hYear = 1446; hYear <= 1451; hYear++) {
    const lastMonthDays = tabularMonthDays(hYear, 12);
    const lastDay = hijriToGregorianTabular(hYear, 12, lastMonthDays);
    const firstDay = hijriToGregorianTabular(hYear + 1, 1, 1);

    // First day of next year should be day after last day of current year
    const lastDate = new Date(Date.UTC(lastDay.year, lastDay.month - 1, lastDay.day));
    const firstDate = new Date(Date.UTC(firstDay.year, firstDay.month - 1, firstDay.day));
    const diffDays = Math.round((firstDate.getTime() - lastDate.getTime()) / 86400000);

    assert(
      diffDays === 1,
      `hijri-boundary/${hYear}`,
      `Gap between end of ${hYear} and start of ${hYear + 1}: ${diffDays} days`,
    );
  }

  // ---- New moon data exists for 2025-2029 ----
  console.log("  Checking new moon data...");
  for (const year of YEARS) {
    const moons = NEW_MOONS[year];
    assert(moons !== undefined, `new-moons/${year}/exists`, `No new moon data for ${year}`);
    if (moons) {
      // 12-15 entries per year
      assert(
        moons.length >= 12 && moons.length <= 15,
        `new-moons/${year}/count`,
        `${moons.length} new moons for ${year}, expected 12-15`,
      );

      // Ascending order
      for (let i = 1; i < moons.length; i++) {
        assert(
          moons[i] > moons[i - 1],
          `new-moons/${year}/ascending/${i}`,
          `New moons not ascending at index ${i}`,
        );
      }

      // ~29.5 day spacing between consecutive moons
      for (let i = 1; i < moons.length; i++) {
        const spacing = moons[i] - moons[i - 1];
        assertApprox(
          spacing,
          29.53,
          1.0,
          `new-moons/${year}/spacing/${i}`,
          `New moon spacing for ${year}`,
        );
      }
    }
  }

  // ---- evaluateAllCriteria returns 8 results ----
  console.log("  Checking evaluateAllCriteria...");
  const mecca = findCity("Mecca")!;
  const allResults = evaluateAllCriteria("2025-07-28", mecca.lat, mecca.lon, NEW_MOONS[2025][6]);
  assert(allResults.length === 8, "all-criteria-count", `evaluateAllCriteria returned ${allResults.length}, expected 8`);

  // ---- CRITERIA metadata ----
  const criteriaIds: CriterionId[] = ["umm_al_qura", "isna", "mabims", "yallop", "odeh", "pakistan", "turkey", "tabular"];
  for (const id of criteriaIds) {
    const meta = CRITERIA[id];
    assert(meta !== undefined, `criteria-meta/${id}`, `No metadata for criterion ${id}`);
    if (meta) {
      assert(meta.id === id, `criteria-meta/${id}/id`, `ID mismatch: ${meta.id}`);
      assert(meta.name.length > 0, `criteria-meta/${id}/name`, "Empty name");
      assert(meta.description.length > 0, `criteria-meta/${id}/desc`, "Empty description");
    }
  }

  // ---- PRAYER_CONVENTIONS has all 7 ----
  const convIds: PrayerConventionId[] = ["mwl", "isna", "egypt", "makkah", "karachi", "tehran", "jafari"];
  for (const id of convIds) {
    const conv = PRAYER_CONVENTIONS[id];
    assert(conv !== undefined, `convention/${id}`, `No convention for ${id}`);
    if (conv) {
      assert(conv.id === id, `convention/${id}/id`, `ID mismatch`);
      assert(conv.fajr_angle > 0, `convention/${id}/fajr`, `Fajr angle <= 0`);
      assert(conv.name.length > 0, `convention/${id}/name`, "Empty name");
    }
  }

  // ---- ttToUT and jdToDate basic checks ----
  const testJdTT = NEW_MOONS[2025][0];
  const testJdUT = ttToUT(testJdTT);
  assert(testJdUT < testJdTT, "ttToUT/less", `UT (${testJdUT}) should be < TT (${testJdTT})`);
  assert(testJdTT - testJdUT < 0.01, "ttToUT/close", `UT and TT should differ by < 0.01 days`);

  const testDate = jdToDate(testJdUT);
  assert(testDate instanceof Date, "jdToDate/type", "jdToDate should return Date");
  assert(!isNaN(testDate.getTime()), "jdToDate/valid", "jdToDate returned invalid date");

  // ---- hijriMonthToGregorianRange with tabular month starts ----
  // Build a small set of month starts using tabular for validation
  console.log("  Checking hijriMonthToGregorianRange...");
  const tabularMonthStarts: HijriMonthStart[] = [];
  for (let hMonth = 1; hMonth <= 12; hMonth++) {
    const greg = hijriToGregorianTabular(1447, hMonth, 1);
    tabularMonthStarts.push({
      hijri_year: 1447,
      hijri_month: hMonth,
      gregorian_start: fmtDate(greg.year, greg.month, greg.day),
      conjunction_jd_tt: 0,
    });
  }
  // Also add first month of next year for the last month's range calculation
  const nextYearGreg = hijriToGregorianTabular(1448, 1, 1);
  tabularMonthStarts.push({
    hijri_year: 1448,
    hijri_month: 1,
    gregorian_start: fmtDate(nextYearGreg.year, nextYearGreg.month, nextYearGreg.day),
    conjunction_jd_tt: 0,
  });

  for (let hMonth = 1; hMonth <= 12; hMonth++) {
    const range = hijriMonthToGregorianRange(1447, hMonth, tabularMonthStarts);
    assert(range !== null, `month-range/1447/${hMonth}`, `Range is null`);
    if (range) {
      assert(
        range.days === 29 || range.days === 30,
        `month-range/1447/${hMonth}/days`,
        `Days = ${range.days}, expected 29 or 30`,
      );
      assert(range.start.length === 10, `month-range/1447/${hMonth}/start-fmt`, `Start format: ${range.start}`);
      assert(range.end.length === 10, `month-range/1447/${hMonth}/end-fmt`, `End format: ${range.end}`);
    }
  }

  console.log("  Edge case checks complete");
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  console.log("=".repeat(70));
  console.log("COMPREHENSIVE COMPUTE MODULE TEST SUITE");
  console.log(`Cities: ${CITIES.length} | Years: ${YEARS.join(", ")} | Dates/year: ${SAMPLE_DATES_PER_YEAR.length}`);
  console.log("=".repeat(70));

  const startTime = Date.now();

  try {
    testPrayerTimes();
    testQibla();
    testHijriCalendar();
    testFestivals();
    testEdgeCases();
  } catch (e: any) {
    console.error(`\nFATAL ERROR: ${e.message}`);
    console.error(e.stack);
    process.exit(2);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nCompleted in ${elapsed}s`);

  printSummary();

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
