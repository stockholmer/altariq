import type { UpcomingFestival, Festival } from '@/lib/types/festival';
import type { CrescentCriterion, Locale } from '@/lib/types/settings';
import type { FestivalCategory, FestivalImportance } from '@/lib/types/festival';
import {
  gregorianToHijri,
  gregorianToHijriTabular,
  hijriToGregorianTabular,
  HIJRI_MONTH_NAMES,
  ISLAMIC_EVENTS,
  type HijriMonthStart,
} from '../compute/hijri-calendar';
import { evaluateCriterion, type CriterionId } from '../compute/hijri-criteria';
import {
  getIslamicFestivalsForDate,
  ISLAMIC_FESTIVAL_RULES,
  getFestivalsForHijriMonth,
} from '../compute/islamic-festivals';
import {
  getTranslatedFestivalName,
  type IslamicLocale,
} from '../compute/translations';
import { ttToUT } from '../compute/delta-t';
import { jdToDate } from '../compute/sun-utils';
import { NEW_MOONS } from '../compute/new-moons';
import { WEEKDAY_NAMES_EN } from '../compute/constants';

// ============================================================================
// Reuse month-start infrastructure from calendar.ts
// We duplicate the minimal parts needed here to avoid circular dependencies
// ============================================================================

const monthStartCache = new Map<string, HijriMonthStart[]>();

function getCacheKey(year: number, criterion: CriterionId, lat: number, lon: number): string {
  if (criterion === 'umm_al_qura' || criterion === 'turkey' || criterion === 'tabular') {
    return `f-${year}-${criterion}`;
  }
  return `f-${year}-${criterion}-${lat.toFixed(1)}-${lon.toFixed(1)}`;
}

function getAllNewMoons(year: number): number[] {
  const prev = NEW_MOONS[year - 1] ?? [];
  const curr = NEW_MOONS[year] ?? [];
  const next = NEW_MOONS[year + 1] ?? [];
  const all = [...prev, ...curr, ...next];
  all.sort((a, b) => a - b);
  const deduped: number[] = [];
  for (const jd of all) {
    if (deduped.length === 0 || jd - deduped[deduped.length - 1] > 15) {
      deduped.push(jd);
    }
  }
  return deduped;
}

function buildTabularMonthStarts(year: number): HijriMonthStart[] {
  const jan1 = gregorianToHijriTabular(year, 1, 1);
  const starts: HijriMonthStart[] = [];
  let hYear = jan1.year;
  let hMonth = jan1.month - 2;
  if (hMonth < 1) { hMonth += 12; hYear--; }
  for (let i = 0; i < 16; i++) {
    const greg = hijriToGregorianTabular(hYear, hMonth, 1);
    const gStr = `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}`;
    starts.push({ hijri_year: hYear, hijri_month: hMonth, gregorian_start: gStr, conjunction_jd_tt: 0 });
    hMonth++;
    if (hMonth > 12) { hMonth = 1; hYear++; }
  }
  return starts;
}

function dateStrDiffDays(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(ay, am - 1, ad) - Date.UTC(by, bm - 1, bd)) / 86400000);
}

function getMonthStarts(year: number, criterion: CriterionId, lat: number, lon: number): HijriMonthStart[] {
  const key = getCacheKey(year, criterion, lat, lon);
  if (monthStartCache.has(key)) return monthStartCache.get(key)!;

  let starts: HijriMonthStart[];
  if (criterion === 'tabular') {
    starts = buildTabularMonthStarts(year);
  } else {
    const newMoons = getAllNewMoons(year);
    if (newMoons.length === 0) {
      starts = buildTabularMonthStarts(year);
    } else {
      // Build astronomical month starts
      const raw: HijriMonthStart[] = [];
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
            raw.push({
              hijri_year: 0, hijri_month: 0,
              gregorian_start: `${nextDay.getUTCFullYear()}-${String(nextDay.getUTCMonth() + 1).padStart(2, '0')}-${String(nextDay.getUTCDate()).padStart(2, '0')}`,
              conjunction_jd_tt: conjJdTT,
            });
            break;
          }
        }
      }
      // Deduplicate
      const deduped: HijriMonthStart[] = [];
      for (const ms of raw) {
        if (deduped.length === 0 || ms.gregorian_start !== deduped[deduped.length - 1].gregorian_start) {
          deduped.push(ms);
        }
      }
      // Assign numbers
      if (deduped.length > 0) {
        const tabAll = [...buildTabularMonthStarts(year - 1), ...buildTabularMonthStarts(year), ...buildTabularMonthStarts(year + 1)];
        const firstStart = deduped[0].gregorian_start;
        let bestTab = tabAll[0];
        let bestDiff = Infinity;
        for (const tab of tabAll) {
          const diff = Math.abs(dateStrDiffDays(firstStart, tab.gregorian_start));
          if (diff < bestDiff) { bestDiff = diff; bestTab = tab; }
        }
        let hY = bestTab.hijri_year, hM = bestTab.hijri_month;
        for (const ms of deduped) {
          ms.hijri_year = hY; ms.hijri_month = hM;
          hM++; if (hM > 12) { hM = 1; hY++; }
        }
      }
      starts = deduped;
    }
  }
  monthStartCache.set(key, starts);
  return starts;
}

// ============================================================================
// Public API
// ============================================================================

