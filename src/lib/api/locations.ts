import type { LocationsResponse, PresetLocation, LocationRegion, RegionSummary } from '@/lib/types/location';
import { CITIES } from '@/lib/data/cities';

/** Map city region strings to LocationRegion values */
function mapRegion(region: string): LocationRegion {
  const mapping: Record<string, LocationRegion> = {
    middle_east: 'arabian_peninsula',
    south_asia: 'south_asia',
    southeast_asia: 'southeast_asia',
    central_asia: 'central_asia',
    turkey: 'turkey_caucasus',
    north_africa: 'north_africa',
    africa: 'sub_saharan_africa',
    europe: 'europe',
    north_america: 'americas',
    oceania: 'oceania',
    east_asia: 'americas', // fallback
  };
  return mapping[region] ?? 'europe';
}

/** Map city region to a default prayer convention */
function defaultConvention(region: string): string {
  const mapping: Record<string, string> = {
    middle_east: 'makkah',
    south_asia: 'karachi',
    southeast_asia: 'mabims',
    central_asia: 'tehran',
    turkey: 'turkey',
    north_africa: 'egypt',
    africa: 'egypt',
    europe: 'mwl',
    north_america: 'isna',
    oceania: 'mwl',
    east_asia: 'mwl',
  };
  return mapping[region] ?? 'mwl';
}

/** Map city region to a default crescent criterion */
function defaultCriterion(region: string): string {
  const mapping: Record<string, string> = {
    middle_east: 'umm_al_qura',
    south_asia: 'pakistan',
    southeast_asia: 'mabims',
    central_asia: 'umm_al_qura',
    turkey: 'turkey',
    north_africa: 'umm_al_qura',
    africa: 'umm_al_qura',
    europe: 'isna',
    north_america: 'isna',
    oceania: 'isna',
    east_asia: 'isna',
  };
  return mapping[region] ?? 'umm_al_qura';
}

export async function fetchLocations(): Promise<LocationsResponse> {
  const locations: PresetLocation[] = CITIES.map((city) => ({
    id: `${city.city.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${city.country.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
    name: city.city,
    country: city.country,
    lat: city.lat,
    lon: city.lon,
    tz: city.timezone,
    criterion: defaultCriterion(city.region),
    prayer_convention: defaultConvention(city.region),
    region: mapRegion(city.region),
    category: 'global_city' as const,
  }));

  // Build region summaries
  const regionCounts = new Map<LocationRegion, number>();
  for (const loc of locations) {
    regionCounts.set(loc.region, (regionCounts.get(loc.region) ?? 0) + 1);
  }
  const regions: RegionSummary[] = Array.from(regionCounts.entries()).map(
    ([region, count]) => ({ region, count }),
  );

  return {
    locations,
    count: locations.length,
    regions,
  };
}
