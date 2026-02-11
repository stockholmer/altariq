'use client';

import { useTranslations } from 'next-intl';
import LocationPicker from '@/components/settings/LocationPicker';
import ConventionPicker from '@/components/settings/ConventionPicker';
import AsrMethodToggle from '@/components/settings/AsrMethodToggle';
import CriterionPicker from '@/components/settings/CriterionPicker';
import ThemeToggle from '@/components/settings/ThemeToggle';
import LanguagePicker from '@/components/settings/LanguagePicker';

export default function SettingsPage() {
  const t = useTranslations('settings');

  return (
    <div className="space-y-6 pt-2">
      <h2 className="text-xl font-semibold">{t('title')}</h2>
      <LocationPicker />
      <ConventionPicker />
      <AsrMethodToggle />
      <CriterionPicker />
      <ThemeToggle />
      <LanguagePicker />
    </div>
  );
}
