'use client';

import { useState, useEffect } from 'react';

/**
 * Countdown to a target time (HH:MM string) in the given timezone.
 * Returns seconds remaining, updated every second.
 */
export function useCountdown(targetTime: string | null, timezone: string) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!targetTime) {
      setSecondsLeft(0);
      return;
    }

    function calc() {
      const now = new Date();
      const nowStr = now.toLocaleString('en-US', { timeZone: timezone });
      const nowLocal = new Date(nowStr);

      const [h, m] = targetTime!.split(':').map(Number);
      const target = new Date(nowLocal);
      target.setHours(h, m, 0, 0);

      // If target already passed today, it's done
      const diff = Math.max(0, Math.floor((target.getTime() - nowLocal.getTime()) / 1000));
      setSecondsLeft(diff);
    }

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [targetTime, timezone]);

  return secondsLeft;
}
