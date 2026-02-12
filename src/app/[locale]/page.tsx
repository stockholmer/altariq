'use client';

import { useTranslations } from 'next-intl';
import { usePrayerTimes } from '@/lib/hooks/usePrayerTimes';
import { useSettingsStore } from '@/lib/store/settings';
import { useLocation } from '@/lib/hooks/useLocation';
import { PRAYER_NAMES } from '@/lib/types/prayer';
import { timeToMinutes, nowMinutes } from '@/lib/utils/time';
import PathTimeline from '@/components/today/PathTimeline';
import PrayerCountdown from '@/components/today/PrayerCountdown';
import HijriDateCard from '@/components/today/HijriDateCard';
import EventBanner from '@/components/today/EventBanner';
import TransparencyFooter from '@/components/today/TransparencyFooter';
import RamadanBanner from '@/components/today/RamadanBanner';
import CityChips from '@/components/today/CityChips';
import { MapPin } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';

export default function TodayPage() {
  const t = useTranslations('today');
  const location = useSettingsStore((s) => s.location);
  const { detecting, detect } = useLocation();
  const { data: prayers, isLoading } = usePrayerTimes();

  // No location set
  if (!location) {
    return (
      <div className="flex flex-col items-center gap-4 pt-20 text-center">
        <MapPin size={48} className="text-[var(--accent)]" />
        <p className="text-lg text-[var(--text-2)]">{t('noLocation')}</p>
        <button
          onClick={detect}
          disabled={detecting}
          className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {detecting ? t('detecting') : t('detectLocation')}
        </button>
      </div>
    );
  }

  // Loading
  if (isLoading || !prayers) {
    return (
      <div className="space-y-4 pt-4">
        <div className="animate-pulse rounded-xl bg-[var(--bg-card)] p-4">
          <div className="h-6 w-48 rounded bg-[var(--text-2)]/10" />
        </div>
        <div className="animate-pulse rounded-xl bg-[var(--bg-card)] p-8" />
        <div className="flex gap-4 overflow-hidden px-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 w-16 animate-pulse rounded-lg bg-[var(--bg-card)]" />
          ))}
        </div>
      </div>
    );
  }

  // Find next prayer
  const now = nowMinutes(prayers.timezone);
  const nextPrayerName = PRAYER_NAMES.find((n) => timeToMinutes(prayers[n]) > now) ?? null;
  const nextPrayerTime = nextPrayerName ? prayers[nextPrayerName] : null;

  return (
    <PageTransition>
      <div className="space-y-4 pt-2">
        <CityChips />
        <HijriDateCard />
        <EventBanner />
        <RamadanBanner />
        <PrayerCountdown
          nextPrayer={nextPrayerName}
          nextTime={nextPrayerTime}
          timezone={prayers.timezone}
        />
        <PathTimeline prayers={prayers} />
        <TransparencyFooter />
      </div>
    </PageTransition>
  );
}
