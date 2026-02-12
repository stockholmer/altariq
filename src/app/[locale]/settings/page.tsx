'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import LocationPicker from '@/components/settings/LocationPicker';
import ConventionPicker from '@/components/settings/ConventionPicker';
import AsrMethodToggle from '@/components/settings/AsrMethodToggle';
import CriterionPicker from '@/components/settings/CriterionPicker';
import ThemeToggle from '@/components/settings/ThemeToggle';
import LanguagePicker from '@/components/settings/LanguagePicker';
import TrackedCities from '@/components/settings/TrackedCities';
import { Info, ArrowUpDown, Heart } from 'lucide-react';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const locale = useLocale();

  return (
    <div className="space-y-6 pt-2">
      <h2 className="text-xl font-semibold">{t('title')}</h2>
      <LocationPicker />
      <TrackedCities />
      <ConventionPicker />
      <AsrMethodToggle />
      <CriterionPicker />
      <ThemeToggle />
      <LanguagePicker />

      <div className="space-y-2 pt-2">
        <Link
          href={`/${locale}/converter`}
          className="flex items-center gap-2 rounded-lg border border-[var(--accent)]/20 bg-[var(--bg-card)] p-3 text-sm transition-colors hover:border-[var(--accent)]/40"
        >
          <ArrowUpDown size={16} className="text-[var(--accent)]" />
          <span>{t('dateConverter')}</span>
        </Link>
        <Link
          href={`/${locale}/about`}
          className="flex items-center gap-2 rounded-lg border border-[var(--accent)]/20 bg-[var(--bg-card)] p-3 text-sm transition-colors hover:border-[var(--accent)]/40"
        >
          <Info size={16} className="text-[var(--accent)]" />
          <span>{t('aboutCalculations')}</span>
        </Link>
        <Link
          href={`/${locale}/support`}
          className="flex items-center gap-2 rounded-lg border border-[var(--accent)]/20 bg-[var(--bg-card)] p-3 text-sm transition-colors hover:border-[var(--accent)]/40"
        >
          <Heart size={16} className="text-[var(--accent)]" />
          <span>{t('supportAlTariq')}</span>
        </Link>
      </div>
    </div>
  );
}
