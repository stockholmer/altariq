'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useHijriDate } from '@/lib/hooks/useHijriDate';

export default function HijriDateCard() {
  const t = useTranslations('calendar');
  const locale = useLocale();
  const { data: hijri, isLoading } = useHijriDate();

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl bg-[var(--bg-card)] p-4">
        <div className="h-5 w-48 rounded bg-[var(--text-2)]/10" />
        <div className="mt-2 h-4 w-32 rounded bg-[var(--text-2)]/10" />
      </div>
    );
  }

  if (!hijri) return null;

  const monthName = t(`hijriMonth_${hijri.hijri_month}` as Parameters<typeof t>[0]);
  const gregFormatted = new Date(hijri.gregorian_date + 'T12:00:00')
    .toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="rounded-xl bg-[var(--bg-card)] p-4 shadow-sm">
      <p className="text-xl font-semibold">
        {hijri.hijri_day} {monthName} {hijri.hijri_year} {t('ah')}
      </p>
      <p className="mt-1 text-sm text-[var(--text-2)]">
        {gregFormatted}
      </p>
    </div>
  );
}
