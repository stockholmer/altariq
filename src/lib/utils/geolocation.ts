import type { LocationData } from '@/lib/types/settings';

/**
 * Get user location via Geolocation API, then reverse-geocode with Nominatim.
 */
export async function detectLocation(): Promise<LocationData> {
  const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    });
  });

  const { latitude: lat, longitude: lon } = pos.coords;

  // Reduce precision to ~1 km for privacy before sending to third-party
  const coarseLat = Math.round(lat * 100) / 100;
  const coarseLon = Math.round(lon * 100) / 100;

  // Reverse geocode with OpenStreetMap Nominatim (free, no key)
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${coarseLat}&lon=${coarseLon}&format=json&zoom=10`,
    { headers: { 'User-Agent': 'altariq-pwa/1.0' } }
  );
  const data = await res.json();

  const city =
    data.address?.city ??
    data.address?.town ??
    data.address?.village ??
    data.address?.county ??
    'Unknown';
  const country = data.address?.country ?? '';

  // Detect timezone from browser
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return { lat, lon, city, country, timezone };
}
