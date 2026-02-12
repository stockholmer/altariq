'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/lib/store/settings';
import { useDeviceOrientation } from '@/lib/hooks/useDeviceOrientation';
import { computeQiblaBearing, distanceToKaaba } from '@/lib/utils/qibla';
import CompassRing from '@/components/qibla/CompassRing';
import CompassPermission from '@/components/qibla/CompassPermission';
import DistanceDisplay from '@/components/qibla/DistanceDisplay';
import { MapPin, X, Info } from 'lucide-react';

export default function QiblaPage() {
  const t = useTranslations('qibla');
  const location = useSettingsStore((s) => s.location);
  const { heading, permission, requestPermission } = useDeviceOrientation();

  const [showCalibrationTip, setShowCalibrationTip] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('altariq-calibration-dismissed');
    if (!dismissed) setShowCalibrationTip(true);
  }, []);

  function dismissTip() {
    setShowCalibrationTip(false);
    localStorage.setItem('altariq-calibration-dismissed', '1');
  }

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

      {showCalibrationTip && (
        <div className="flex items-start gap-2 rounded-lg border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-3 text-sm">
          <Info size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
          <p className="flex-1 text-[var(--text-2)]">{t('calibrationTip')}</p>
          <button onClick={dismissTip} className="shrink-0 text-[var(--text-2)] hover:text-[var(--text-1)]">
            <X size={14} />
          </button>
        </div>
      )}

      <CompassRing heading={heading} qiblaBearing={bearing} />

      <CompassPermission permission={permission} onRequest={requestPermission} />

      {permission === 'granted' && heading != null && (
        <p className="text-xs text-[var(--text-2)]">{t('pointDevice')}</p>
      )}

      <DistanceDisplay bearing={bearing} distanceKm={distance} />

      <p className="max-w-xs text-center text-xs text-[var(--text-2)]/70">
        {t('accuracyDisclaimer')}
      </p>
    </div>
  );
}
