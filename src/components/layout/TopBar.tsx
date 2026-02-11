'use client';

import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/lib/store/settings';
import { useHijriDate } from '@/lib/hooks/useHijriDate';

export default function TopBar() {
  const ta = useTranslations('app');
  const tc = useTranslations('calendar');
  const location = useSettingsStore((s) => s.location);
  const { data: hijri } = useHijriDate();

  const monthName = hijri ? tc(`hijriMonth_${hijri.hijri_month}` as Parameters<typeof tc>[0]) : '';

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg)]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{ta('name')}</h1>
          {hijri && (
            <p className="text-xs text-[var(--text-2)]">
              {hijri.hijri_day} {monthName} {hijri.hijri_year} {tc('ah')}
            </p>
          )}
        </div>
        {location && (
          <span className="text-sm text-[var(--text-2)]">
            {location.city}
          </span>
        )}
      </div>
    </header>
  );
}
