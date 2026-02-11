import { apiFetch } from './client';
import type { HijriDate, HijriMonth, HijriMonthDay, HijriEvent } from '@/lib/types/calendar';
import type { CrescentCriterion } from '@/lib/types/settings';

// Actual API response shapes (nested)
interface DayApiResponse {
  date: string;
  hijri: {
    year: number;
    month: number;
    day: number;
    month_name: string;
    month_name_arabic?: string;
    month_name_short?: string;
    weekday: string;
    formatted?: string;
  };
  criterion: string;
  events: {
    key: string;
    name: string;
    is_major: boolean;
    description: string;
    hijri_month?: number;
    hijri_day?: number;
  }[];
}

interface MonthApiResponse {
  hijri_year: number;
  hijri_month: number;
  month_name: string;
  month_name_arabic?: string;
  gregorian_range?: { start: string; end: string; days: number };
  events: {
    key: string;
    name: string;
    hijri_month: number;
    hijri_day: number;
    is_major: boolean;
    description: string;
  }[];
  days: {
    hijri_day: number;
    gregorian_date: string;
    weekday: string;
    events: {
      key: string;
      name: string;
      hijri_month: number;
      hijri_day: number;
      is_major: boolean;
      description: string;
    }[];
  }[];
}

function normalizeEvent(e: { key: string; name: string; hijri_month?: number; hijri_day?: number; is_major: boolean; description: string }): HijriEvent {
  return {
    name: e.name,
    hijri_month: e.hijri_month ?? 0,
    hijri_day: e.hijri_day ?? 0,
    category: e.is_major ? 'eid' : 'remembrance',
    importance: e.is_major ? 'major' : 'observance',
    description: e.description,
  };
}

export async function fetchHijriDate(params: {
  date?: string;
  criterion?: CrescentCriterion;
}): Promise<HijriDate> {
  const raw = await apiFetch<DayApiResponse>('islamic-calendar/day', {
    date: params.date,
    criterion: params.criterion,
  });
  return {
    hijri_year: raw.hijri.year,
    hijri_month: raw.hijri.month,
    hijri_day: raw.hijri.day,
    hijri_month_name: raw.hijri.month_name,
    weekday: raw.hijri.weekday,
    gregorian_date: raw.date,
    criterion: raw.criterion,
    events: (raw.events ?? []).map(normalizeEvent),
  };
}

export async function fetchHijriMonth(params: {
  hijri_year: number;
  hijri_month: number;
  criterion?: CrescentCriterion;
}): Promise<HijriMonth> {
  const raw = await apiFetch<MonthApiResponse>('islamic-calendar/month', {
    hijri_year: params.hijri_year,
    hijri_month: params.hijri_month,
    criterion: params.criterion,
  });
  return {
    hijri_year: raw.hijri_year,
    hijri_month: raw.hijri_month,
    hijri_month_name: raw.month_name,
    criterion: params.criterion ?? 'umm_al_qura',
    days: raw.days.map((d): HijriMonthDay => ({
      hijri_day: d.hijri_day,
      gregorian_date: d.gregorian_date,
      weekday: d.weekday,
      events: (d.events ?? []).map(normalizeEvent),
    })),
  };
}
