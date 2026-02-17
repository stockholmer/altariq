import type { HijriDate, HijriMonth, HijriMonthDay, HijriEvent } from '@/lib/types/calendar';
import type { CrescentCriterion } from '@/lib/types/settings';
import {
  gregorianToHijri,
  gregorianToHijriTabular,
  hijriToGregorianTabular,
  getEventsForDate,
  hijriMonthToGregorianRange,
  HIJRI_MONTH_NAMES,
  ISLAMIC_EVENTS,
  type HijriMonthStart,
} from '../compute/hijri-calendar';
import { evaluateCriterion, type CriterionId } from '../compute/hijri-criteria';
import { ttToUT } from '../compute/delta-t';
import { jdToDate } from '../compute/sun-utils';
import { NEW_MOONS } from '../compute/new-moons';
import { WEEKDAY_NAMES_EN } from '../compute/constants';

// ============================================================================
// Caching
// ============================================================================

// Cache: `${year}-${criterion}-${lat.toFixed(1)}-${lon.toFixed(1)}` -> HijriMonthStart[]
const monthStartCache = new Map<string, HijriMonthStart[]>();

function getCacheKey(year: number, criterion: CriterionId, lat: number, lon: number): string {
  // Fixed-location criteria don't depend on user lat/lon
  if (criterion === 'umm_al_qura' || criterion === 'turkey' || criterion === 'tabular') {
    return `${year}-${criterion}`;
  }
  return `${year}-${criterion}-${lat.toFixed(1)}-${lon.toFixed(1)}`;
}

// ============================================================================
// New Moon Data
// ============================================================================

function getNewMoons(year: number): number[] {
  return NEW_MOONS[year] ?? [];
}

/** Get new moons covering a Gregorian year (year-1, year, year+1), deduplicated. */
function getAllNewMoons(year: number): number[] {
  const prev = getNewMoons(year - 1);
  const curr = getNewMoons(year);
  const next = getNewMoons(year + 1);
  const all = [...prev, ...curr, ...next];
  all.sort((a, b) => a - b);
  // Deduplicate: real new moons are ~29.53 days apart
  const deduped: number[] = [];
  for (const jd of all) {
    if (deduped.length === 0 || jd - deduped[deduped.length - 1] > 15) {
      deduped.push(jd);
    }
  }
  return deduped;
}

// ============================================================================
// Month Start Computation
// ============================================================================

function buildTabularMonthStarts(year: number): HijriMonthStart[] {
  const jan1 = gregorianToHijriTabular(year, 1, 1);
  const starts: HijriMonthStart[] = [];
  let hYear = jan1.year;
  let hMonth = jan1.month - 2;
  if (hMonth < 1) {
    hMonth += 12;
    hYear--;
  }
  for (let i = 0; i < 16; i++) {
    const greg = hijriToGregorianTabular(hYear, hMonth, 1);
    const gStr = `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}`;
    starts.push({
      hijri_year: hYear,
      hijri_month: hMonth,
      gregorian_start: gStr,
      conjunction_jd_tt: 0,
    });
    hMonth++;
    if (hMonth > 12) {
      hMonth = 1;
      hYear++;
    }
  }
  return starts;
}

function dateStrDiffDays(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((da - db) / 86400000);
}

function buildMonthStarts(
  newMoons: number[],
  criterion: CriterionId,
  lat: number,
  lon: number,
  year: number,
): HijriMonthStart[] {
  if (criterion === 'tabular') {
    return buildTabularMonthStarts(year);
  }

  const starts: HijriMonthStart[] = [];

  for (const conjJdTT of newMoons) {
    const conjUT = ttToUT(conjJdTT);
    const conjDate = jdToDate(conjUT);

    for (let d = 0; d < 4; d++) {
      const checkDate = new Date(conjDate.getTime() + d * 86400000);
      const cy = checkDate.getUTCFullYear();
      const cm = String(checkDate.getUTCMonth() + 1).padStart(2, '0');
      const cd = String(checkDate.getUTCDate()).padStart(2, '0');
      const dateStr = `${cy}-${cm}-${cd}`;

      const result = evaluateCriterion(criterion, dateStr, lat, lon, conjJdTT);
      if (result.new_month_starts) {
        const nextDay = new Date(checkDate.getTime() + 86400000);
        const ny = nextDay.getUTCFullYear();
        const nm = String(nextDay.getUTCMonth() + 1).padStart(2, '0');
        const nd = String(nextDay.getUTCDate()).padStart(2, '0');

        starts.push({
          hijri_year: 0,
          hijri_month: 0,
          gregorian_start: `${ny}-${nm}-${nd}`,
          conjunction_jd_tt: conjJdTT,
        });
        break;
      }
    }
  }

  // Deduplicate
  const deduped: HijriMonthStart[] = [];
  for (const ms of starts) {
    if (deduped.length === 0 || ms.gregorian_start !== deduped[deduped.length - 1].gregorian_start) {
      deduped.push(ms);
    }
  }

  // Assign Hijri year/month numbers by matching against tabular
  if (deduped.length > 0) {
    const tabAll = [
      ...buildTabularMonthStarts(year - 1),
      ...buildTabularMonthStarts(year),
      ...buildTabularMonthStarts(year + 1),
    ];

    const firstStart = deduped[0].gregorian_start;
    let bestTab = tabAll[0];
    let bestDiff = Infinity;
    for (const tab of tabAll) {
      const diff = Math.abs(dateStrDiffDays(firstStart, tab.gregorian_start));
      if (diff < bestDiff) {
        bestDiff = diff;
        bestTab = tab;
      }
    }

    let hYear = bestTab.hijri_year;
    let hMonth = bestTab.hijri_month;
    for (const ms of deduped) {
      ms.hijri_year = hYear;
      ms.hijri_month = hMonth;
      hMonth++;
      if (hMonth > 12) {
        hMonth = 1;
        hYear++;
      }
    }
  }

  return deduped;
}

