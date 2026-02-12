'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchLocations } from '@/lib/api/locations';

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days - locations rarely change
    gcTime: 30 * 24 * 60 * 60 * 1000,
  });
}
