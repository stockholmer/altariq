import { apiFetch } from './client';
import type { PrayerTimes } from '@/lib/types/prayer';
import type { AsrMethod, PrayerConvention } from '@/lib/types/settings';

// Actual API response shape (nested)
interface PrayerApiResponse {
  date: string;
  location: { lat: number; lon: number };
  timezone: string;
  convention: string;
  convention_id: string;
  asr_method: string;
  times: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    midnight: string;
  };
  qibla: { direction: number; distance_km: number };
}

export async function fetchPrayerTimes(params: {
  lat: number;
  lon: number;
  tz: string;
  date?: string;
  convention?: PrayerConvention;
  asr?: AsrMethod;
}): Promise<PrayerTimes> {
  const raw = await apiFetch<PrayerApiResponse>('islamic-calendar/prayers', {
    lat: params.lat,
    lon: params.lon,
    tz: params.tz,
    date: params.date,
    convention: params.convention,
    asr: params.asr,
  });
  return {
    fajr: raw.times.fajr,
    sunrise: raw.times.sunrise,
    dhuhr: raw.times.dhuhr,
    asr: raw.times.asr,
    maghrib: raw.times.maghrib,
    isha: raw.times.isha,
    qibla_bearing: raw.qibla.direction,
    date: raw.date,
    timezone: raw.timezone,
    convention: raw.convention,
    asr_method: raw.asr_method,
    location: raw.location,
  };
}
