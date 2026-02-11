'use client';

import { useTranslations } from 'next-intl';

interface Props {
  bearing: number;
  distanceKm: number;
}

export default function DistanceDisplay({ bearing, distanceKm }: Props) {
  const t = useTranslations('qibla');

  return (
    <div className="text-center space-y-1">
      <p className="text-sm text-[var(--text-2)]">
        {t('bearing', { degrees: `${bearing.toFixed(1)}` })}
      </p>
      <p className="text-sm text-[var(--text-2)]">
        {t('distance', { km: Math.round(distanceKm).toLocaleString() })}
      </p>
    </div>
  );
}
