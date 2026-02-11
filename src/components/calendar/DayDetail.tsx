'use client';

import { CalendarDays, Star } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { HijriMonthDay } from '@/lib/types/calendar';
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

interface Props {
  day: HijriMonthDay;
  hijriYear: number;
  hijriMonthName: string;
  festivals: Festival[];
}

export default function DayDetail({ day, hijriYear, hijriMonthName, festivals }: Props) {
  const tc = useTranslations('calendar');
  const tf = useTranslations('festivals');
  const locale = useLocale();

  const gregFormatted = new Date(day.gregorian_date + 'T12:00:00')
    .toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const allEvents: { name: string; description?: string; category: string }[] = [];

  for (const f of festivals) {
    allEvents.push({ name: f.name, description: f.description, category: f.category });
  }

  if (day.events) {
    for (const e of day.events) {
      if (!allEvents.some((a) => a.name === e.name)) {
        allEvents.push({ name: e.name, description: e.description, category: e.category ?? 'remembrance' });
      }
    }
  }

  return (
    <div className="mt-3 rounded-xl bg-[var(--bg-card)] p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] shrink-0">
          <CalendarDays size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-base font-semibold">
            {day.hijri_day} {hijriMonthName} {hijriYear} {tc('ah')}
          </p>
          <p className="text-sm text-[var(--text-2)]">
            {gregFormatted}
          </p>
        </div>
      </div>

      {allEvents.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-[var(--text-2)]/10 pt-3">
          {allEvents.map((ev, i) => {
            const catKey = CATEGORY_KEYS[ev.category];
            const catLabel = catKey ? tf(catKey as Parameters<typeof tf>[0]) : ev.category;
            return (
              <div key={i} className="flex items-start gap-2">
                <Star size={14} className="text-[var(--accent)] mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{ev.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_BADGE[ev.category] ?? 'bg-[var(--accent)]/10 text-[var(--accent)]'}`}>
                      {catLabel}
                    </span>
                  </div>
                  {ev.description && (
                    <p className="text-xs text-[var(--text-2)] mt-0.5">{ev.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {allEvents.length === 0 && (
        <p className="mt-3 text-sm text-[var(--text-2)] border-t border-[var(--text-2)]/10 pt-3">
          {tc('noEventsDay')}
        </p>
      )}
    </div>
  );
}
