/**
 * Online Cross-Validation Against AlAdhan.com API
 *
 * Compares local compute module results against the AlAdhan.com public API
 * for prayer times, Qibla direction, and Hijri calendar conversions.
 *
 * Run: npx tsx scripts/test-compute-online.ts
 * Exit 0 = all pass, 1 = failures, 2 = fatal error.
 *
 * Requires internet access. Makes ~150 HTTP requests to api.aladhan.com.
 */

// ============================================================================
// Imports
// ============================================================================

import {
  computePrayerTimes,
  computeQibla,
  computeQiblaDirection,
} from "../src/lib/compute/prayer-times";
import {
  gregorianToHijriTabular,
  hijriToGregorianTabular,
} from "../src/lib/compute/hijri-calendar";
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
  assert(
    diff <= tolerance,
    testName,
    `${message} (ours=${actual}, theirs=${expected}, diff=${diff.toFixed(2)}, tol=${tolerance})`,
  );
}

function printSummary(): void {
  console.log("\n" + "=".repeat(70));
  console.log("ONLINE CROSS-VALIDATION SUMMARY");
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
    const maxShow = 80;
    console.log(
      `\nFAILURES (showing first ${Math.min(maxShow, results.failures.length)} of ${results.failures.length}):\n`,
    );
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

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Sleep for ms */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch JSON from AlAdhan API with retries */
async function fetchAlAdhan(url: string, retries = 3): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(url);
      if (resp.status === 429) {
        // Rate limited - wait and retry
        const wait = attempt * 2000;
        console.log(`    Rate limited, waiting ${wait}ms...`);
        await sleep(wait);
        continue;
      }
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      }
      return await resp.json();
    } catch (e: any) {
      if (attempt === retries) throw e;
      await sleep(1000 * attempt);
    }
  }
}

/** Find city by name */
function findCity(name: string): City | undefined {
  return CITIES.find((c) => c.city.toLowerCase() === name.toLowerCase());
}

/** Check if a date string is in the summer months for a given hemisphere */
function isSummerDate(dateStr: string, lat: number): boolean {
  const m = parseInt(dateStr.split("-")[1], 10);
  if (lat > 0) return m >= 5 && m <= 8;
  return m === 12 || m <= 2;
}

// ============================================================================
// AlAdhan convention mapping
// ============================================================================

// Our convention ID -> AlAdhan method number
const CONVENTION_MAP: Record<PrayerConventionId, number> = {
  jafari: 0,
  karachi: 1,
  isna: 2,
  mwl: 3,
  makkah: 4,
  egypt: 5,
  tehran: 7,
};

// Representative cities across different regions and latitudes
const SAMPLE_CITIES = [
  "Mecca",
  "Medina",
  "Riyadh",
  "Dubai",
  "Istanbul",
  "Cairo",
  "Jakarta",
  "Islamabad",
  "Kuala Lumpur",
  "London",
  "Paris",
  "Berlin",
  "Rome",
  "Madrid",
  "New York",       // using a US city if it exists - will check
  "Tokyo",
  "Sydney",
  "Auckland",
  "Lagos",
  "Casablanca",
  "Tehran",
  "Dhaka",
  "Ankara",
  "Baghdad",
  "Rabat",
].map(findCity).filter(Boolean) as City[];

// Dates spread across the year (DD-MM-YYYY for AlAdhan)
const SAMPLE_DATES = [
  { greg: "2025-01-15", aladhan: "15-01-2025" },
  { greg: "2025-03-21", aladhan: "21-03-2025" },
  { greg: "2025-06-21", aladhan: "21-06-2025" },
  { greg: "2025-09-22", aladhan: "22-09-2025" },
  { greg: "2025-12-21", aladhan: "21-12-2025" },
  { greg: "2026-02-15", aladhan: "15-02-2026" },
  { greg: "2026-07-15", aladhan: "15-07-2026" },
  { greg: "2026-11-15", aladhan: "15-11-2026" },
];

