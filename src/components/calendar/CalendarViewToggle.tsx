'use client';

import { Moon, CalendarDays } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { CalendarViewMode } from '@/lib/types/calendar';

interface Props {
  mode: CalendarViewMode;
  onChange: (mode: CalendarViewMode) => void;
}

export default function CalendarViewToggle({ mode, onChange }: Props) {
  const t = useTranslations('calendar');

  return (
    <div className="flex justify-center mb-3">
      <div className="inline-flex rounded-full bg-[var(--bg-card)] p-1 gap-1">
        <button
          onClick={() => onChange('hijri')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors
            ${mode === 'hijri'
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-2)] hover:text-[var(--text-1)]'}
          `}
        >
          <Moon size={14} />
          {t('viewHijri')}
        </button>
        <button
          onClick={() => onChange('gregorian')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors
            ${mode === 'gregorian'
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-2)] hover:text-[var(--text-1)]'}
          `}
        >
          <CalendarDays size={14} />
          {t('viewGregorian')}
        </button>
      </div>
    </div>
  );
}
