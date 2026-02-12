'use client';

import { useMemo } from 'react';
import { useHijriDate } from './useHijriDate';
import { useCalendarMonth } from './useCalendarMonth';
import type { GregorianMonth, GregorianMonthDay } from '@/lib/types/calendar';
import type { Festival } from '@/lib/types/festival';

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function useGregorianMonth(gregYear: number | null, gregMonth: number | null) {
  // Find which Hijri month the 1st of the Gregorian month falls in
  const firstDayISO = gregYear !== null && gregMonth !== null
    ? toISO(gregYear, gregMonth, 1)
    : undefined;
  const { data: firstDayHijri } = useHijriDate(firstDayISO);

  // We need the Hijri month containing the 1st, plus the next one
  const hijriYear1 = firstDayHijri?.hijri_year ?? null;
  const hijriMonth1 = firstDayHijri?.hijri_month ?? null;
  const hijriYear2 = hijriMonth1 === 12 ? (hijriYear1 !== null ? hijriYear1 + 1 : null) : hijriYear1;
  const hijriMonth2 = hijriMonth1 !== null ? (hijriMonth1 === 12 ? 1 : hijriMonth1 + 1) : null;

  // Sometimes a Gregorian month spans 3 Hijri months, fetch a 3rd
  const hijriYear3 = hijriMonth2 === 12 ? (hijriYear2 !== null ? hijriYear2 + 1 : null) : hijriYear2;
  const hijriMonth3 = hijriMonth2 !== null ? (hijriMonth2 === 12 ? 1 : hijriMonth2 + 1) : null;

  const q1 = useCalendarMonth(hijriYear1, hijriMonth1);
  const q2 = useCalendarMonth(hijriYear2, hijriMonth2);
  const q3 = useCalendarMonth(hijriYear3, hijriMonth3);

  const result = useMemo(() => {
    if (gregYear === null || gregMonth === null) {
      return { month: undefined, festivals: [] as Festival[], isLoading: true };
    }

    if (!q1.month || !q2.month) {
      return { month: undefined, festivals: [] as Festival[], isLoading: true };
    }

    // Build a lookup map: gregorian_date -> hijri info
    const hijriMap = new Map<string, {
      hijri_year: number; hijri_month: number; hijri_day: number;
      hijri_month_name: string; weekday: string; events?: typeof q1.month.days[0]['events'];
    }>();

    for (const m of [q1.month, q2.month, q3.month]) {
      if (!m) continue;
      for (const d of m.days) {
        if (!hijriMap.has(d.gregorian_date)) {
          hijriMap.set(d.gregorian_date, {
            hijri_year: m.hijri_year,
            hijri_month: m.hijri_month,
            hijri_day: d.hijri_day,
            hijri_month_name: m.hijri_month_name,
            weekday: d.weekday,
            events: d.events,
          });
        }
      }
    }

    // Build Gregorian month days
    const numDays = daysInMonth(gregYear, gregMonth);
    const days: GregorianMonthDay[] = [];

    for (let d = 1; d <= numDays; d++) {
      const iso = toISO(gregYear, gregMonth, d);
      const hijri = hijriMap.get(iso);
      const jsDate = new Date(gregYear, gregMonth - 1, d);
      days.push({
        gregorian_date: iso,
        gregorian_day: d,
        weekday: hijri?.weekday ?? WEEKDAY_NAMES[jsDate.getDay()],
        hijri_year: hijri?.hijri_year ?? 0,
        hijri_month: hijri?.hijri_month ?? 0,
        hijri_day: hijri?.hijri_day ?? 0,
        hijri_month_name: hijri?.hijri_month_name ?? '',
        events: hijri?.events,
      });
    }

    const month: GregorianMonth = { year: gregYear, month: gregMonth, days };

    // Merge festivals from all fetched Hijri months, indexed by gregorian_date
    const allFestivals = [...q1.festivals, ...q2.festivals, ...(q3.festivals ?? [])];
    const gregDateSet = new Set(days.map((d) => d.gregorian_date));
    const festivals = allFestivals.filter((f) => gregDateSet.has(f.gregorian_date));

    return { month, festivals, isLoading: false };
  }, [gregYear, gregMonth, q1.month, q2.month, q3.month, q1.festivals, q2.festivals, q3.festivals]);

  return {
    month: result.month,
    festivals: result.festivals,
    isLoading: gregYear === null || gregMonth === null || q1.isLoading || q2.isLoading || result.isLoading,
  };
}
