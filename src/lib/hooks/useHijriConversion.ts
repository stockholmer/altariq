'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/lib/store/settings';
import { fetchHijriDate, fetchHijriMonth } from '@/lib/api/calendar';
import type { HijriDate } from '@/lib/types/calendar';

interface ConversionResult {
  hijri: HijriDate;
  direction: 'hijri-to-greg' | 'greg-to-hijri';
}

export function useHijriConversion() {
  const criterion = useSettingsStore((s) => s.criterion);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function convertGregorianToHijri(date: string) {
    setLoading(true);
    setError(null);
    try {
      const hijri = await fetchHijriDate({ date, criterion });
      setResult({ hijri, direction: 'greg-to-hijri' });
    } catch {
      setError('Conversion failed');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  async function convertHijriToGregorian(year: number, month: number, day: number) {
    setLoading(true);
    setError(null);
    try {
      const monthData = await fetchHijriMonth({ hijri_year: year, hijri_month: month, criterion });
      const dayData = monthData.days.find((d) => d.hijri_day === day);
      if (!dayData) {
        setError('Invalid date');
        setResult(null);
        return;
      }
      // Re-fetch the full day info to get events
      const hijri = await fetchHijriDate({ date: dayData.gregorian_date, criterion });
      setResult({ hijri, direction: 'hijri-to-greg' });
    } catch {
      setError('Conversion failed');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, convertGregorianToHijri, convertHijriToGregorian };
}
