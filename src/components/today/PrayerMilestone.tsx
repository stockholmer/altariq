'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { formatTime12 } from '@/lib/utils/time';
import type { PrayerName } from '@/lib/types/prayer';

interface Props {
  name: PrayerName;
  time: string;
  isPast: boolean;
  isCurrent: boolean;
  isNext: boolean;
}

export default function PrayerMilestone({ name, time, isPast, isCurrent, isNext }: Props) {
  const t = useTranslations('today');

  return (
    <div className="flex shrink-0 flex-col items-center gap-1" style={{ minWidth: 72 }}>
      {/* Dot / check */}
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
          isPast
            ? 'border-[var(--text-2)]/30 bg-[var(--text-2)]/10 text-[var(--text-2)]'
            : isNext
              ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30'
              : isCurrent
                ? 'border-[var(--accent)]/50 bg-[var(--accent)]/20 text-[var(--accent)]'
                : 'border-[var(--text-2)]/20 bg-[var(--bg-card)] text-[var(--text-1)]'
        }`}
      >
        {isPast ? <Check size={16} /> : <span className="text-xs font-bold">{name[0].toUpperCase()}</span>}
      </div>

      {/* Label */}
      <span
        className={`text-xs font-medium ${
          isPast ? 'text-[var(--text-2)]/50' : isNext ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-1)]'
        }`}
      >
        {t(name)}
      </span>

      {/* Time */}
      <span className={`text-xs tabular-nums ${isPast ? 'text-[var(--text-2)]/40' : 'text-[var(--text-2)]'}`}>
        {formatTime12(time)}
      </span>
    </div>
  );
}
