'use client';

import { Star } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { HijriMonth } from '@/lib/types/calendar';
import type { Festival } from '@/lib/types/festival';

const CATEGORY_BADGE: Record<string, string> = {
  eid: 'bg-eid/15 text-eid',
  fasting: 'bg-fasting/15 text-fasting',
  night_worship: 'bg-night-worship/15 text-night-worship',
  hajj: 'bg-hajj/15 text-hajj',
  remembrance: 'bg-remembrance/15 text-remembrance',
  sacred_month: 'bg-sacred/15 text-sacred',
};

const CATEGORY_KEYS: Record<string, string> = {
  eid: 'eid',
  fasting: 'fasting',
  night_worship: 'night_worship',
  hajj: 'hajj',
  remembrance: 'remembrance',
  sacred_month: 'sacred_month',
};

interface EventRow {
  hijriDay: number;
  gregorianDate: string;
  weekday: string;
  name: string;
  description?: string;
  category: string;
}

interface Props {
  month: HijriMonth;
  festivals: Festival[];
  hijriMonthName: string;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
}

export default function MonthEvents({ month, festivals, hijriMonthName, selectedDay, onSelectDay }: Props) {
  const tc = useTranslations('calendar');
  const tf = useTranslations('festivals');
  const locale = useLocale();

  const rows: EventRow[] = [];
  const seen = new Set<string>();

  for (const f of festivals) {
    const day = month.days.find((d) => d.hijri_day === f.hijri_day);
    const key = `${f.hijri_day}-${f.name}`;
    if (!seen.has(key)) {
      seen.add(key);
      rows.push({
        hijriDay: f.hijri_day,
        gregorianDate: day?.gregorian_date ?? f.gregorian_date,
        weekday: day?.weekday ?? '',
        name: f.name,
        description: f.description,
        category: f.category,
      });
    }
  }

  for (const day of month.days) {
    if (day.events) {
      for (const e of day.events) {
        const key = `${day.hijri_day}-${e.name}`;
        if (!seen.has(key)) {
          seen.add(key);
          rows.push({
            hijriDay: day.hijri_day,
            gregorianDate: day.gregorian_date,
            weekday: day.weekday,
            name: e.name,
            description: e.description,
            category: e.category ?? 'remembrance',
          });
        }
      }
    }
  }

  rows.sort((a, b) => a.hijriDay - b.hijriDay);

  if (rows.length === 0) {
    return (
      <div className="mt-4 rounded-xl bg-[var(--bg-card)] p-4 text-sm text-[var(--text-2)]">
        {tc('noEventsMonth')}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-[var(--text-2)] mb-2">
        {tc('eventsIn', { month: hijriMonthName })}
      </h3>
      <div className="space-y-2">
        {rows.map((ev, i) => {
          const gregLabel = new Date(ev.gregorianDate + 'T12:00:00')
            .toLocaleDateString(locale, { month: 'short', day: 'numeric' });
          const catKey = CATEGORY_KEYS[ev.category];
          const catLabel = catKey ? tf(catKey as Parameters<typeof tf>[0]) : ev.category;
          return (
            <button
              key={i}
              onClick={() => onSelectDay(ev.hijriDay)}
              className={`w-full rounded-xl bg-[var(--bg-card)] p-3 text-left transition-colors flex items-start gap-3
                ${selectedDay === ev.hijriDay ? 'ring-2 ring-[var(--accent)]' : 'hover:bg-[var(--accent)]/5'}
              `}
            >
              <div className="flex flex-col items-center shrink-0 w-10">
                <span className="text-lg font-bold text-[var(--accent)]">{ev.hijriDay}</span>
                <span className="text-[10px] text-[var(--text-2)]">{gregLabel}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Star size={12} className="text-[var(--accent)] shrink-0" />
                  <span className="text-sm font-medium">{ev.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_BADGE[ev.category] ?? 'bg-[var(--accent)]/10 text-[var(--accent)]'}`}>
                    {catLabel}
                  </span>
                </div>
                {ev.description && (
                  <p className="text-xs text-[var(--text-2)] mt-0.5 line-clamp-2">{ev.description}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
