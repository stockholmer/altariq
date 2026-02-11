'use client';

import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/lib/store/settings';
import type { AsrMethod } from '@/lib/types/settings';

export default function AsrMethodToggle() {
  const t = useTranslations('settings');
  const asrMethod = useSettingsStore((s) => s.asrMethod);
  const setAsrMethod = useSettingsStore((s) => s.setAsrMethod);

  const options: { key: AsrMethod; label: string }[] = [
    { key: 'shafii', label: t('shafii') },
    { key: 'hanafi', label: t('hanafi') },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-2)]">{t('asrMethod')}</h3>
      <div className="flex rounded-lg bg-[var(--bg-card)] p-1">
        {options.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setAsrMethod(key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm transition-colors ${
              asrMethod === key
                ? 'bg-[var(--accent)] text-white font-medium'
                : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
