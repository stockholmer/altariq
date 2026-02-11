import { apiFetch } from './client';
import type { UpcomingFestival, Festival } from '@/lib/types/festival';
import type { CrescentCriterion, Locale } from '@/lib/types/settings';
import type { FestivalCategory, FestivalImportance } from '@/lib/types/festival';

// API response shapes (different from our normalized types)
interface UpcomingResponse {
  upcoming: {
    date: string;
    weekday: string;
    hijri: { year: number; month: number; day: number; month_name: string };
    festival: {
      name: string;
      importance: string;
      categories: string[];
      description: string;
      traditions?: string;
      day_of_event: number;
      duration_days: number;
    };
  }[];
}

interface YearResponse {
  days_with_festivals: {
    date: string;
    weekday: string;
    hijri: { year: number; month: number; day: number; month_name: string };
    festivals: {
      name: string;
      importance: string;
      categories: string[];
      description: string;
      traditions?: string;
      day_of_event: number;
      duration_days: number;
    }[];
  }[];
}

interface MonthFestivalResponse {
  days_with_festivals: {
    hijri_day: number;
    gregorian_date: string;
    weekday: string;
    festivals: {
      name: string;
      importance: string;
      categories: string[];
      description: string;
      day_of_event: number;
      duration_days: number;
    }[];
  }[];
}

function normalizeFestival(
  f: { name: string; importance: string; categories: string[]; description: string; traditions?: string; day_of_event: number; duration_days: number },
  hijri: { year: number; month: number; day: number; month_name: string },
  gregorian_date: string
): Festival {
  return {
    name: f.name,
    hijri_month: hijri.month,
    hijri_day: hijri.day,
    hijri_month_name: hijri.month_name,
    gregorian_date,
    category: (f.categories?.[0] ?? 'remembrance') as FestivalCategory,
    importance: f.importance as FestivalImportance,
    description: f.description,
    duration_days: f.duration_days,
    day_of_event: f.day_of_event,
  };
}

export async function fetchUpcomingFestivals(params: {
  count?: number;
  criterion?: CrescentCriterion;
  locale?: Locale;
}): Promise<UpcomingFestival[]> {
  const raw = await apiFetch<UpcomingResponse>('islamic-festival-lens/upcoming', {
    count: params.count ?? 10,
    criterion: params.criterion,
    locale: params.locale,
  });
  return (raw.upcoming ?? []).map((item) => ({
    ...normalizeFestival(item.festival, item.hijri, item.date),
    days_until: Math.max(0, Math.floor(
      (new Date(item.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )),
  }));
}

export async function fetchYearFestivals(params: {
  year: number;
  criterion?: CrescentCriterion;
  locale?: Locale;
}): Promise<Festival[]> {
  const raw = await apiFetch<YearResponse>('islamic-festival-lens/year', {
    year: params.year,
    criterion: params.criterion,
    locale: params.locale,
  });
  const result: Festival[] = [];
  for (const day of raw.days_with_festivals ?? []) {
    for (const f of day.festivals) {
      result.push(normalizeFestival(f, day.hijri, day.date));
    }
  }
  return result;
}

export async function fetchMonthFestivals(params: {
  hijri_year: number;
  hijri_month: number;
}): Promise<Festival[]> {
  const raw = await apiFetch<MonthFestivalResponse>('islamic-festival-lens/month', {
    hijri_year: params.hijri_year,
    hijri_month: params.hijri_month,
  });
  const result: Festival[] = [];
  for (const day of raw.days_with_festivals ?? []) {
    for (const f of day.festivals) {
      result.push({
        name: f.name,
        hijri_month: params.hijri_month,
        hijri_day: day.hijri_day,
        hijri_month_name: '',
        gregorian_date: day.gregorian_date,
        category: (f.categories?.[0] ?? 'remembrance') as FestivalCategory,
        importance: f.importance as FestivalImportance,
        description: f.description,
        duration_days: f.duration_days,
        day_of_event: f.day_of_event,
      });
    }
  }
  return result;
}
