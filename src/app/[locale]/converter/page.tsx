'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/lib/store/settings';
import { useHijriConversion } from '@/lib/hooks/useHijriConversion';
import { CRITERION_LABELS } from '@/lib/types/settings';
import { ArrowUpDown, Loader2, Star } from 'lucide-react';

const HIJRI_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const GREG_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const GREG_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function ConverterPage() {
  const t = useTranslations('converter');
  const tCal = useTranslations('calendar');
  const criterion = useSettingsStore((s) => s.criterion);
  const { result, loading, error, convertGregorianToHijri, convertHijriToGregorian } = useHijriConversion();

  const [direction, setDirection] = useState<'hijri-to-greg' | 'greg-to-hijri'>('greg-to-hijri');

  // Gregorian inputs
  const [gregDay, setGregDay] = useState(1);
  const [gregMonth, setGregMonth] = useState(1);
  const [gregYear, setGregYear] = useState(new Date().getFullYear());

  // Hijri inputs
  const [hijriDay, setHijriDay] = useState(1);
  const [hijriMonth, setHijriMonth] = useState(1);
  const [hijriYear, setHijriYear] = useState(1447);

  function handleConvert() {
    if (direction === 'greg-to-hijri') {
      const dateStr = `${gregYear}-${String(gregMonth).padStart(2, '0')}-${String(gregDay).padStart(2, '0')}`;
      convertGregorianToHijri(dateStr);
    } else {
      convertHijriToGregorian(hijriYear, hijriMonth, hijriDay);
    }
  }

  const selectClass = 'rounded-lg border border-[var(--accent)]/20 bg-[var(--bg-card)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]';

  return (
    <div className="space-y-6 pt-2">
      <h2 className="text-xl font-semibold">{t('title')}</h2>

      {/* Direction toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setDirection('greg-to-hijri')}
          className={`flex-1 rounded-lg border px-3 py-2 text-center text-sm transition-colors ${
            direction === 'greg-to-hijri'
              ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
              : 'border-[var(--accent)]/20 bg-[var(--bg-card)]'
          }`}
        >
          {t('gregorianToHijri')}
        </button>
        <ArrowUpDown size={16} className="shrink-0 text-[var(--text-2)]" />
        <button
          onClick={() => setDirection('hijri-to-greg')}
          className={`flex-1 rounded-lg border px-3 py-2 text-center text-sm transition-colors ${
            direction === 'hijri-to-greg'
              ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
              : 'border-[var(--accent)]/20 bg-[var(--bg-card)]'
          }`}
        >
          {t('hijriToGregorian')}
        </button>
      </div>

      {/* Input fields */}
      <div className="space-y-3 rounded-xl bg-[var(--bg-card)] p-4">
        {direction === 'greg-to-hijri' ? (
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-[var(--text-2)]">{t('day')}</label>
              <select value={gregDay} onChange={(e) => setGregDay(+e.target.value)} className={selectClass + ' w-full'}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-[var(--text-2)]">{t('month')}</label>
              <select value={gregMonth} onChange={(e) => setGregMonth(+e.target.value)} className={selectClass + ' w-full'}>
                {GREG_MONTHS.map((m) => (
                  <option key={m} value={m}>{GREG_MONTH_NAMES[m - 1]}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-[var(--text-2)]">{t('year')}</label>
              <select value={gregYear} onChange={(e) => setGregYear(+e.target.value)} className={selectClass + ' w-full'}>
                {Array.from({ length: 21 }, (_, i) => 2018 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-[var(--text-2)]">{t('day')}</label>
              <select value={hijriDay} onChange={(e) => setHijriDay(+e.target.value)} className={selectClass + ' w-full'}>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-[var(--text-2)]">{t('month')}</label>
              <select value={hijriMonth} onChange={(e) => setHijriMonth(+e.target.value)} className={selectClass + ' w-full'}>
                {HIJRI_MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {tCal(`hijriMonth_${m}` as Parameters<typeof tCal>[0])}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-[var(--text-2)]">{t('year')}</label>
              <select value={hijriYear} onChange={(e) => setHijriYear(+e.target.value)} className={selectClass + ' w-full'}>
                {Array.from({ length: 21 }, (_, i) => 1440 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {t('convert')}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      {/* Result */}
      {result && (
        <div className="space-y-3 rounded-xl bg-[var(--bg-card)] p-4">
          <h3 className="text-sm font-medium text-[var(--text-2)]">{t('result')}</h3>

          <div className="space-y-1">
            <p className="text-lg font-semibold">
              {result.hijri.hijri_day}{' '}
              {tCal(`hijriMonth_${result.hijri.hijri_month}` as Parameters<typeof tCal>[0])}{' '}
              {result.hijri.hijri_year} {tCal('ah')}
            </p>
            <p className="text-sm text-[var(--text-2)]">
              {new Date(result.hijri.gregorian_date + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>

          {result.hijri.events && result.hijri.events.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-[var(--text-2)]">{t('events')}</p>
              {result.hijri.events.map((ev, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Star size={14} className="shrink-0 text-[var(--accent)]" />
                  <span className="text-sm">{ev.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-2)]">{t('noEvents')}</p>
          )}
        </div>
      )}

      <p className="text-center text-xs text-[var(--text-2)]/70">
        {t('note', { criterion: CRITERION_LABELS[criterion] ?? criterion })}
      </p>
    </div>
  );
}
