'use client';

import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '@/lib/store/settings';
import { fetchHijriDate } from '@/lib/api/calendar';

export function useHijriDate(date?: string) {
  const criterion = useSettingsStore((s) => s.criterion);

  return useQuery({
    queryKey: ['hijriDate', date, criterion],
    queryFn: () => fetchHijriDate({ date, criterion }),
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}