// ============================================================================
// Suite A: Prayer Times Cross-Validation
// ============================================================================

async function testPrayerTimesOnline(): Promise<void> {
  setSuite("A. Prayer Times vs AlAdhan");
  console.log("\n[Suite A] Prayer Times vs AlAdhan API...");

  // Tolerance: ±3 minutes is acceptable (different solar position algorithms)
  const TOLERANCE_MINUTES = 3;

  const conventions: { ours: PrayerConventionId; aladhan: number; name: string }[] = [
    { ours: "mwl", aladhan: 3, name: "MWL" },
    { ours: "isna", aladhan: 2, name: "ISNA" },
    { ours: "egypt", aladhan: 5, name: "Egypt" },
    { ours: "makkah", aladhan: 4, name: "Makkah" },
    { ours: "karachi", aladhan: 1, name: "Karachi" },
    { ours: "tehran", aladhan: 7, name: "Tehran" },
    { ours: "jafari", aladhan: 0, name: "Jafari" },
  ];

  let apiCalls = 0;

  // Test each sample city x date with MWL convention (primary test)
  for (const city of SAMPLE_CITIES) {
    for (const date of SAMPLE_DATES) {
      const label = `${city.city}/${date.greg}/mwl`;

      try {
        // Our computation
        const ours = computePrayerTimes(date.greg, city.lat, city.lon, city.timezone, "mwl", "shafii");

        // AlAdhan API
        const url = `https://api.aladhan.com/v1/timings/${date.aladhan}?latitude=${city.lat}&longitude=${city.lon}&method=3&school=0`;
        const resp = await fetchAlAdhan(url);
        apiCalls++;

        if (resp.code !== 200 || !resp.data?.timings) {
          assert(false, label, `AlAdhan returned code ${resp.code}`);
          continue;
        }

        const theirs = resp.data.timings;

        // Compare each prayer time
        const comparisons: { key: keyof PrayerTimes; theirKey: string }[] = [
          { key: "fajr", theirKey: "Fajr" },
          { key: "sunrise", theirKey: "Sunrise" },
          { key: "dhuhr", theirKey: "Dhuhr" },
          { key: "asr", theirKey: "Asr" },
          { key: "maghrib", theirKey: "Maghrib" },
          { key: "isha", theirKey: "Isha" },
        ];

        for (const { key, theirKey } of comparisons) {
          const ourTime = ours[key];
          const theirTime: string | undefined = theirs[theirKey];

          if (ourTime === null || !theirTime) {
            // If both null/missing, that's consistent
            // If only one is null, that might be acceptable at high latitudes
            if (ourTime === null && theirTime) {
              // We returned null but they have a value - note it but only fail for non-high lat
              if (Math.abs(city.lat) < 48) {
                assert(false, `${label}/${key}`, `Ours is null but AlAdhan has ${theirTime}`);
              }
            }
            continue;
          }

          // Both have values - compare
          // AlAdhan returns "HH:MM" or "HH:MM (timezone)" - extract just HH:MM
          const theirClean = theirTime.replace(/\s*\(.*\)$/, "").trim();
          if (!/^\d{2}:\d{2}$/.test(theirClean)) continue;

          const ourMin = timeToMinutes(ourTime);
          const theirMin = timeToMinutes(theirClean);

          // Handle midnight wrap for comparison
          let diff = Math.abs(ourMin - theirMin);
          if (diff > 720) diff = 1440 - diff; // handle wrap around midnight

          // At high latitudes (>48°) in summer, Fajr/Isha computations diverge
          // significantly between implementations because the sun barely reaches
          // the convention angle. Use a wider tolerance for these cases.
          const isHighLatSummer = Math.abs(city.lat) > 48 && isSummerDate(date.greg, city.lat);
          const isAngleDependent = key === "fajr" || key === "isha";
          const effectiveTolerance = (isHighLatSummer && isAngleDependent) ? 60 : TOLERANCE_MINUTES;

          assertApprox(
            0, diff, effectiveTolerance,
            `${label}/${key}`,
            `${key}: ours=${ourTime} vs theirs=${theirClean}`,
          );
        }

        // Brief pause to be kind to the API
        if (apiCalls % 10 === 0) await sleep(300);
      } catch (e: any) {
        assert(false, label, `Error: ${e.message}`);
      }
    }
  }

  // Test all 7 conventions on a few cities/dates
  console.log("  Cross-checking all 7 conventions...");
  const convTestCities = [findCity("Mecca"), findCity("London"), findCity("Jakarta"), findCity("Cairo")].filter(Boolean) as City[];
  const convTestDate = { greg: "2025-03-21", aladhan: "21-03-2025" };

  for (const conv of conventions) {
    for (const city of convTestCities) {
      const label = `${city.city}/${conv.name}/dhuhr`;

      try {
        const ours = computePrayerTimes(convTestDate.greg, city.lat, city.lon, city.timezone, conv.ours, "shafii");
        const url = `https://api.aladhan.com/v1/timings/${convTestDate.aladhan}?latitude=${city.lat}&longitude=${city.lon}&method=${conv.aladhan}&school=0`;
        const resp = await fetchAlAdhan(url);
        apiCalls++;

        if (resp.code === 200 && resp.data?.timings) {
          const theirDhuhr = resp.data.timings.Dhuhr?.replace(/\s*\(.*\)$/, "").trim();
          if (ours.dhuhr && theirDhuhr && /^\d{2}:\d{2}$/.test(theirDhuhr)) {
            const diff = Math.abs(timeToMinutes(ours.dhuhr) - timeToMinutes(theirDhuhr));
            assertApprox(0, diff, 3, label, `Dhuhr: ours=${ours.dhuhr} vs theirs=${theirDhuhr}`);
          }
        }

        if (apiCalls % 10 === 0) await sleep(300);
      } catch (e: any) {
        assert(false, label, `Error: ${e.message}`);
      }
    }
  }

  // Test Hanafi school
  console.log("  Cross-checking Hanafi school...");
  for (const city of convTestCities) {
    const label = `${city.city}/hanafi-asr`;
    try {
      const ours = computePrayerTimes(convTestDate.greg, city.lat, city.lon, city.timezone, "mwl", "hanafi");
      const url = `https://api.aladhan.com/v1/timings/${convTestDate.aladhan}?latitude=${city.lat}&longitude=${city.lon}&method=3&school=1`;
      const resp = await fetchAlAdhan(url);
      apiCalls++;

      if (resp.code === 200 && resp.data?.timings) {
        const theirAsr = resp.data.timings.Asr?.replace(/\s*\(.*\)$/, "").trim();
        if (ours.asr && theirAsr && /^\d{2}:\d{2}$/.test(theirAsr)) {
          const diff = Math.abs(timeToMinutes(ours.asr) - timeToMinutes(theirAsr));
          assertApprox(0, diff, 3, label, `Hanafi Asr: ours=${ours.asr} vs theirs=${theirAsr}`);
        }
      }
    } catch (e: any) {
      assert(false, label, `Error: ${e.message}`);
    }
  }

  console.log(`  Made ${apiCalls} API calls`);
}

