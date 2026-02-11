'use client';

import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/lib/store/settings';
import { CONVENTION_LABELS } from '@/lib/types/settings';
import type { PrayerConvention } from '@/lib/types/settings';

export default function ConventionPicker() {
  const t = useTranslations('settings');
  const convention = useSettingsStore((s) => s.convention);
  const setConvention = useSettingsStore((s) => s.setConvention);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-2)]">{t('prayerConvention')}</h3>
      <div className="space-y-1">
        {(Object.keys(CONVENTION_LABELS) as PrayerConvention[]).map((key) => (
          <button
            key={key}
            onClick={() => setConvention(key)}
            className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${
              convention === key
                ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium'
                : 'hover:bg-[var(--bg-card)]'
            }`}
          >
            <span
              className={`mr-3 inline-block h-4 w-4 rounded-full border-2 ${
                convention === key ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--text-2)]/30'
              }`}
            />
            {CONVENTION_LABELS[key]}
          </button>
        ))}
      </div>
    </div>
  );
}
