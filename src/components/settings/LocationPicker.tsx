'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocation } from '@/lib/hooks/useLocation';
import { useLocations } from '@/lib/hooks/useLocations';
import { useSettingsStore } from '@/lib/store/settings';
import { MapPin, Loader2, Search, X, Star, Globe } from 'lucide-react';
import { CITIES, type City } from '@/lib/data/cities';
import type { PresetLocation, LocationRegion } from '@/lib/types/location';
import type { CrescentCriterion, PrayerConvention } from '@/lib/types/settings';

const REGION_LABELS: Record<LocationRegion, string> = {
  arabian_peninsula: 'Arabian Peninsula',
  levant_iraq: 'Levant & Iraq',
  north_africa: 'North Africa',
  sub_saharan_africa: 'Sub-Saharan Africa',
  south_asia: 'South Asia',
  southeast_asia: 'Southeast Asia',
  central_asia: 'Central Asia',
  turkey_caucasus: 'Turkey & Caucasus',
  europe: 'Europe',
  americas: 'Americas',
  oceania: 'Oceania',
};

const REGION_ORDER: LocationRegion[] = [
  'arabian_peninsula',
  'levant_iraq',
  'north_africa',
  'sub_saharan_africa',
  'south_asia',
  'southeast_asia',
  'central_asia',
  'turkey_caucasus',
  'europe',
  'americas',
  'oceania',
];

export default function LocationPicker() {
  const t = useTranslations('settings');
  const { location, detecting, error, detect } = useLocation();
  const setLocation = useSettingsStore((s) => s.setLocation);
  const setConvention = useSettingsStore((s) => s.setConvention);
  const setCriterion = useSettingsStore((s) => s.setCriterion);
  const { data: locationsData } = useLocations();

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<LocationRegion | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter cities based on query (city or country match)
  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return CITIES.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q),
    ).slice(0, 30);
  }, [query]);

  // Group preset locations by region
  const presetsByRegion = useMemo(() => {
    if (!locationsData?.locations) return new Map<LocationRegion, PresetLocation[]>();
    const map = new Map<LocationRegion, PresetLocation[]>();
    for (const loc of locationsData.locations) {
      const list = map.get(loc.region) ?? [];
      list.push(loc);
      map.set(loc.region, list);
    }
    return map;
  }, [locationsData]);

  // Available regions in order
  const regions = useMemo(() => {
    return REGION_ORDER.filter((r) => presetsByRegion.has(r));
  }, [presetsByRegion]);

  // Locations to show (filtered by region or all)
  const visiblePresets = useMemo(() => {
    if (selectedRegion) return presetsByRegion.get(selectedRegion) ?? [];
    return locationsData?.locations ?? [];
  }, [selectedRegion, presetsByRegion, locationsData]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectCity(city: City) {
    setLocation({
      lat: city.lat,
      lon: city.lon,
      city: city.city,
      country: city.country,
      timezone: city.timezone,
    });
    setQuery('');
    setOpen(false);
  }

  function selectPreset(loc: PresetLocation) {
    setLocation({
      lat: loc.lat,
      lon: loc.lon,
      city: loc.name,
      country: loc.country,
      timezone: loc.tz,
    });
    // Auto-configure criterion and prayer convention
    setCriterion(loc.criterion as CrescentCriterion);
    setConvention(loc.prayer_convention as PrayerConvention);
    setShowPresets(false);
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-2)]">{t('location')}</h3>

      {/* Current location display */}
      {location && (
        <div className="flex items-center gap-2 rounded-lg bg-[var(--bg-card)] p-3">
          <MapPin size={16} className="text-[var(--accent)]" />
          <span className="text-sm">{location.city}, {location.country}</span>
          <span className="ml-auto text-xs text-[var(--text-2)]">
            {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
          </span>
        </div>
      )}

      {/* City search */}
      <div className="relative">
        <div className="flex items-center gap-2 rounded-lg border border-[var(--accent)]/20 bg-[var(--bg-card)] px-3 py-2">
          <Search size={16} className="text-[var(--text-2)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              if (showPresets) setShowPresets(false);
            }}
            onFocus={() => { if (query.trim()) setOpen(true); }}
            placeholder={t('searchCity')}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-2)]/50"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setOpen(false); }}
              className="text-[var(--text-2)] hover:text-[var(--text-1)]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown results */}
        {open && filtered.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-[var(--accent)]/20 bg-[var(--bg-card)] shadow-lg"
          >
            {filtered.map((city) => (
              <button
                key={`${city.city}-${city.country}-${city.lat}`}
                onClick={() => selectCity(city)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--accent)]/10"
              >
                <MapPin size={14} className="shrink-0 text-[var(--accent)]" />
                <span className="font-medium">{city.city}</span>
                <span className="text-[var(--text-2)]">{city.country}</span>
              </button>
            ))}
          </div>
        )}

        {/* No results message */}
        {open && query.trim().length >= 2 && filtered.length === 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 w-full rounded-lg border border-[var(--accent)]/20 bg-[var(--bg-card)] px-3 py-3 text-center text-xs text-[var(--text-2)] shadow-lg"
          >
            {t('noCityFound')}
          </div>
        )}
      </div>

      {/* Action buttons row */}
      <div className="flex gap-2">
        {/* Detect location button */}
        <button
          onClick={detect}
          disabled={detecting}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--accent)]/30 bg-[var(--bg-card)] px-4 py-2.5 text-sm transition-colors hover:border-[var(--accent)]"
        >
          {detecting ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
          {detecting ? t('detecting') : t('detectLocation')}
        </button>

        {/* Presets toggle button */}
        <button
          onClick={() => setShowPresets(!showPresets)}
          className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
            showPresets
              ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
              : 'border-[var(--accent)]/30 bg-[var(--bg-card)] hover:border-[var(--accent)]'
          }`}
        >
          <Globe size={16} />
          {t('presets')}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Preset locations panel */}
      {showPresets && locationsData && (
        <div className="space-y-3 rounded-lg border border-[var(--accent)]/20 bg-[var(--bg-card)] p-3">
          <p className="text-xs text-[var(--text-2)]">{t('presetsHint')}</p>

          {/* Region filter chips */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedRegion(null)}
              className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                selectedRegion === null
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--accent)]/10 text-[var(--text-2)] hover:bg-[var(--accent)]/20'
              }`}
            >
              {t('allRegions')}
            </button>
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                  selectedRegion === r
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--accent)]/10 text-[var(--text-2)] hover:bg-[var(--accent)]/20'
                }`}
              >
                {REGION_LABELS[r]}
              </button>
            ))}
          </div>

          {/* Location list */}
          <div className="max-h-60 space-y-0.5 overflow-y-auto">
            {visiblePresets.map((loc) => (
              <button
                key={loc.id}
                onClick={() => selectPreset(loc)}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-[var(--accent)]/10"
              >
                {loc.category === 'islamic_center' ? (
                  <Star size={14} className="shrink-0 text-[var(--accent)]" />
                ) : (
                  <MapPin size={14} className="shrink-0 text-[var(--text-2)]" />
                )}
                <span className="font-medium">{loc.name}</span>
                <span className="text-xs text-[var(--text-2)]">{loc.country}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
