'use client';

import { useRef, useEffect, useMemo } from 'react';
import PrayerMilestone from './PrayerMilestone';
import type { PrayerTimes, PrayerName } from '@/lib/types/prayer';
import { PRAYER_NAMES } from '@/lib/types/prayer';
import { timeToMinutes, nowMinutes } from '@/lib/utils/time';

interface Props {
  prayers: PrayerTimes;
}

export default function PathTimeline({ prayers }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const prayerData = useMemo(() => {
    const now = nowMinutes(prayers.timezone);
    const times: { name: PrayerName; time: string; mins: number }[] = PRAYER_NAMES.map((name) => ({
      name,
      time: prayers[name],
      mins: timeToMinutes(prayers[name]),
    }));

    let nextIdx = times.findIndex((p) => p.mins > now);
    // All past
    if (nextIdx === -1) nextIdx = -1;

    return times.map((p, i) => ({
      ...p,
      isPast: nextIdx === -1 ? true : i < nextIdx,
      isCurrent: nextIdx !== -1 && i === nextIdx - 1,
      isNext: i === nextIdx,
    }));
  }, [prayers]);

  // Auto-scroll to next prayer on mount
  useEffect(() => {
    const nextIdx = prayerData.findIndex((p) => p.isNext);
    if (nextIdx !== -1 && scrollRef.current) {
      const target = Math.max(0, nextIdx * 88 - 120);
      scrollRef.current.scrollTo({ left: target, behavior: 'smooth' });
    }
  }, [prayerData]);

  return (
    <div className="relative">
      {/* Road background line */}
      <div className="absolute left-0 right-0 top-[19px] z-0 mx-8 h-0.5 rounded-full bg-[var(--text-2)]/15" />

      {/* Milestones */}
      <div
        ref={scrollRef}
        className="hide-scrollbar relative z-10 flex gap-2 overflow-x-auto px-4 py-1"
      >
        {prayerData.map((p) => (
          <PrayerMilestone
            key={p.name}
            name={p.name}
            time={p.time}
            isPast={p.isPast}
            isCurrent={p.isCurrent}
            isNext={p.isNext}
          />
        ))}
      </div>
    </div>
  );
}
