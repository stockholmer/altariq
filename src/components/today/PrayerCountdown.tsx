'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { formatCountdown } from '@/lib/utils/time';
import type { PrayerName } from '@/lib/types/prayer';

interface Props {
  nextPrayer: PrayerName | null;
  nextTime: string | null;
  timezone: string;
}

export default function PrayerCountdown({ nextPrayer, nextTime, timezone }: Props) {
  const t = useTranslations('today');
  const secondsLeft = useCountdown(nextTime, timezone);

  if (!nextPrayer || !nextTime) {
    return (
      <div className="py-6 text-center">
        <p className="text-lg text-[var(--text-2)]">{t('allPrayersPast')}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="relative py-6 text-center"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Subtle glow behind countdown */}
      <div className="absolute inset-0 mx-auto w-48 rounded-full bg-[var(--accent)]/5 blur-2xl" />

      <p className="relative text-sm uppercase tracking-widest text-[var(--text-2)]">
        {t('nextPrayer')}
      </p>
      <p className="relative mt-1 text-3xl font-bold text-[var(--accent)]">
        {t(nextPrayer)}
      </p>
      <p className="relative mt-2 font-mono text-2xl tabular-nums">
        {formatCountdown(secondsLeft)}
      </p>
    </motion.div>
  );
}
