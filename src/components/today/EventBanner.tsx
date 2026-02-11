'use client';

import { useHijriDate } from '@/lib/hooks/useHijriDate';
import { Star } from 'lucide-react';

export default function EventBanner() {
  const { data: hijri } = useHijriDate();

  if (!hijri?.events?.length) return null;

  return (
    <div className="rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 p-3">
      {hijri.events.map((ev, i) => (
        <div key={i} className="flex items-center gap-2">
          <Star size={16} className="shrink-0 text-[var(--accent)]" />
          <span className="text-sm font-medium">{ev.name}</span>
        </div>
      ))}
    </div>
  );
}
