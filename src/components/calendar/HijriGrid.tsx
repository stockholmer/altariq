'use client';

import { useTranslations } from 'next-intl';
import DayCell from './DayCell';
import type { HijriMonth } from '@/lib/types/calendar';
import type { Festival } from '@/lib/types/festival';
import { isRamadan } from '@/lib/utils/ramadan';

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
const WEEKDAY_INDEX: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
};

interface Props {
  month: HijriMonth;
  festivals: Festival[];
  todayGreg: string;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
}

export default function HijriGrid({ month, festivals, todayGreg, selectedDay, onSelectDay }: Props) {
  const t = useTranslations('calendar');

  const firstDayWeekday = WEEKDAY_INDEX[month.days[0]?.weekday] ?? 0;
  const isRamadanMonth = isRamadan(month.hijri_month);

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
        {Array.from({ length: firstDayWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {month.days.map((day) => {
          const dayFestivals = festivals.filter((f) => f.hijri_day === day.hijri_day);
          const isToday = day.gregorian_date === todayGreg;
          return (
            <DayCell
              key={day.hijri_day}
              day={day}
              festivals={dayFestivals}
              isToday={isToday}
              isSelected={selectedDay === day.hijri_day}
              isRamadanMonth={isRamadanMonth}
              onSelect={() => onSelectDay(day.hijri_day)}
            />
          );
        })}
      </div>
    </div>
  );
}