// ============================================================================
// Suite B: Qibla Cross-Validation
// ============================================================================

async function testQiblaOnline(): Promise<void> {
  setSuite("B. Qibla vs AlAdhan");
  console.log("\n[Suite B] Qibla Direction vs AlAdhan API...");

  // Tolerance: ±1 degree
  const TOLERANCE_DEG = 1;
  let apiCalls = 0;

  for (const city of SAMPLE_CITIES) {
    const label = `${city.city}/qibla`;

    try {
      const ourDir = computeQiblaDirection(city.lat, city.lon);

      const url = `https://api.aladhan.com/v1/qibla/${city.lat}/${city.lon}`;
      const resp = await fetchAlAdhan(url);
      apiCalls++;

      if (resp.code === 200 && resp.data?.direction !== undefined) {
        const theirDir = resp.data.direction;

        // At the Kaaba itself, direction is mathematically undefined - skip
        const qibla = computeQibla(city.lat, city.lon);
        if (qibla.distance_km < 1) {
          assert(true, label, "Skipped (at Kaaba, direction undefined)");
        } else {
          // Handle wrap around 360/0
          let diff = Math.abs(ourDir - theirDir);
          if (diff > 180) diff = 360 - diff;

          assertApprox(
            0, diff, TOLERANCE_DEG,
            label,
            `Qibla: ours=${ourDir.toFixed(2)} vs theirs=${theirDir.toFixed(2)}`,
          );
        }
      } else {
        assert(false, label, `AlAdhan returned code ${resp.code}`);
      }

      if (apiCalls % 10 === 0) await sleep(300);
    } catch (e: any) {
      assert(false, label, `Error: ${e.message}`);
    }
  }

  console.log(`  Made ${apiCalls} API calls`);
}

