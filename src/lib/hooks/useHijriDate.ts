'use client';

import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '@/lib/store/settings';
import { fetchHijriDate } from '@/lib/api/calendar';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function useHijriDate(date?: string) {
  const criterion = useSettingsStore((s) => s.criterion);
  const resolvedDate = date ?? todayISO();

  return useQuery({
    queryKey: ['hijriDate', resolvedDate, criterion],
    queryFn: () => fetchHijriDate({ date: resolvedDate, criterion }),
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}