export async function fetchUpcomingFestivals(params: {
  count?: number;
  criterion?: CrescentCriterion;
  locale?: Locale;
  lat?: number;
  lon?: number;
}): Promise<UpcomingFestival[]> {
  const count = params.count ?? 10;
  const criterion = (params.criterion ?? 'umm_al_qura') as CriterionId;
  const locale = (params.locale ?? 'en') as IslamicLocale;
  const lat = params.lat ?? 21.4225;
  const lon = params.lon ?? 39.8262;

  const today = new Date();
  const todayStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`;

  const results: UpcomingFestival[] = [];

  // Search up to 400 days ahead
  for (let dayOffset = 0; dayOffset < 400 && results.length < count; dayOffset++) {
    const checkDate = new Date(today.getTime() + dayOffset * 86400000);
    const dateStr = `${checkDate.getUTCFullYear()}-${String(checkDate.getUTCMonth() + 1).padStart(2, '0')}-${String(checkDate.getUTCDate()).padStart(2, '0')}`;
    const year = checkDate.getUTCFullYear();

    const monthStarts = getMonthStarts(year, criterion, lat, lon);
    const hijri = gregorianToHijri(dateStr, monthStarts);

    const matches = getIslamicFestivalsForDate(hijri.month, hijri.day, hijri.year);
    if (matches.length === 0) continue;

    const weekday = WEEKDAY_NAMES_EN[checkDate.getUTCDay()];

    for (const match of matches) {
      // Only include day 1 of multi-day events to avoid duplicates
      if (match.day_of_event > 1) continue;

      const name = locale !== 'en'
        ? getTranslatedFestivalName(match.rule.id, locale, match.rule.name)
        : match.rule.name;

      results.push({
        name,
        hijri_month: match.rule.hijri_month,
        hijri_day: match.rule.hijri_day,
        hijri_month_name: HIJRI_MONTH_NAMES[match.rule.hijri_month - 1]?.name ?? '',
        gregorian_date: dateStr,
        category: (match.rule.categories[0] ?? 'remembrance') as FestivalCategory,
        importance: match.rule.importance as FestivalImportance,
        description: match.rule.description,
        duration_days: match.rule.duration_days,
        day_of_event: match.day_of_event,
        days_until: dayOffset,
      });

      if (results.length >= count) break;
    }
  }

  return results;
}

export async function fetchYearFestivals(params: {
  year: number;
  criterion?: CrescentCriterion;
  locale?: Locale;
  lat?: number;
  lon?: number;
}): Promise<Festival[]> {
  const criterion = (params.criterion ?? 'umm_al_qura') as CriterionId;
  const locale = (params.locale ?? 'en') as IslamicLocale;
  const lat = params.lat ?? 21.4225;
  const lon = params.lon ?? 39.8262;
  const year = params.year;

  const monthStarts = getMonthStarts(year, criterion, lat, lon);
  const results: Festival[] = [];

  // For each Islamic event, find its Gregorian date
  for (const event of ISLAMIC_EVENTS) {
    const candidates = monthStarts.filter((ms) => ms.hijri_month === event.hijri_month);
    for (const ms of candidates) {
      const [sy, sm, sd] = ms.gregorian_start.split('-').map(Number);
      const startDate = new Date(Date.UTC(sy, sm - 1, sd));
      const eventDate = new Date(startDate.getTime() + (event.hijri_day - 1) * 86400000);

      if (eventDate.getUTCFullYear() === year) {
        const gregDate = `${eventDate.getUTCFullYear()}-${String(eventDate.getUTCMonth() + 1).padStart(2, '0')}-${String(eventDate.getUTCDate()).padStart(2, '0')}`;

        const name = locale !== 'en'
          ? getTranslatedFestivalName(event.key, locale, event.name)
          : event.name;

        results.push({
          name,
          hijri_month: event.hijri_month,
          hijri_day: event.hijri_day,
          hijri_month_name: HIJRI_MONTH_NAMES[event.hijri_month - 1]?.name ?? '',
          gregorian_date: gregDate,
          category: event.is_major ? 'eid' : 'remembrance',
          importance: event.is_major ? 'major' : 'observance',
          description: event.description,
        });
      }
    }
  }

  results.sort((a, b) => a.gregorian_date.localeCompare(b.gregorian_date));
  return results;
}

export async function fetchMonthFestivals(params: {
  hijri_year: number;
  hijri_month: number;
  criterion?: CrescentCriterion;
  lat?: number;
  lon?: number;
}): Promise<Festival[]> {
  const criterion = (params.criterion ?? 'umm_al_qura') as CriterionId;
  const lat = params.lat ?? 21.4225;
  const lon = params.lon ?? 39.8262;

  const gregStart = hijriToGregorianTabular(params.hijri_year, params.hijri_month, 1);
  const year = gregStart.year;

  const monthStarts = getMonthStarts(year, criterion, lat, lon);
  const thisMonth = monthStarts.find(
    (ms) => ms.hijri_year === params.hijri_year && ms.hijri_month === params.hijri_month,
  );

  const results: Festival[] = [];

  // Get events for this Hijri month
  const monthEvents = ISLAMIC_EVENTS.filter((e) => e.hijri_month === params.hijri_month);

  for (const event of monthEvents) {
    let gregDate = '';
    if (thisMonth) {
      const [sy, sm, sd] = thisMonth.gregorian_start.split('-').map(Number);
      const startDate = new Date(Date.UTC(sy, sm - 1, sd));
      const eventDate = new Date(startDate.getTime() + (event.hijri_day - 1) * 86400000);
      gregDate = `${eventDate.getUTCFullYear()}-${String(eventDate.getUTCMonth() + 1).padStart(2, '0')}-${String(eventDate.getUTCDate()).padStart(2, '0')}`;
    }

    results.push({
      name: event.name,
      hijri_month: params.hijri_month,
      hijri_day: event.hijri_day,
      hijri_month_name: HIJRI_MONTH_NAMES[params.hijri_month - 1]?.name ?? '',
      gregorian_date: gregDate,
      category: event.is_major ? 'eid' : 'remembrance',
      importance: event.is_major ? 'major' : 'observance',
      description: event.description,
    });
  }

  return results;
}
