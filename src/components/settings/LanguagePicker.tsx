'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useSettingsStore } from '@/lib/store/settings';
import type { Locale } from '@/lib/types/settings';

const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'English',
  ar: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629',
  ur: '\u0627\u0631\u062F\u0648',
  bn: '\u09AC\u09BE\u0982\u09B2\u09BE',
  ms: 'Bahasa Melayu',
  hi: '\u0939\u093F\u0928\u094D\u0926\u0940',
  fa: '\u0641\u0627\u0631\u0633\u06CC',
  tr: 'T\u00FCrk\u00E7e',
  id: 'Bahasa Indonesia',
};

export default function LanguagePicker() {
  const t = useTranslations('settings');
  const locale = useSettingsStore((s) => s.locale);
  const setLocale = useSettingsStore((s) => s.setLocale);
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(newLocale: Locale) {
    setLocale(newLocale);
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-2)]">{t('language')}</h3>
      <div className="grid grid-cols-2 gap-1.5">
        {(Object.keys(LANGUAGE_NAMES) as Locale[]).map((key) => (
          <button
            key={key}
            onClick={() => handleChange(key)}
            className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
              locale === key
                ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium ring-1 ring-[var(--accent)]/30'
                : 'bg-[var(--bg-card)] hover:bg-[var(--accent)]/5'
            }`}
          >
            {LANGUAGE_NAMES[key]}
          </button>
        ))}
      </div>
    </div>
  );
}
