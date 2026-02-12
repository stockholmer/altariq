import { apiFetch } from './client';
import type { LocationsResponse } from '@/lib/types/location';

export async function fetchLocations(): Promise<LocationsResponse> {
  return apiFetch<LocationsResponse>('islamic-calendar/locations');
}
