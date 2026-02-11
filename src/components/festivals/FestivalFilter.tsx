'use client';

import { useTranslations } from 'next-intl';
import type { FestivalCategory } from '@/lib/types/festival';

const CATEGORIES: (FestivalCategory | 'all')[] = [
  'all', 'eid', 'fasting', 'hajj', 'remembrance', 'night_worship', 'sacred_month',
];

interface Props {
  selected: FestivalCategory | 'all';
  onSelect: (cat: FestivalCategory | 'all') => void;
}

export default function FestivalFilter({ selected, onSelect }: Props) {
  const t = useTranslations('festivals');

  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            selected === cat
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--bg-card)] text-[var(--text-2)] hover:text-[var(--text-1)]'
          }`}
        >
          {t(cat)}
        </button>
      ))}
    </div>
  );
}
