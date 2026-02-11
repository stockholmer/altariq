'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { HijriMonth } from '@/lib/types/calendar';

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

interface Props {
  year: number;
  month: number;
  monthData?: HijriMonth;
  onPrev: () => void;
  onNext: () => void;
}

export default function MonthNavigator({ year, month, monthData, onPrev, onNext }: Props) {
  const t = useTranslations('calendar');
  const locale = useLocale();
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
