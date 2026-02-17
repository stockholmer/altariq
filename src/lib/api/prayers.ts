import { computePrayerTimes, computeQibla } from '../compute/prayer-times';
import type { PrayerTimes } from '@/lib/types/prayer';
import type { AsrMethod, PrayerConvention } from '@/lib/types/settings';
import { PRAYER_CONVENTIONS } from '../compute/constants';
import type { PrayerConventionId } from '../compute/types';

export async function fetchPrayerTimes(params: {
  lat: number;
  lon: number;
  tz: string;
  date?: string;
  convention?: PrayerConvention;
  asr?: AsrMethod;
}): Promise<PrayerTimes> {
  const dateStr = params.date ?? new Date().toISOString().split('T')[0];
  const conventionId = (params.convention ?? 'mwl') as PrayerConventionId;
  const asrMethod = params.asr ?? 'shafii';

  const times = computePrayerTimes(dateStr, params.lat, params.lon, params.tz, conventionId, asrMethod);
  const qibla = computeQibla(params.lat, params.lon);

  const conventionMeta = PRAYER_CONVENTIONS[conventionId];

  return {
    fajr: times.fajr ?? '',
    sunrise: times.sunrise ?? '',
    dhuhr: times.dhuhr ?? '',
    asr: times.asr ?? '',
    maghrib: times.maghrib ?? '',
    isha: times.isha ?? '',
    qibla_bearing: qibla.direction,
    date: dateStr,
    timezone: params.tz,
    convention: conventionMeta?.name ?? conventionId,
    asr_method: asrMethod,
    location: { lat: params.lat, lon: params.lon },
  };
}
