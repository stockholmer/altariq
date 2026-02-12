'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { HijriMonth, CalendarViewMode, GregorianMonth } from '@/lib/types/calendar';

function formatGregRange(locale: string, month: HijriMonth | undefined): string {
  if (!month || month.days.length === 0) return '';
  const first = month.days[0].gregorian_date;
  const last = month.days[month.days.length - 1].gregorian_date;
  const fmt = (iso: string) => {
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  };
  return `${fmt(first)} - ${fmt(last)}`;
}

function formatHijriRange(gregMonth: GregorianMonth | undefined): string {
  if (!gregMonth || gregMonth.days.length === 0) return '';
  const first = gregMonth.days[0];
  const last = gregMonth.days[gregMonth.days.length - 1];
  if (first.hijri_month === last.hijri_month) {
    return `${first.hijri_day}-${last.hijri_day} ${first.hijri_month_name} ${first.hijri_year}`;
  }
  return `${first.hijri_day} ${first.hijri_month_name} - ${last.hijri_day} ${last.hijri_month_name} ${last.hijri_year}`;
}

interface Props {
  year: number;
  month: number;
  monthData?: HijriMonth;
  onPrev: () => void;
  onNext: () => void;
  mode?: CalendarViewMode;
  gregMonthData?: GregorianMonth;
}

export default function MonthNavigator({ year, month, monthData, onPrev, onNext, mode = 'hijri', gregMonthData }: Props) {
  const t = useTranslations('calendar');
  const locale = useLocale();

  if (mode === 'gregorian' && gregMonthData) {
    const gregMonthName = new Date(gregMonthData.year, gregMonthData.month - 1, 1)
      .toLocaleDateString(locale, { month: 'long' });
    const hijriRange = formatHijriRange(gregMonthData);

    return (
      <div className="flex items-center justify-between py-3">
        <button onClick={onPrev} className="rounded-lg p-2 hover:bg-[var(--bg-card)]">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-semibold">{gregMonthName}</h2>
          <p className="text-xs text-[var(--text-2)]">{gregMonthData.year}</p>
          {hijriRange && (
            <p className="text-[11px] text-[var(--text-2)] mt-0.5">{hijriRange}</p>
          )}
        </div>
        <button onClick={onNext} className="rounded-lg p-2 hover:bg-[var(--bg-card)]">
          <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  const monthName = t(`hijriMonth_${month}` as Parameters<typeof t>[0]);

  return (
    <div className="flex items-center justify-between py-3">
      <button onClick={onPrev} className="rounded-lg p-2 hover:bg-[var(--bg-card)]">
        <ChevronLeft size={20} />
      </button>
      <div className="text-center">
        <h2 className="text-lg font-semibold">{monthName}</h2>
        <p className="text-xs text-[var(--text-2)]">{year} {t('ah')}</p>
        {monthData && (
          <p className="text-[11px] text-[var(--text-2)] mt-0.5">{formatGregRange(locale, monthData)}</p>
        )}
      </div>
      <button onClick={onNext} className="rounded-lg p-2 hover:bg-[var(--bg-card)]">
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
