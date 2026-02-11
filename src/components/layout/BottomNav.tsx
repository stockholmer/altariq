'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Sun, CalendarDays, Compass, Star, Settings } from 'lucide-react';

const tabs = [
  { key: 'today', href: '', icon: Sun },
  { key: 'calendar', href: '/calendar', icon: CalendarDays },
  { key: 'qibla', href: '/qibla', icon: Compass },
  { key: 'festivals', href: '/festivals', icon: Star },
  { key: 'settings', href: '/settings', icon: Settings },
] as const;

export default function BottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--accent)]/20 bg-[var(--bg-card)] safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {tabs.map(({ key, href, icon: Icon }) => {
          const fullPath = `/${locale}${href}`;
          const isActive = pathname === fullPath || (href === '' && pathname === `/${locale}`);
          return (
            <Link
              key={key}
              href={fullPath}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                isActive
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span>{t(key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