function getMonthStarts(
  year: number,
  criterion: CriterionId,
  lat: number,
  lon: number,
): HijriMonthStart[] {
  const key = getCacheKey(year, criterion, lat, lon);
  if (monthStartCache.has(key)) {
    return monthStartCache.get(key)!;
  }

  let starts: HijriMonthStart[];
  if (criterion === 'tabular') {
    starts = buildTabularMonthStarts(year);
  } else {
    const newMoons = getAllNewMoons(year);
    if (newMoons.length === 0) {
      starts = buildTabularMonthStarts(year);
    } else {
      starts = buildMonthStarts(newMoons, criterion, lat, lon, year);
    }
  }

  monthStartCache.set(key, starts);
  return starts;
}

// ============================================================================
// Event Helpers
// ============================================================================

function normalizeEvent(e: { key: string; name: string; hijri_month: number; hijri_day: number; is_major: boolean; description: string }): HijriEvent {
  return {
    name: e.name,
    hijri_month: e.hijri_month,
    hijri_day: e.hijri_day,
    category: e.is_major ? 'eid' : 'remembrance',
    importance: e.is_major ? 'major' : 'observance',
    description: e.description,
  };
}

// ============================================================================
// Public API
// ============================================================================

export async function fetchHijriDate(params: {
  date?: string;
  criterion?: CrescentCriterion;
  lat?: number;
  lon?: number;
}): Promise<HijriDate> {
  const dateStr = params.date ?? new Date().toISOString().split('T')[0];
  const criterion = (params.criterion ?? 'umm_al_qura') as CriterionId;
  const lat = params.lat ?? 21.4225; // Default: Mecca
  const lon = params.lon ?? 39.8262;

  const [year] = dateStr.split('-').map(Number);
  const monthStarts = getMonthStarts(year, criterion, lat, lon);

  const hijri = gregorianToHijri(dateStr, monthStarts);
  const events = getEventsForDate(hijri);

  // Get weekday
  const [yy, mm, dd] = dateStr.split('-').map(Number);
  const dateObj = new Date(Date.UTC(yy, mm - 1, dd));
  const weekday = WEEKDAY_NAMES_EN[dateObj.getUTCDay()];

  return {
    hijri_year: hijri.year,
    hijri_month: hijri.month,
    hijri_day: hijri.day,
    hijri_month_name: hijri.month_info.name,
    weekday,
    gregorian_date: dateStr,
    criterion,
    events: events.map(normalizeEvent),
  };
}

export async function fetchHijriMonth(params: {
  hijri_year: number;
  hijri_month: number;
  criterion?: CrescentCriterion;
  lat?: number;
  lon?: number;
}): Promise<HijriMonth> {
  const criterion = (params.criterion ?? 'umm_al_qura') as CriterionId;
  const lat = params.lat ?? 21.4225;
  const lon = params.lon ?? 39.8262;

  // Convert 1st of Hijri month to Gregorian to determine which Gregorian year to fetch
  const gregStart = hijriToGregorianTabular(params.hijri_year, params.hijri_month, 1);
  const year = gregStart.year;

  const monthStarts = getMonthStarts(year, criterion, lat, lon);
  const range = hijriMonthToGregorianRange(params.hijri_year, params.hijri_month, monthStarts);

  const monthInfo = HIJRI_MONTH_NAMES[params.hijri_month - 1];

  // Build day-by-day entries
  const days: HijriMonthDay[] = [];
  if (range) {
    const [sy, sm, sd] = range.start.split('-').map(Number);
    const startDate = new Date(Date.UTC(sy, sm - 1, sd));

    for (let d = 0; d < range.days; d++) {
      const dayDate = new Date(startDate.getTime() + d * 86400000);
      const gStr = `${dayDate.getUTCFullYear()}-${String(dayDate.getUTCMonth() + 1).padStart(2, '0')}-${String(dayDate.getUTCDate()).padStart(2, '0')}`;
      const weekday = WEEKDAY_NAMES_EN[dayDate.getUTCDay()];
      const hijriDay = d + 1;

      const dayEvents = ISLAMIC_EVENTS.filter(
        (e) => e.hijri_month === params.hijri_month && e.hijri_day === hijriDay,
      );

      days.push({
        hijri_day: hijriDay,
        gregorian_date: gStr,
        weekday,
        events: dayEvents.map(normalizeEvent),
      });
    }
  }

  return {
    hijri_year: params.hijri_year,
    hijri_month: params.hijri_month,
    hijri_month_name: monthInfo?.name ?? '',
    criterion,
    days,
  };
}
