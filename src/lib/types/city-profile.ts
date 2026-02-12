import type { PrayerConvention, AsrMethod, CrescentCriterion } from './settings';

export interface CityProfile {
  id: string;
  name: string;
  lat: number;
  lon: number;
  tz: string;
  convention: PrayerConvention;
  asrMethod: AsrMethod;
  criterion: CrescentCriterion;
}
