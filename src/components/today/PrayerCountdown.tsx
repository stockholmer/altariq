'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { useRamadanStatus } from '@/lib/hooks/useRamadanStatus';
import { formatCountdown } from '@/lib/utils/time';
import type { PrayerName } from '@/lib/types/prayer';

interface Props {
  nextPrayer: PrayerName | null;
  nextTime: string | null;
  timezone: string;
}

export default function PrayerCountdown({ nextPrayer, nextTime, timezone }: Props) {
  const t = useTranslations('today');
  const tRamadan = useTranslations('ramadan');
  const secondsLeft = useCountdown(nextTime, timezone);
  const ramadan = useRamadanStatus();

  if (!nextPrayer || !nextTime) {
    return (
      <div className="py-6 text-center">
        <p className="text-lg text-[var(--text-2)]">{t('allPrayersPast')}</p>
      </div>
    );
  }

  // During Ramadan fasting hours, apply special styling when next prayer is Maghrib
  const isIftarCountdown = ramadan.active && ramadan.beforeIftar && nextPrayer === 'maghrib';

  return (
    <motion.div
      className="relative py-6 text-center"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Subtle glow behind countdown */}
      <div className={`absolute inset-0 mx-auto w-48 rounded-full blur-2xl ${
        isIftarCountdown ? 'bg-fasting/10' : 'bg-[var(--accent)]/5'
      }`} />

      <p className="relative text-sm uppercase tracking-widest text-[var(--text-2)]">
        {t('nextPrayer')}
      </p>
      <p className={`relative mt-1 text-3xl font-bold ${
        isIftarCountdown ? 'text-fasting' : 'text-[var(--accent)]'
      }`}>
        {t(nextPrayer)}
      </p>
      {isIftarCountdown && (
        <p className="relative mt-0.5 text-xs font-medium uppercase tracking-wider text-fasting/70">
          {tRamadan('iftar')}
        </p>
      )}
      <p className="relative mt-2 font-mono text-2xl tabular-nums">
        {formatCountdown(secondsLeft)}
      </p>
    </motion.div>
  );
}
