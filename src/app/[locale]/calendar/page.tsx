'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useHijriDate } from '@/lib/hooks/useHijriDate';
import { useCalendarMonth } from '@/lib/hooks/useCalendarMonth';
import MonthNavigator from '@/components/calendar/MonthNavigator';
import HijriGrid from '@/components/calendar/HijriGrid';
import DayDetail from '@/components/calendar/DayDetail';
import MonthEvents from '@/components/calendar/MonthEvents';

export default function CalendarPage() {
  const t = useTranslations('calendar');
  const { data: todayHijri } = useHijriDate();

  const [year, setYear] = useState(1447);
  const [month, setMonth] = useState(1);
  const [initialized, setInitialized] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    if (todayHijri && !initialized) {
      setYear(todayHijri.hijri_year);
      setMonth(todayHijri.hijri_month);
      setInitialized(true);
    }
  }, [todayHijri, initialized]);

  const { month: monthData, festivals, isLoading } = useCalendarMonth(year, month);

  const todayGreg = todayHijri?.gregorian_date ?? '';
  const hijriMonthName = t(`hijriMonth_${month}` as Parameters<typeof t>[0]);

  function goPrev() {
    setSelectedDay(null);
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function goNext() {
    setSelectedDay(null);
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const selectedDayData = selectedDay !== null && monthData
    ? monthData.days.find((d) => d.hijri_day === selectedDay)
    : null;
  const selectedFestivals = selectedDay !== null
    ? festivals.filter((f) => f.hijri_day === selectedDay)
    : [];

  return (
    <div className="pt-2 pb-4">
      <MonthNavigator
        year={year}
        month={month}
        monthData={monthData}
        onPrev={goPrev}
        onNext={goNext}
      />

      {isLoading || !monthData ? (
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-[var(--bg-card)]" />
          ))}
        </div>
      ) : (
        <>
          <HijriGrid
            month={monthData}
            festivals={festivals}
            todayGreg={todayGreg}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />

          {selectedDayData && (
            <DayDetail
              day={selectedDayData}
              hijriYear={year}
              hijriMonthName={hijriMonthName}
              festivals={selectedFestivals}
            />
          )}

          <MonthEvents
            month={monthData}
            festivals={festivals}
            hijriMonthName={hijriMonthName}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        </>
      )}
    </div>
  );
}
