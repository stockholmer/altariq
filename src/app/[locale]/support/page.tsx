'use client';

import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';

const SUPPORT_LINK = ''; // Configure with actual payment link before enabling

export default function SupportPage() {
  const t = useTranslations('support');

  return (
    <div className="space-y-6 pt-2">
      <h2 className="text-xl font-semibold">{t('title')}</h2>

      <div className="rounded-xl bg-[var(--bg-card)] p-5 space-y-4">
        <p className="text-sm leading-relaxed text-[var(--text-2)]">
          {t('description')}
        </p>

        {SUPPORT_LINK ? (
          <a
            href={SUPPORT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Heart size={16} />
            {t('button')}
          </a>
        ) : (
          <span className="flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)]/50 px-4 py-3 text-sm font-medium text-white/70 cursor-not-allowed">
            <Heart size={16} />
            {t('button')}
          </span>
        )}
      </div>

      <p className="px-1 text-center text-xs text-[var(--text-2)]/70">
        {t('note')}
      </p>
    </div>
  );
}
