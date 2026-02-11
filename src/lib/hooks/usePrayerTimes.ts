'use client';

import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '@/lib/store/settings';
import { fetchPrayerTimes } from '@/lib/api/prayers';
import { todayDateString } from '@/lib/utils/time';

export function usePrayerTimes() {
  const location = useSettingsStore((s) => s.location);
  const convention = useSettingsStore((s) => s.convention);
  const asrMethod = useSettingsStore((s) => s.asrMethod);

  return useQuery({
    queryKey: ['prayerTimes', location?.lat, location?.lon, convention, asrMethod],
    queryFn: () => {
      if (!location) throw new Error('No location set');
      return fetchPrayerTimes({
        lat: location.lat,
        lon: location.lon,
        tz: location.timezone,
        date: todayDateString(location.timezone),
        convention,
        asr: asrMethod,
      });
    },
    enabled: !!location,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
