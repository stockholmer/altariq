'use client';

import { useTranslations } from 'next-intl';
import { useLocation } from '@/lib/hooks/useLocation';
import { MapPin, Loader2 } from 'lucide-react';

export default function LocationPicker() {
  const t = useTranslations('settings');
  const { location, detecting, error, detect } = useLocation();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-2)]">{t('location')}</h3>
      {location && (
        <div className="flex items-center gap-2 rounded-lg bg-[var(--bg-card)] p-3">
          <MapPin size={16} className="text-[var(--accent)]" />
          <span className="text-sm">{location.city}, {location.country}</span>
          <span className="ml-auto text-xs text-[var(--text-2)]">
            {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
          </span>
        </div>
      )}
      <button
        onClick={detect}
        disabled={detecting}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--accent)]/30 bg-[var(--bg-card)] px-4 py-2.5 text-sm transition-colors hover:border-[var(--accent)]"
      >
        {detecting ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
        {detecting ? t('detecting') : t('detectLocation')}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
