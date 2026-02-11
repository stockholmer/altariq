'use client';

import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/lib/store/settings';
import { useDeviceOrientation } from '@/lib/hooks/useDeviceOrientation';
import { computeQiblaBearing, distanceToKaaba } from '@/lib/utils/qibla';
import CompassRing from '@/components/qibla/CompassRing';
import CompassPermission from '@/components/qibla/CompassPermission';
import DistanceDisplay from '@/components/qibla/DistanceDisplay';
import { MapPin } from 'lucide-react';

export default function QiblaPage() {
  const t = useTranslations('qibla');
  const location = useSettingsStore((s) => s.location);
  const { heading, permission, requestPermission } = useDeviceOrientation();

  if (!location) {
    return (
      <div className="flex flex-col items-center gap-4 pt-20 text-center">
        <MapPin size={48} className="text-[var(--accent)]" />
        <p className="text-lg text-[var(--text-2)]">{t('noLocation')}</p>
      </div>
    );
  }

  const bearing = computeQiblaBearing(location.lat, location.lon);
  const distance = distanceToKaaba(location.lat, location.lon);

  return (
    <div className="flex flex-col items-center gap-6 pt-4">
      <h2 className="text-xl font-semibold">{t('title')}</h2>

      <CompassRing heading={heading} qiblaBearing={bearing} />

      <CompassPermission permission={permission} onRequest={requestPermission} />

      {permission === 'granted' && heading != null && (
        <p className="text-xs text-[var(--text-2)]">{t('pointDevice')}</p>
      )}

      <DistanceDisplay bearing={bearing} distanceKm={distance} />
    </div>
  );
}