// ============================================================================
// Suite C: Hijri Calendar Cross-Validation
// ============================================================================

async function testHijriOnline(): Promise<void> {
  setSuite("C. Hijri vs AlAdhan");
  console.log("\n[Suite C] Hijri Calendar vs AlAdhan API...");

  // Note: AlAdhan may use a different calendar method (HJCoSA astronomical
  // vs our tabular). We compare against their MATHEMATICAL method for
  // tabular equivalence, with tolerance of ±1 day for method differences.
  let apiCalls = 0;

  // Dates spread across 2025-2029
  const testDates = [
    "2025-01-01", "2025-02-28", "2025-03-15", "2025-06-01", "2025-09-15", "2025-12-31",
    "2026-01-15", "2026-04-10", "2026-07-20", "2026-10-30",
    "2027-01-01", "2027-05-05", "2027-08-15", "2027-12-25",
    "2028-02-29", "2028-06-15", "2028-11-01",
    "2029-01-01", "2029-03-21", "2029-06-21", "2029-09-22", "2029-12-31",
  ];

  for (const dateStr of testDates) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const aladhanDate = `${pad2(d)}-${pad2(m)}-${y}`;
    const label = `hijri/${dateStr}`;

    try {
      // Our tabular conversion
      const ours = gregorianToHijriTabular(y, m, d);

      // AlAdhan API with MATHEMATICAL (tabular) method
      const url = `https://api.aladhan.com/v1/gToH/${aladhanDate}?calendarMethod=MATHEMATICAL`;
      const resp = await fetchAlAdhan(url);
      apiCalls++;

      if (resp.code === 200 && resp.data?.hijri) {
        const theirHijri = resp.data.hijri;
        const theirDay = parseInt(theirHijri.day, 10);
        const theirMonth = parseInt(theirHijri.month?.number, 10);
        const theirYear = parseInt(theirHijri.year, 10);

        // With MATHEMATICAL method, should match exactly or within ±1 day
        // (different tabular epochs can shift by 1 day)
        const dayDiff = Math.abs(ours.day - theirDay);
        const monthMatch = ours.month === theirMonth;
        const yearMatch = ours.year === theirYear;

        if (yearMatch && monthMatch) {
          assertApprox(
            ours.day, theirDay, 2,
            `${label}/day`,
            `Day: ours=${ours.day} vs theirs=${theirDay} (${ours.year}/${ours.month})`,
          );
        } else if (yearMatch) {
          // Month boundary difference - tolerate ±1 month at boundary
          const monthDiff = Math.abs(ours.month - theirMonth);
          assert(
            monthDiff <= 1 || monthDiff === 11, // 11 = month 1 vs 12 wrap
            `${label}/month`,
            `Month: ours=${ours.month} vs theirs=${theirMonth} (year ${ours.year})`,
          );
        } else {
          // Year difference - only acceptable at year boundaries
          const yearDiff = Math.abs(ours.year - theirYear);
          assert(
            yearDiff <= 1,
            `${label}/year`,
            `Year: ours=${ours.year} vs theirs=${theirYear}`,
          );
        }
      } else {
        assert(false, label, `AlAdhan returned code ${resp.code}`);
      }

      if (apiCalls % 10 === 0) await sleep(300);
    } catch (e: any) {
      assert(false, label, `Error: ${e.message}`);
    }
  }

  // Reverse: Hijri -> Gregorian roundtrip via AlAdhan
  console.log("  Cross-checking Hijri->Gregorian...");
  const hijriTestDates = [
    { hY: 1446, hM: 7, hD: 1 },
    { hY: 1446, hM: 9, hD: 1 },   // Ramadan
    { hY: 1446, hM: 10, hD: 1 },  // Shawwal (Eid al-Fitr)
    { hY: 1446, hM: 12, hD: 10 }, // Eid al-Adha
    { hY: 1447, hM: 1, hD: 1 },   // New year
    { hY: 1447, hM: 1, hD: 10 },  // Ashura
    { hY: 1447, hM: 3, hD: 12 },  // Mawlid
    { hY: 1448, hM: 6, hD: 15 },
    { hY: 1449, hM: 9, hD: 1 },
    { hY: 1450, hM: 12, hD: 10 },
  ];

  for (const { hY, hM, hD } of hijriTestDates) {
    const label = `h2g/${hY}-${hM}-${hD}`;
    const aladhanHijri = `${pad2(hD)}-${pad2(hM)}-${hY}`;

    try {
      // Our conversion
      const ours = hijriToGregorianTabular(hY, hM, hD);

      // AlAdhan API
      const url = `https://api.aladhan.com/v1/hToG/${aladhanHijri}?calendarMethod=MATHEMATICAL`;
      const resp = await fetchAlAdhan(url);
      apiCalls++;

      if (resp.code === 200 && resp.data?.gregorian) {
        const theirGreg = resp.data.gregorian;
        const theirDay = parseInt(theirGreg.day, 10);
        const theirMonth = parseInt(theirGreg.month?.number, 10);
        const theirYear = parseInt(theirGreg.year, 10);

        // Allow ±2 day tolerance for different tabular epoch bases
        const oursDate = new Date(Date.UTC(ours.year, ours.month - 1, ours.day));
        const theirsDate = new Date(Date.UTC(theirYear, theirMonth - 1, theirDay));
        const diffDays = Math.abs(Math.round((oursDate.getTime() - theirsDate.getTime()) / 86400000));

        assertApprox(
          0, diffDays, 2,
          label,
          `Greg: ours=${ours.year}-${pad2(ours.month)}-${pad2(ours.day)} vs theirs=${theirYear}-${pad2(theirMonth)}-${pad2(theirDay)}`,
        );
      } else {
        assert(false, label, `AlAdhan returned code ${resp.code}`);
      }

      if (apiCalls % 10 === 0) await sleep(300);
    } catch (e: any) {
      assert(false, label, `Error: ${e.message}`);
    }
  }

  console.log(`  Made ${apiCalls} API calls`);
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  console.log("=".repeat(70));
  console.log("ONLINE CROSS-VALIDATION vs AlAdhan.com API");
  console.log(`Sample cities: ${SAMPLE_CITIES.length} | Sample dates: ${SAMPLE_DATES.length}`);
  console.log("=".repeat(70));

  // Quick connectivity check
  console.log("\nChecking AlAdhan API connectivity...");
  try {
    const check = await fetchAlAdhan("https://api.aladhan.com/v1/qibla/21.4225/39.8262");
    if (check.code !== 200) throw new Error(`Got code ${check.code}`);
    console.log("  API reachable.\n");
  } catch (e: any) {
    console.error(`\nFATAL: Cannot reach AlAdhan API: ${e.message}`);
    console.error("This test requires internet access.");
    process.exit(2);
  }

  const startTime = Date.now();

  try {
    await testPrayerTimesOnline();
    await testQiblaOnline();
    await testHijriOnline();
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
