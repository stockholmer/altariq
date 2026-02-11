'use client';

import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '@/lib/store/settings';
import { fetchUpcomingFestivals, fetchYearFestivals } from '@/lib/api/festivals';

export function useUpcomingFestivals(count = 10) {
  const criterion = useSettingsStore((s) => s.criterion);
  const locale = useSettingsStore((s) => s.locale);

  return useQuery({
    queryKey: ['upcomingFestivals', count, criterion, locale],
    queryFn: () => fetchUpcomingFestivals({ count, criterion, locale }),
    staleTime: 1000 * 60 * 60 * 6,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}

export function useYearFestivals(year: number) {
  const criterion = useSettingsStore((s) => s.criterion);
  const locale = useSettingsStore((s) => s.locale);

  return useQuery({
    queryKey: ['yearFestivals', year, criterion, locale],
    queryFn: () => fetchYearFestivals({ year, criterion, locale }),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}
