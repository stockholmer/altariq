'use client';

import { useTranslations } from 'next-intl';
import type { UpcomingFestival, FestivalCategory, FestivalImportance } from '@/lib/types/festival';

const CATEGORY_COLORS: Record<FestivalCategory, string> = {
  eid: 'bg-eid/10 text-eid border-eid/20',
  fasting: 'bg-fasting/10 text-fasting border-fasting/20',
  hajj: 'bg-hajj/10 text-hajj border-hajj/20',
  remembrance: 'bg-remembrance/10 text-remembrance border-remembrance/20',
  night_worship: 'bg-night-worship/10 text-night-worship border-night-worship/20',
  sacred_month: 'bg-sacred/10 text-sacred border-sacred/20',
};

const IMPORTANCE_SIZE: Record<FestivalImportance, string> = {
  major: 'text-base font-semibold',
  significant: 'text-sm font-medium',
  observance: 'text-sm',
};

interface Props {
  festival: UpcomingFestival;
}

export default function FestivalCard({ festival }: Props) {
  const t = useTranslations('festivals');

  const daysLabel =
    festival.days_until === 0
      ? t('today')
      : festival.days_until === 1
        ? t('tomorrow')
        : t('inDays', { days: festival.days_until });

  return (
    <div className="rounded-xl bg-[var(--bg-card)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className={IMPORTANCE_SIZE[festival.importance]}>{festival.name}</h3>
          <p className="mt-1 text-xs text-[var(--text-2)]">
            {festival.hijri_day} {festival.hijri_month_name} &middot; {festival.gregorian_date}
          </p>
          {festival.description && (
            <p className="mt-2 text-xs text-[var(--text-2)] leading-relaxed">{festival.description}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={`rounded-full border px-2 py-0.5 text-xs ${CATEGORY_COLORS[festival.category]}`}>
            {t(festival.category)}
          </span>
          <span className="text-xs font-medium text-[var(--accent)]">{daysLabel}</span>
        </div>
      </div>
    </div>
  );
}
