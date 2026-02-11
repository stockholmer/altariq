export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  qibla_bearing: number;
  date: string;
  timezone: string;
  convention: string;
  asr_method: string;
  location: { lat: number; lon: number };
}

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export const PRAYER_NAMES: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export interface PrayerMilestoneData {
  name: PrayerName;
  time: string;
  minutesSinceMidnight: number;
  isPast: boolean;
  isCurrent: boolean;
  isNext: boolean;
}
