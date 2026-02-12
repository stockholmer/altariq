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
import type { CityProfile } from '@/lib/types/city-profile';

interface SettingsStore extends AppSettings {
  // Multi-city tracking
  cities: CityProfile[];
  activeCityIndex: number;

  // Setters
  setLocation: (location: LocationData) => void;
  setConvention: (convention: PrayerConvention) => void;
  setAsrMethod: (method: AsrMethod) => void;
  setCriterion: (criterion: CrescentCriterion) => void;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;

  // City management
  addCity: (city: CityProfile) => void;
  removeCity: (id: string) => void;
  setActiveCity: (index: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,
      cities: [],
      activeCityIndex: 0,

      setLocation: (location) => set({ location }),
      setConvention: (convention) => set({ convention }),
      setAsrMethod: (asrMethod) => set({ asrMethod }),
      setCriterion: (criterion) => set({ criterion }),
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => set({ theme }),

      addCity: (city) => {
        const { cities } = get();
        if (cities.length >= 3) return;
        if (cities.some((c) => c.id === city.id)) return;
        const newCities = [...cities, city];
        set({ cities: newCities });
        // If this is the first city and no location set, activate it
        if (newCities.length === 1 && !get().location) {
          set({
            activeCityIndex: 0,
            location: { lat: city.lat, lon: city.lon, city: city.name, country: '', timezone: city.tz },
            convention: city.convention,
            asrMethod: city.asrMethod,
            criterion: city.criterion,
          });
        }
      },

      removeCity: (id) => {
        const { cities, activeCityIndex } = get();
        const idx = cities.findIndex((c) => c.id === id);
        if (idx === -1) return;
        const newCities = cities.filter((c) => c.id !== id);
        let newIdx = activeCityIndex;
        if (idx < activeCityIndex) {
          newIdx = activeCityIndex - 1;
        } else if (idx === activeCityIndex) {
          newIdx = Math.min(activeCityIndex, newCities.length - 1);
        }
        newIdx = Math.max(0, newIdx);
        set({ cities: newCities, activeCityIndex: newIdx });
        // Update top-level fields if there are remaining cities
        if (newCities.length > 0) {
          const active = newCities[newIdx];
          set({
            location: { lat: active.lat, lon: active.lon, city: active.name, country: '', timezone: active.tz },
            convention: active.convention,
            asrMethod: active.asrMethod,
            criterion: active.criterion,
          });
        }
      },

      setActiveCity: (index) => {
        const { cities } = get();
        if (index < 0 || index >= cities.length) return;
        const city = cities[index];
        set({
          activeCityIndex: index,
          location: { lat: city.lat, lon: city.lon, city: city.name, country: '', timezone: city.tz },
          convention: city.convention,
          asrMethod: city.asrMethod,
          criterion: city.criterion,
        });
      },
    }),
    {
      name: 'altariq-settings',
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        if (version < 2) {
          // Add cities array and activeCityIndex to legacy stores
          const old = persisted as Record<string, unknown>;
          return { ...old, cities: [], activeCityIndex: 0 };
        }
        return persisted;
      },
    }
  )
);
