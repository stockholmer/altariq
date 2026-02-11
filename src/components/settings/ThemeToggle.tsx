'use client';

import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/lib/store/settings';
import { Sun, Moon, Monitor } from 'lucide-react';
import type { Theme } from '@/lib/types/settings';

export default function ThemeToggle() {
  const t = useTranslations('settings');
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  const options: { key: Theme; label: string; icon: typeof Sun }[] = [
    { key: 'light', label: t('themeLight'), icon: Sun },
    { key: 'dark', label: t('themeDark'), icon: Moon },
    { key: 'system', label: t('themeSystem'), icon: Monitor },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-2)]">{t('theme')}</h3>
      <div className="flex rounded-lg bg-[var(--bg-card)] p-1">
        {options.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors ${
              theme === key
                ? 'bg-[var(--accent)] text-white font-medium'
                : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
