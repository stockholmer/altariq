'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useHijriDate } from '@/lib/hooks/useHijriDate';
import { useCalendarMonth } from '@/lib/hooks/useCalendarMonth';
import { useGregorianMonth } from '@/lib/hooks/useGregorianMonth';
import MonthNavigator from '@/components/calendar/MonthNavigator';
import HijriGrid from '@/components/calendar/HijriGrid';
import GregorianGrid from '@/components/calendar/GregorianGrid';
import CalendarViewToggle from '@/components/calendar/CalendarViewToggle';
import DayDetail from '@/components/calendar/DayDetail';
import MonthEvents from '@/components/calendar/MonthEvents';
import type { CalendarViewMode } from '@/lib/types/calendar';

export default function CalendarPage() {
  const t = useTranslations('calendar');
  const locale = useLocale();
  const { data: todayHijri } = useHijriDate();

  // View mode
  const [viewMode, setViewMode] = useState<CalendarViewMode>('hijri');

  // Hijri state
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Gregorian state
  const now = new Date();
  const [gregYear, setGregYear] = useState<number>(now.getFullYear());
  const [gregMonth, setGregMonth] = useState<number>(now.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (todayHijri && !initialized) {
      setYear(todayHijri.hijri_year);
      setMonth(todayHijri.hijri_month);
      setInitialized(true);
    }
  }, [todayHijri, initialized]);

  const { month: monthData, festivals, isLoading } = useCalendarMonth(year, month);
  const {
    month: gregMonthData,
    festivals: gregFestivals,
    isLoading: gregLoading,
  } = useGregorianMonth(
    viewMode === 'gregorian' ? gregYear : null,
    viewMode === 'gregorian' ? gregMonth : null,
  );

  const todayGreg = todayHijri?.gregorian_date ?? '';
  const hijriMonthName = month !== null
    ? t(`hijriMonth_${month}` as Parameters<typeof t>[0])
    : '';

  // Hijri navigation
  function goPrev() {
    if (year === null || month === null) return;
    setSelectedDay(null);
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  }

  function goNext() {
    if (year === null || month === null) return;
    setSelectedDay(null);
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  }

  // Gregorian navigation
  function goPrevGreg() {
    setSelectedDate(null);
    if (gregMonth === 1) { setGregMonth(12); setGregYear(gregYear - 1); }
    else setGregMonth(gregMonth - 1);
  }

  function goNextGreg() {
    setSelectedDate(null);
    if (gregMonth === 12) { setGregMonth(1); setGregYear(gregYear + 1); }
    else setGregMonth(gregMonth + 1);
  }

  // Toggle handler: derive the other calendar's context
  function handleToggle(newMode: CalendarViewMode) {
    if (newMode === viewMode) return;
    setSelectedDay(null);
    setSelectedDate(null);

    if (newMode === 'gregorian' && monthData && monthData.days.length > 0) {
      // Derive Gregorian month from the middle of the current Hijri month
      const midDay = monthData.days[Math.floor(monthData.days.length / 2)];
      const d = new Date(midDay.gregorian_date + 'T12:00:00');
      setGregYear(d.getFullYear());
      setGregMonth(d.getMonth() + 1);
    } else if (newMode === 'hijri' && gregMonthData && gregMonthData.days.length > 0) {
      // Derive Hijri month from the middle of the current Gregorian month
      const midDay = gregMonthData.days[Math.floor(gregMonthData.days.length / 2)];
      if (midDay.hijri_year && midDay.hijri_month) {
        setYear(midDay.hijri_year);
        setMonth(midDay.hijri_month);
      }
    }

    setViewMode(newMode);
  }

  // Selected day data for DayDetail (Hijri mode)
  const selectedDayData = selectedDay !== null && monthData
    ? monthData.days.find((d) => d.hijri_day === selectedDay)
    : null;
  const selectedFestivals = selectedDay !== null
    ? festivals.filter((f) => f.hijri_day === selectedDay)
    : [];

  // Selected day data for DayDetail (Gregorian mode)
  const selectedGregDayData = selectedDate !== null && gregMonthData
    ? gregMonthData.days.find((d) => d.gregorian_date === selectedDate)
    : null;
  const selectedGregFestivals = selectedDate !== null
    ? gregFestivals.filter((f) => f.gregorian_date === selectedDate)
    : [];

  // Gregorian month label for events header
  const gregMonthLabel = new Date(gregYear, gregMonth - 1, 1)
    .toLocaleDateString(locale, { month: 'long' });

  // Build a synthetic HijriMonth for MonthEvents in Gregorian mode
  // (MonthEvents needs it for finding event day data)
  const syntheticHijriMonth = gregMonthData ? {
    hijri_year: gregMonthData.days[0]?.hijri_year ?? 0,
    hijri_month: gregMonthData.days[0]?.hijri_month ?? 0,
    hijri_month_name: gregMonthData.days[0]?.hijri_month_name ?? '',
    criterion: '',
    days: gregMonthData.days.map((d) => ({
      hijri_day: d.hijri_day,
      gregorian_date: d.gregorian_date,
      weekday: d.weekday,
      events: d.events,
    })),
  } : undefined;

  // Show full loading skeleton until we know which month to display
  if (viewMode === 'hijri' && (year === null || month === null)) {
    return (
      <div className="pt-2 pb-4">
        <div className="flex items-center justify-between py-3">
          <div className="w-9" />
          <div className="text-center">
            <div className="h-6 w-32 animate-pulse rounded bg-[var(--bg-card)]" />
            <div className="h-4 w-20 mt-1 mx-auto animate-pulse rounded bg-[var(--bg-card)]" />
          </div>
          <div className="w-9" />
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-[var(--bg-card)]" />
          ))}
        </div>
      </div>
    );
  }

  const showHijriLoading = viewMode === 'hijri' && (isLoading || !monthData);
  const showGregLoading = viewMode === 'gregorian' && (gregLoading || !gregMonthData);
  const showLoading = showHijriLoading || showGregLoading;

  return (
    <div className="pt-2 pb-4">
      <CalendarViewToggle mode={viewMode} onChange={handleToggle} />

      {viewMode === 'hijri' ? (
        <MonthNavigator
          year={year!}
          month={month!}
          monthData={monthData}
          onPrev={goPrev}
          onNext={goNext}
        />
      ) : (
        <MonthNavigator
          year={gregYear}
          month={gregMonth}
          onPrev={goPrevGreg}
          onNext={goNextGreg}
          mode="gregorian"
          gregMonthData={gregMonthData}
        />
      )}

      {showLoading ? (
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-[var(--bg-card)]" />
          ))}
        </div>
      ) : viewMode === 'hijri' && monthData ? (
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
              hijriYear={year!}
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
      ) : viewMode === 'gregorian' && gregMonthData ? (
        <>
          <GregorianGrid
            month={gregMonthData}
            festivals={gregFestivals}
            todayGreg={todayGreg}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {selectedGregDayData && (
            <DayDetail
              day={{
                hijri_day: selectedGregDayData.hijri_day,
                gregorian_date: selectedGregDayData.gregorian_date,
                weekday: selectedGregDayData.weekday,
                events: selectedGregDayData.events,
              }}
              hijriYear={selectedGregDayData.hijri_year}
              hijriMonthName={selectedGregDayData.hijri_month_name}
              festivals={selectedGregFestivals}
            />
          )}

          {syntheticHijriMonth && (
            <MonthEvents
              month={syntheticHijriMonth}
              festivals={gregFestivals}
              hijriMonthName=""
              selectedDay={null}
              onSelectDay={() => {}}
              mode="gregorian"
              gregMonthLabel={gregMonthLabel}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          )}
        </>
      ) : null}
    </div>
  );
}
