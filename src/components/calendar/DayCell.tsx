'use client';

import { useLocale } from 'next-intl';
import type { HijriMonthDay } from '@/lib/types/calendar';
import type { Festival } from '@/lib/types/festival';

const CATEGORY_BG: Record<string, string> = {
  eid: 'bg-eid/15',
  fasting: 'bg-fasting/15',
  night_worship: 'bg-night-worship/15',
  hajj: 'bg-hajj/15',
  remembrance: 'bg-remembrance/15',
  sacred_month: 'bg-sacred/15',
};

const CATEGORY_DOT: Record<string, string> = {
  eid: 'bg-eid',
  fasting: 'bg-fasting',
  night_worship: 'bg-night-worship',
  hajj: 'bg-hajj',
  remembrance: 'bg-remembrance',
  sacred_month: 'bg-sacred',
};

interface Props {
  day: HijriMonthDay;
  festivals: Festival[];
  isToday: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export default function DayCell({ day, festivals, isToday, isSelected, onSelect }: Props) {
  const locale = useLocale();
  const gregDate = new Date(day.gregorian_date + 'T12:00:00');
  const gregLabel = gregDate.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  const isFriday = day.weekday === 'Friday';
  const hasEvent = festivals.length > 0 || (day.events && day.events.length > 0);
  const topCategory = festivals[0]?.category;

  return (
    <button
      onClick={onSelect}
      className={`relative flex flex-col items-center rounded-lg p-1 min-h-[3rem] text-center transition-colors
        ${isSelected ? 'ring-2 ring-[var(--accent)] bg-[var(--accent)]/15' : 'hover:bg-[var(--accent)]/5'}
        ${isToday && !isSelected ? 'ring-2 ring-[var(--accent)]/50' : ''}
        ${hasEvent && !isSelected ? (CATEGORY_BG[topCategory] ?? 'bg-[var(--accent)]/8') : ''}
      `}
    >
      <span className={`text-base font-semibold leading-tight
        ${isToday || isSelected ? 'text-[var(--accent)]' : ''}
        ${isFriday && !isToday && !isSelected ? 'text-fasting' : ''}
      `}>
        {day.hijri_day}
      </span>
      <span className="text-[9px] leading-tight text-[var(--text-2)]">{gregLabel}</span>
      {hasEvent && (
        <div className="mt-0.5 flex gap-0.5">
          {festivals.slice(0, 3).map((f, i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT[f.category] ?? 'bg-[var(--accent)]'}`} />
          ))}
          {festivals.length === 0 && day.events && day.events.length > 0 && (
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          )}
        </div>
      )}
    </button>
  );
}
