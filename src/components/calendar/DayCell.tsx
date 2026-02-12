'use client';

import { useLocale } from 'next-intl';
import type { HijriMonthDay, CalendarViewMode, GregorianMonthDay } from '@/lib/types/calendar';
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

// Short Hijri month abbreviations (3-letter)
const HIJRI_SHORT: Record<number, string> = {
  1: 'Muh', 2: 'Saf', 3: 'Rb1', 4: 'Rb2', 5: 'Jm1', 6: 'Jm2',
  7: 'Raj', 8: 'Sha', 9: 'Ram', 10: 'Shw', 11: 'DhQ', 12: 'DhH',
};

interface Props {
  day: HijriMonthDay;
  festivals: Festival[];
  isToday: boolean;
  isSelected: boolean;
  isRamadanMonth: boolean;
  onSelect: () => void;
  mode?: CalendarViewMode;
  gregDay?: GregorianMonthDay;
}

export default function DayCell({ day, festivals, isToday, isSelected, isRamadanMonth, onSelect, mode = 'hijri', gregDay }: Props) {
  const locale = useLocale();
  const isFriday = day.weekday === 'Friday';
  const hasEvent = festivals.length > 0 || (day.events && day.events.length > 0);
  const topCategory = festivals[0]?.category;

  const isRamadanDay = mode === 'gregorian'
    ? (gregDay?.hijri_month === 9)
    : isRamadanMonth;
  const hijriDay = mode === 'gregorian' ? (gregDay?.hijri_day ?? 0) : day.hijri_day;
  const last10 = isRamadanDay && isLast10(hijriDay);
  const oddNight = isRamadanDay && isOddNight(hijriDay);

  // Background classes
  let bgClass = '';
  if (isSelected) {
    bgClass = 'ring-2 ring-[var(--accent)] bg-[var(--accent)]/15';
  } else if (isRamadanDay && !hasEvent) {
    bgClass = 'bg-fasting/8 hover:bg-fasting/15';
  } else if (hasEvent && !isSelected) {
    bgClass = CATEGORY_BG[topCategory] ?? 'bg-[var(--accent)]/8';
  } else {
    bgClass = 'hover:bg-[var(--accent)]/5';
  }

  // Primary and secondary labels
  let primaryNumber: number;
  let secondaryLabel: string;

  if (mode === 'gregorian' && gregDay) {
    primaryNumber = gregDay.gregorian_day;
    const shortMonth = HIJRI_SHORT[gregDay.hijri_month] ?? '';
    secondaryLabel = `${gregDay.hijri_day} ${shortMonth}`;
  } else {
    primaryNumber = day.hijri_day;
    const gregDate = new Date(day.gregorian_date + 'T12:00:00');
    secondaryLabel = gregDate.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
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
        {primaryNumber}
      </span>
      <span className="text-[9px] leading-tight text-[var(--text-2)]">{secondaryLabel}</span>
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
