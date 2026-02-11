'use client';

import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '@/lib/store/settings';
import { fetchHijriMonth } from '@/lib/api/calendar';
import { fetchMonthFestivals } from '@/lib/api/festivals';

export function useCalendarMonth(hijriYear: number, hijriMonth: number) {
  const criterion = useSettingsStore((s) => s.criterion);

  const monthQuery = useQuery({
    queryKey: ['hijriMonth', hijriYear, hijriMonth, criterion],
    queryFn: () => fetchHijriMonth({ hijri_year: hijriYear, hijri_month: hijriMonth, criterion }),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });

  const festivalsQuery = useQuery({
    queryKey: ['monthFestivals', hijriYear, hijriMonth],
    queryFn: () => fetchMonthFestivals({ hijri_year: hijriYear, hijri_month: hijriMonth }),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });

  return {
    month: monthQuery.data,
    festivals: festivalsQuery.data ?? [],
    isLoading: monthQuery.isLoading,
  };
}
