'use client';

import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/lib/store/settings';
import { CRITERION_LABELS } from '@/lib/types/settings';
import type { CrescentCriterion } from '@/lib/types/settings';

export default function CriterionPicker() {
  const t = useTranslations('settings');
  const criterion = useSettingsStore((s) => s.criterion);
  const setCriterion = useSettingsStore((s) => s.setCriterion);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-2)]">{t('crescentCriterion')}</h3>
      <select
        value={criterion}
        onChange={(e) => setCriterion(e.target.value as CrescentCriterion)}
        className="w-full rounded-lg border border-[var(--text-2)]/20 bg-[var(--bg-card)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
      >
        {(Object.keys(CRITERION_LABELS) as CrescentCriterion[]).map((key) => (
          <option key={key} value={key}>{CRITERION_LABELS[key]}</option>
        ))}
      </select>
    </div>
  );
}
