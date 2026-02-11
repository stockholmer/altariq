'use client';

import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-lg">
      <TopBar />
      <main className="px-4 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
