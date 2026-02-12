'use client';

import { useMemo } from 'react';
import { useHijriDate } from './useHijriDate';
import { usePrayerTimes } from './usePrayerTimes';
import { isRamadan, isLast10, isOddNight, getRamadanDay } from '@/lib/utils/ramadan';
import { timeToMinutes, nowMinutes } from '@/lib/utils/time';

interface RamadanStatus {
  active: boolean;
  day: number;
  last10: boolean;
  oddNight: boolean;
  /** true when next prayer is Maghrib (before iftar) */
  beforeIftar: boolean;
  fajrTime: string | null;
  maghribTime: string | null;
}

export function useRamadanStatus(): RamadanStatus {
  const { data: hijri } = useHijriDate();
  const { data: prayers } = usePrayerTimes();

  return useMemo(() => {
    const inactive: RamadanStatus = {
      active: false, day: 0, last10: false, oddNight: false,
      beforeIftar: false, fajrTime: null, maghribTime: null,
    };

    if (!hijri || !isRamadan(hijri.hijri_month)) return inactive;

    const day = getRamadanDay(hijri.hijri_day);
    const fajrTime = prayers?.fajr ?? null;
    const maghribTime = prayers?.maghrib ?? null;

    let beforeIftar = false;
    if (prayers) {
      const now = nowMinutes(prayers.timezone);
      const fajrMins = timeToMinutes(prayers.fajr);
      const maghribMins = timeToMinutes(prayers.maghrib);
      // Between Fajr and Maghrib = fasting = before iftar
      beforeIftar = now >= fajrMins && now < maghribMins;
    }

    return {
      active: true,
      day,
      last10: isLast10(hijri.hijri_day),
      oddNight: isOddNight(hijri.hijri_day),
      beforeIftar,
      fajrTime,
      maghribTime,
    };
  }, [hijri, prayers]);
}
