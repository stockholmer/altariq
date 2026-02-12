'use client';

import { useTranslations } from 'next-intl';
import DayCell from './DayCell';
import type { GregorianMonth } from '@/lib/types/calendar';
import type { HijriMonthDay } from '@/lib/types/calendar';
import type { Festival } from '@/lib/types/festival';

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

interface Props {
  month: GregorianMonth;
  festivals: Festival[];
  todayGreg: string;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export default function GregorianGrid({ month, festivals, todayGreg, selectedDate, onSelectDate }: Props) {
  const t = useTranslations('calendar');

  // First day of Gregorian month: 0=Sun, 1=Mon, ...
  const firstDayOffset = new Date(month.year, month.month - 1, 1).getDay();

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-[var(--text-2)] py-1">
            {t(d)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {month.days.map((gregDay) => {
          const dayFestivals = festivals.filter((f) => f.gregorian_date === gregDay.gregorian_date);
          const isToday = gregDay.gregorian_date === todayGreg;

          // Construct a compatible HijriMonthDay for DayCell
          const hijriDay: HijriMonthDay = {
            hijri_day: gregDay.hijri_day,
            gregorian_date: gregDay.gregorian_date,
            weekday: gregDay.weekday,
            events: gregDay.events,
          };

          return (
            <DayCell
              key={gregDay.gregorian_date}
              day={hijriDay}
              festivals={dayFestivals}
              isToday={isToday}
              isSelected={selectedDate === gregDay.gregorian_date}
              isRamadanMonth={false}
              onSelect={() => onSelectDate(gregDay.gregorian_date)}
              mode="gregorian"
              gregDay={gregDay}
            />
          );
        })}
      </div>
    </div>
  );
}
