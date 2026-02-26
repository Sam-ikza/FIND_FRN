import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterState {
  city: string;
  minRent: string;
  maxRent: string;
  vacancyType: 'all' | 'single' | 'shared';
  amenities: string[];
  sort: 'newest' | 'cheapest' | 'expensive';
  search: string;
}

const AMENITY_OPTIONS = ['WiFi', 'AC', 'Kitchen', 'Gym', 'Pool', 'Meals', 'Laundry', 'Washing Machine', 'Parking'];

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function RoomFilters({ filters, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const update = (key: keyof FilterState, value: any) => onChange({ ...filters, [key]: value });

  const toggleAmenity = (amenity: string) => {
    const updated = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    update('amenities', updated);
  };

  const clearFilters = () => onChange({
    city: '', minRent: '', maxRent: '', vacancyType: 'all',
    amenities: [], sort: 'newest', search: '',
  });

  const inputClass = 'w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none';
  const labelClass = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 relative">
          <input
            className={inputClass + ' pl-9'}
            placeholder="Search rooms..."
            value={filters.search}
            onChange={e => update('search', e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="ml-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5"
        >
          ⚙️ Filters {open ? '▲' : '▼'}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-gray-100 dark:border-gray-700 mt-3">
              <div>
                <label className={labelClass}>City</label>
                <input className={inputClass} placeholder="e.g. Bengaluru" value={filters.city} onChange={e => update('city', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Min Rent (₹)</label>
                <input type="number" className={inputClass} placeholder="0" value={filters.minRent} onChange={e => update('minRent', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Max Rent (₹)</label>
                <input type="number" className={inputClass} placeholder="Any" value={filters.maxRent} onChange={e => update('maxRent', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Sort By</label>
                <select className={inputClass} value={filters.sort} onChange={e => update('sort', e.target.value as any)}>
                  <option value="newest">Newest</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="expensive">Most Expensive</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className={labelClass}>Vacancy Type</label>
              <div className="flex gap-2">
                {(['all', 'single', 'shared'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => update('vacancyType', t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filters.vacancyType === t
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t === 'all' ? 'All' : t === 'single' ? 'Single' : 'Shared'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <label className={labelClass}>Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map(a => (
                  <button
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      filters.amenities.includes(a)
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button onClick={clearFilters} className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
