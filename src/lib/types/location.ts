export type LocationRegion =
  | 'arabian_peninsula'
  | 'levant_iraq'
  | 'north_africa'
  | 'sub_saharan_africa'
  | 'south_asia'
  | 'southeast_asia'
  | 'central_asia'
  | 'turkey_caucasus'
  | 'europe'
  | 'americas'
  | 'oceania';

export interface PresetLocation {
  id: string;
  name: string;
  name_arabic?: string;
  country: string;
  lat: number;
  lon: number;
  tz: string;
  criterion: string;
  prayer_convention: string;
  region: LocationRegion;
  category: 'islamic_center' | 'global_city';
}

export interface RegionSummary {
  region: LocationRegion;
  count: number;
}

export interface LocationsResponse {
  locations: PresetLocation[];
  count: number;
  regions: RegionSummary[];
}
