'use client';

import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '@/lib/store/settings';
import { fetchHijriMonth } from '@/lib/api/calendar';
import { fetchMonthFestivals } from '@/lib/api/festivals';

export function useCalendarMonth(hijriYear: number | null, hijriMonth: number | null) {
  const criterion = useSettingsStore((s) => s.criterion);
  const enabled = hijriYear !== null && hijriMonth !== null;

  const monthQuery = useQuery({
    queryKey: ['hijriMonth', hijriYear, hijriMonth, criterion],
    queryFn: () => fetchHijriMonth({ hijri_year: hijriYear!, hijri_month: hijriMonth!, criterion }),
    enabled,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });

  const festivalsQuery = useQuery({
    queryKey: ['monthFestivals', hijriYear, hijriMonth],
    queryFn: () => fetchMonthFestivals({ hijri_year: hijriYear!, hijri_month: hijriMonth! }),
    enabled,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });

  // Only return data if it matches the currently requested month
  const monthData = monthQuery.data;
  const dataMatchesRequest = monthData &&
    monthData.hijri_year === hijriYear &&
    monthData.hijri_month === hijriMonth;

  return {
    month: dataMatchesRequest ? monthData : undefined,
    festivals: dataMatchesRequest ? (festivalsQuery.data ?? []) : [],
    isLoading: !enabled || monthQuery.isLoading || (monthQuery.isFetching && !dataMatchesRequest),
  };
}
