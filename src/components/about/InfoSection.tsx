'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function InfoSection({ title, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-[var(--accent)]/15 bg-[var(--bg-card)]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="font-medium">{title}</span>
        <ChevronDown
          size={18}
          className={`text-[var(--text-2)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="border-t border-[var(--accent)]/10 px-4 pb-4 pt-3 text-sm leading-relaxed text-[var(--text-2)]">
          {children}
        </div>
      )}
    </div>
  );
}
