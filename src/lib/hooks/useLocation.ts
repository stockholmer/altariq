'use client';

import { useState, useCallback } from 'react';
import { useSettingsStore } from '@/lib/store/settings';
import { detectLocation } from '@/lib/utils/geolocation';

export function useLocation() {
  const location = useSettingsStore((s) => s.location);
  const setLocation = useSettingsStore((s) => s.setLocation);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(async () => {
    setDetecting(true);
    setError(null);
    try {
      const loc = await detectLocation();
      setLocation(loc);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Location detection failed');
    } finally {
      setDetecting(false);
    }
  }, [setLocation]);

  return { location, detecting, error, detect };
}
