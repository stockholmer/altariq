'use client';

import { useTranslations } from 'next-intl';
import { useRamadanStatus } from '@/lib/hooks/useRamadanStatus';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { useSettingsStore } from '@/lib/store/settings';
import { formatCountdown, formatTime12 } from '@/lib/utils/time';
import { Moon, Star } from 'lucide-react';

export default function RamadanBanner() {
  const t = useTranslations('ramadan');
  const ramadan = useRamadanStatus();
  const timezone = useSettingsStore((s) => s.location?.timezone) ?? 'UTC';
  const iftarCountdown = useCountdown(
    ramadan.beforeIftar ? ramadan.maghribTime : null,
    timezone,
  );

  if (!ramadan.active) return null;

  return (
    <div className="rounded-xl border border-fasting/30 bg-fasting/10 p-3">
      <div className="flex items-center gap-2">
        <Moon size={16} className="text-fasting" />
        <span className="text-sm font-semibold text-fasting">
          {t('ramadanDay', { day: ramadan.day })}
        </span>
        {ramadan.last10 && (
          <span className="flex items-center gap-1 rounded-full bg-night-worship/15 px-2 py-0.5 text-xs text-night-worship">
            <Star size={10} />
            {t('last10')}
          </span>
        )}
        {ramadan.oddNight && (
          <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-xs text-[var(--accent)]">
            {t('oddNight')}
          </span>
        )}
      </div>
      <p className="mt-1.5 text-sm text-[var(--text-2)]">
        {ramadan.beforeIftar
          ? t('iftarIn', { countdown: formatCountdown(iftarCountdown) })
          : ramadan.fajrTime
            ? t('suhoorAt', { time: formatTime12(ramadan.fajrTime) })
            : null
        }
      </p>
    </div>
  );
}
