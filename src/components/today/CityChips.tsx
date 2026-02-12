'use client';

import { useSettingsStore } from '@/lib/store/settings';

export default function CityChips() {
  const cities = useSettingsStore((s) => s.cities);
  const activeCityIndex = useSettingsStore((s) => s.activeCityIndex);
  const setActiveCity = useSettingsStore((s) => s.setActiveCity);

  // Don't show if 0 or 1 city
  if (cities.length <= 1) return null;

  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
      {cities.map((city, idx) => (
        <button
          key={city.id}
          onClick={() => setActiveCity(idx)}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            idx === activeCityIndex
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--accent)]/10 text-[var(--text-2)] hover:bg-[var(--accent)]/20'
          }`}
        >
          {city.name}
        </button>
      ))}
    </div>
  );
}
