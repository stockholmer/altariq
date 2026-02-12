'use client';

import { useLocale } from 'next-intl';
import type { HijriMonthDay } from '@/lib/types/calendar';
import type { Festival } from '@/lib/types/festival';
import { isLast10, isOddNight } from '@/lib/utils/ramadan';

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
  isRamadanMonth: boolean;
  onSelect: () => void;
}

export default function DayCell({ day, festivals, isToday, isSelected, isRamadanMonth, onSelect }: Props) {
  const locale = useLocale();
  const gregDate = new Date(day.gregorian_date + 'T12:00:00');
  const gregLabel = gregDate.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  const isFriday = day.weekday === 'Friday';
  const hasEvent = festivals.length > 0 || (day.events && day.events.length > 0);
  const topCategory = festivals[0]?.category;

  const last10 = isRamadanMonth && isLast10(day.hijri_day);
  const oddNight = isRamadanMonth && isOddNight(day.hijri_day);

  // Background classes
  let bgClass = '';
  if (isSelected) {
    bgClass = 'ring-2 ring-[var(--accent)] bg-[var(--accent)]/15';
  } else if (isRamadanMonth && !hasEvent) {
    bgClass = 'bg-fasting/8 hover:bg-fasting/15';
  } else if (hasEvent && !isSelected) {
    bgClass = CATEGORY_BG[topCategory] ?? 'bg-[var(--accent)]/8';
  } else {
    bgClass = 'hover:bg-[var(--accent)]/5';
  }

  return (
    <button
      onClick={onSelect}
      className={`relative flex flex-col items-center rounded-lg p-1 min-h-[3rem] text-center transition-colors
        ${bgClass}
        ${isToday && !isSelected ? 'ring-2 ring-[var(--accent)]/50' : ''}
      `}
    >
      <span className={`text-base font-semibold leading-tight
        ${isToday || isSelected ? 'text-[var(--accent)]' : ''}
        ${isFriday && !isToday && !isSelected ? 'text-fasting' : ''}
      `}>
        {day.hijri_day}
      </span>
      <span className="text-[9px] leading-tight text-[var(--text-2)]">{gregLabel}</span>
      <div className="mt-0.5 flex gap-0.5 items-center">
        {festivals.slice(0, 3).map((f, i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT[f.category] ?? 'bg-[var(--accent)]'}`} />
        ))}
        {festivals.length === 0 && day.events && day.events.length > 0 && (
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        )}
        {last10 && (
          <span className="text-[8px] leading-none text-night-worship">&#9733;</span>
        )}
        {oddNight && (
          <span className="text-[8px] leading-none text-[var(--accent)]">&#9790;</span>
        )}
      </div>
    </button>
  );
}
