'use client';

import FestivalCard from './FestivalCard';
import type { UpcomingFestival } from '@/lib/types/festival';

interface Props {
  festivals: UpcomingFestival[];
}

export default function FestivalList({ festivals }: Props) {
  if (festivals.length === 0) {
    return <p className="py-8 text-center text-sm text-[var(--text-2)]">No festivals found</p>;
  }

  return (
    <div className="space-y-3">
      {festivals.map((f, i) => (
        <FestivalCard key={`${f.name}-${f.gregorian_date}-${i}`} festival={f} />
      ))}
    </div>
  );
}
