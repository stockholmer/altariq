import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Al Tariq - Prayer Times & Islamic Calendar',
  description: 'Your daily prayer companion. Prayer times, Qibla direction, Hijri calendar, and Islamic festivals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
