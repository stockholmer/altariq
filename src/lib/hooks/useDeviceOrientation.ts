'use client';

import { useState, useEffect, useCallback } from 'react';

interface DeviceOrientationState {
  heading: number | null;
  permission: 'granted' | 'denied' | 'prompt' | 'unsupported';
}

export function useDeviceOrientation() {
  const [state, setState] = useState<DeviceOrientationState>({
    heading: null,
    permission: 'prompt',
  });

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    // webkitCompassHeading for iOS, alpha for Android
    const heading =
      (e as DeviceOrientationEvent & { webkitCompassHeading?: number })
        .webkitCompassHeading ?? (e.alpha != null ? (360 - e.alpha) % 360 : null);
    if (heading != null) {
      setState((prev) => ({ ...prev, heading }));
    }
  }, []);

  const requestPermission = useCallback(async () => {
    // iOS 13+ requires explicit permission request
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof DOE.requestPermission === 'function') {
      try {
        const result = await DOE.requestPermission();
        if (result === 'granted') {
          setState((prev) => ({ ...prev, permission: 'granted' }));
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setState((prev) => ({ ...prev, permission: 'denied' }));
        }
      } catch {
        setState((prev) => ({ ...prev, permission: 'denied' }));
      }
    } else if ('DeviceOrientationEvent' in window) {
      // Android / non-iOS: just start listening
      setState((prev) => ({ ...prev, permission: 'granted' }));
      window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
      setState((prev) => ({ ...prev, permission: 'unsupported' }));
    }
  }, [handleOrientation]);

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation]);

  return { ...state, requestPermission };
}
