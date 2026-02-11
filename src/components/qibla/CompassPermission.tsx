'use client';

import { useTranslations } from 'next-intl';
import { Compass } from 'lucide-react';

interface Props {
  permission: 'granted' | 'denied' | 'prompt' | 'unsupported';
  onRequest: () => void;
}

export default function CompassPermission({ permission, onRequest }: Props) {
  const t = useTranslations('qibla');

  if (permission === 'granted') return null;

  if (permission === 'unsupported') {
    return (
      <p className="text-center text-sm text-[var(--text-2)]">{t('compassUnsupported')}</p>
    );
  }

  return (
    <button
      onClick={onRequest}
      className="mx-auto flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      <Compass size={18} />
      {t('enableCompass')}
    </button>
  );
}
