'use client';

import { useTranslations } from 'next-intl';
import { bearingToCardinal } from '@/lib/utils/qibla';

interface Props {
  bearing: number;
  distanceKm: number;
}

export default function DistanceDisplay({ bearing, distanceKm }: Props) {
  const t = useTranslations('qibla');
  const cardinal = bearingToCardinal(bearing);

  return (
    <div className="text-center space-y-1">
      <p className="text-sm text-[var(--text-2)]">
        {t('bearing', { degrees: `${bearing.toFixed(1)}` })}
      </p>
      <p className="text-sm font-medium">
        {t(`cardinal_${cardinal}` as Parameters<typeof t>[0])} ({Math.round(bearing)}&deg;)
      </p>
      <p className="text-sm text-[var(--text-2)]">
        {t('distance', { km: Math.round(distanceKm).toLocaleString() })}
      </p>
    </div>
  );
}
