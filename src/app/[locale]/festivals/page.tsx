'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useUpcomingFestivals } from '@/lib/hooks/useFestivals';
import FestivalList from '@/components/festivals/FestivalList';
import FestivalFilter from '@/components/festivals/FestivalFilter';
import type { FestivalCategory } from '@/lib/types/festival';
import type { UpcomingFestival } from '@/lib/types/festival';

export default function FestivalsPage() {
  const t = useTranslations('festivals');
  const [filter, setFilter] = useState<FestivalCategory | 'all'>('all');
  const { data: festivals, isLoading } = useUpcomingFestivals(30);

  const filtered = useMemo(() => {
    if (!festivals) return [];
    if (filter === 'all') return festivals;
    return festivals.filter((f: UpcomingFestival) => f.category === filter);
  }, [festivals, filter]);

  return (
    <div className="space-y-4 pt-2">
      <h2 className="text-xl font-semibold">{t('title')}</h2>

      <FestivalFilter selected={filter} onSelect={setFilter} />

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--bg-card)]" />
          ))}
        </div>
      ) : (
        <FestivalList festivals={filtered} />
      )}
    </div>
  );
}
