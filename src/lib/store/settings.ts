'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppSettings,
  AsrMethod,
  CrescentCriterion,
  Locale,
  LocationData,
  PrayerConvention,
  Theme,
} from '@/lib/types/settings';
import { DEFAULT_SETTINGS } from '@/lib/types/settings';

interface SettingsStore extends AppSettings {
  setLocation: (location: LocationData) => void;
  setConvention: (convention: PrayerConvention) => void;
  setAsrMethod: (method: AsrMethod) => void;
  setCriterion: (criterion: CrescentCriterion) => void;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setLocation: (location) => set({ location }),
      setConvention: (convention) => set({ convention }),
      setAsrMethod: (asrMethod) => set({ asrMethod }),
      setCriterion: (criterion) => set({ criterion }),
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'altariq-settings',
    }
  )
);
