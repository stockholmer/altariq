'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/lib/store/settings';
import { CITIES } from '@/lib/data/cities';
import { MapPin, Plus, X, Search } from 'lucide-react';
import type { CityProfile } from '@/lib/types/city-profile';

export default function TrackedCities() {
  const t = useTranslations('cities');
  const tSettings = useTranslations('settings');
  const cities = useSettingsStore((s) => s.cities);
  const activeCityIndex = useSettingsStore((s) => s.activeCityIndex);
  const addCity = useSettingsStore((s) => s.addCity);
  const removeCity = useSettingsStore((s) => s.removeCity);
  const setActiveCity = useSettingsStore((s) => s.setActiveCity);
  const convention = useSettingsStore((s) => s.convention);
  const asrMethod = useSettingsStore((s) => s.asrMethod);
  const criterion = useSettingsStore((s) => s.criterion);

  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return CITIES.filter(
      (c) => c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
    ).slice(0, 20);
  }, [query]);

  function handleAddCity(city: { city: string; country: string; lat: number; lon: number; timezone: string }) {
    const profile: CityProfile = {
      id: `${city.city}-${city.lat.toFixed(2)}-${city.lon.toFixed(2)}`,
      name: city.city,
      lat: city.lat,
      lon: city.lon,
      tz: city.timezone,
      convention,
      asrMethod,
      criterion,
    };
    addCity(profile);
    setShowSearch(false);
    setQuery('');
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-2)]">{t('trackedCities')}</h3>

      {/* Current tracked cities */}
      {cities.length > 0 && (
        <div className="space-y-1.5">
          {cities.map((city, idx) => (
            <div
              key={city.id}
              className={`flex items-center gap-2 rounded-lg p-2.5 transition-colors ${
                idx === activeCityIndex
                  ? 'bg-[var(--accent)]/10 border border-[var(--accent)]/30'
                  : 'bg-[var(--bg-card)] border border-transparent'
              }`}
            >
              <button
                onClick={() => setActiveCity(idx)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <MapPin size={14} className={idx === activeCityIndex ? 'text-[var(--accent)]' : 'text-[var(--text-2)]'} />
                <span className="text-sm font-medium">{city.name}</span>
              </button>
              <button
                onClick={() => removeCity(city.id)}
                className="rounded p-1 text-[var(--text-2)] hover:bg-[var(--accent)]/10 hover:text-[var(--text-1)]"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add city button / search */}
      {cities.length < 3 ? (
        showSearch ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-lg border border-[var(--accent)]/20 bg-[var(--bg-card)] px-3 py-2">
              <Search size={16} className="text-[var(--text-2)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder={tSettings('searchCity')}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-2)]/50"
              />
              <button onClick={() => { setShowSearch(false); setQuery(''); }} className="text-[var(--text-2)]">
                <X size={14} />
              </button>
            </div>
            {filtered.length > 0 && (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-[var(--accent)]/20 bg-[var(--bg-card)]">
                {filtered.map((city) => (
                  <button
                    key={`${city.city}-${city.country}-${city.lat}`}
                    onClick={() => handleAddCity(city)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--accent)]/10"
                  >
                    <MapPin size={14} className="shrink-0 text-[var(--accent)]" />
                    <span className="font-medium">{city.city}</span>
                    <span className="text-[var(--text-2)]">{city.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--accent)]/30 px-3 py-2.5 text-sm text-[var(--text-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Plus size={16} />
            {t('addCity')}
          </button>
        )
      ) : (
        <p className="text-xs text-[var(--text-2)]">{t('maxCities')}</p>
      )}
    </div>
  );
}
