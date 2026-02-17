import { useState } from 'react';
import type { User } from '../types';

const LIFE_GOALS = [
  { value: 'career_growth', label: 'Career Growth' },
  { value: 'higher_studies', label: 'Higher Studies' },
  { value: 'startup_or_side_hustle', label: 'Startup / Side Hustle' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'creative_exploration', label: 'Creative Exploration' },
  { value: 'spiritual_growth', label: 'Spiritual Growth' },
  { value: 'stability_and_peace', label: 'Stability & Peace' },
];

const defaultUser: Omit<User, '_id'> = {
  name: '',
  age: 22,
  gender: 'male',
  occupation: 'student',
  budgetRange: { min: 5000, max: 15000 },
  location: { city: '', state: '' },
  moveInDate: '',
  cleanlinessLevel: 3,
  sleepSchedule: 'flexible',
  smoking: false,
  drinking: false,
  guestsFrequency: 'medium',
  noiseTolerance: 'medium',
  introvertExtrovertScale: 3,
  weekendStyle: 'mixed',
  hobbies: [],
  lifeIntent: {
    lifeMode: 'balanced',
    lifeGoals: [],
    dailyEnergyLevel: 'medium',
    struggleStabilityScale: 3,
  },
  culturalOpenness: {
    culturalPreference: 'mixed',
    sameStatePreference: 'open_to_all',
  },
};

interface Props {
  onSubmit: (data: Omit<User, '_id'>) => void;
  submitting?: boolean;
}

export default function UserProfileForm({ onSubmit, submitting }: Props) {
  const [form, setForm] = useState<Omit<User, '_id'>>(defaultUser);
  const [hobbyInput, setHobbyInput] = useState('');

  const set = (path: string, value: any) => {
    setForm((prev) => {
      const copy: any = { ...prev };
      const parts = path.split('.');
      let obj = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        obj[parts[i]] = { ...obj[parts[i]] };
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const addHobby = () => {
    const h = hobbyInput.trim();
    if (h && !form.hobbies.includes(h)) {
      set('hobbies', [...form.hobbies, h]);
    }
    setHobbyInput('');
  };

  const toggleGoal = (goal: string) => {
    const current = form.lifeIntent.lifeGoals;
    if (current.includes(goal)) {
      set('lifeIntent.lifeGoals', current.filter((g) => g !== goal));
    } else if (current.length < 3) {
      set('lifeIntent.lifeGoals', [...current, goal]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none';
  const selectClass = inputClass;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── BASIC INFO ── */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name *</label>
            <input required className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Age *</label>
            <input required type="number" min={16} max={80} className={inputClass} value={form.age} onChange={(e) => set('age', +e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Gender *</label>
            <select className={selectClass} value={form.gender} onChange={(e) => set('gender', e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Occupation *</label>
            <select className={selectClass} value={form.occupation} onChange={(e) => set('occupation', e.target.value)}>
              <option value="student">Student</option>
              <option value="working">Working</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>City *</label>
            <input required className={inputClass} value={form.location.city} onChange={(e) => set('location.city', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>State *</label>
            <input required className={inputClass} value={form.location.state} onChange={(e) => set('location.state', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Budget Min (₹)</label>
            <input type="number" className={inputClass} value={form.budgetRange.min} onChange={(e) => set('budgetRange.min', +e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Budget Max (₹)</label>
            <input type="number" className={inputClass} value={form.budgetRange.max} onChange={(e) => set('budgetRange.max', +e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Move-in Date</label>
            <input type="date" className={inputClass} value={form.moveInDate?.toString().slice(0, 10) || ''} onChange={(e) => set('moveInDate', e.target.value)} />
          </div>
        </div>
      </section>

      {/* ── LIFESTYLE ── */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Lifestyle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Cleanliness Level: {form.cleanlinessLevel}</label>
            <input type="range" min={1} max={5} className="w-full" value={form.cleanlinessLevel} onChange={(e) => set('cleanlinessLevel', +e.target.value)} />
            <div className="flex justify-between text-xs text-gray-400"><span>Relaxed</span><span>Spotless</span></div>
          </div>
          <div>
            <label className={labelClass}>Sleep Schedule</label>
            <select className={selectClass} value={form.sleepSchedule} onChange={(e) => set('sleepSchedule', e.target.value)}>
              <option value="early">Early Bird</option>
              <option value="late">Night Owl</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div className="flex gap-6 items-center col-span-full">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.smoking} onChange={(e) => set('smoking', e.target.checked)} className="rounded" /> Smoker
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.drinking} onChange={(e) => set('drinking', e.target.checked)} className="rounded" /> Drinker
            </label>
          </div>
          <div>
            <label className={labelClass}>Guests Frequency</label>
            <select className={selectClass} value={form.guestsFrequency} onChange={(e) => set('guestsFrequency', e.target.value)}>
              <option value="low">Rarely</option>
              <option value="medium">Sometimes</option>
              <option value="high">Often</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Noise Tolerance</label>
            <select className={selectClass} value={form.noiseTolerance} onChange={(e) => set('noiseTolerance', e.target.value)}>
              <option value="low">Low (need quiet)</option>
              <option value="medium">Medium</option>
              <option value="high">High (noise is fine)</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── PERSONALITY ── */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Personality & Hobbies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Introvert ↔ Extrovert: {form.introvertExtrovertScale}</label>
            <input type="range" min={1} max={5} className="w-full" value={form.introvertExtrovertScale} onChange={(e) => set('introvertExtrovertScale', +e.target.value)} />
            <div className="flex justify-between text-xs text-gray-400"><span>Introvert</span><span>Extrovert</span></div>
          </div>
          <div>
            <label className={labelClass}>Weekend Style</label>
            <select className={selectClass} value={form.weekendStyle} onChange={(e) => set('weekendStyle', e.target.value)}>
              <option value="homebody">Homebody</option>
              <option value="outings">Outings</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <div className="col-span-full">
            <label className={labelClass}>Hobbies</label>
            <div className="flex gap-2">
              <input className={inputClass} placeholder="Add a hobby…" value={hobbyInput} onChange={(e) => setHobbyInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHobby())} />
              <button type="button" onClick={addHobby} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.hobbies.map((h) => (
                <span key={h} className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm flex items-center gap-1">
                  {h}
                  <button type="button" onClick={() => set('hobbies', form.hobbies.filter((x) => x !== h))} className="text-brand-400 hover:text-red-500 ml-1">&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LIFE INTENT ── */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Life Intent & Mindset</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Life Mode</label>
            <select className={selectClass} value={form.lifeIntent.lifeMode} onChange={(e) => set('lifeIntent.lifeMode', e.target.value)}>
              <option value="growth">Growth — hustle, learning, struggle-friendly</option>
              <option value="chill">Chill — peace, stability, low tension</option>
              <option value="balanced">Balanced</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Daily Energy Level</label>
            <select className={selectClass} value={form.lifeIntent.dailyEnergyLevel} onChange={(e) => set('lifeIntent.dailyEnergyLevel', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="col-span-full">
            <label className={labelClass}>Struggle ↔ Stability: {form.lifeIntent.struggleStabilityScale}</label>
            <input type="range" min={1} max={5} className="w-full" value={form.lifeIntent.struggleStabilityScale} onChange={(e) => set('lifeIntent.struggleStabilityScale', +e.target.value)} />
            <div className="flex justify-between text-xs text-gray-400"><span>1 — Enjoys uncertainty</span><span>5 — Wants predictability</span></div>
          </div>
          <div className="col-span-full">
            <label className={labelClass}>Life Goals (select up to 3)</label>
            <div className="flex flex-wrap gap-2">
              {LIFE_GOALS.map((g) => (
                <button
                  type="button"
                  key={g.value}
                  onClick={() => toggleGoal(g.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    form.lifeIntent.lifeGoals.includes(g.value)
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CULTURAL OPENNESS ── */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Cultural Openness <span className="text-xs text-gray-400 font-normal">(optional)</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Cultural Preference</label>
            <select className={selectClass} value={form.culturalOpenness.culturalPreference} onChange={(e) => set('culturalOpenness.culturalPreference', e.target.value)}>
              <option value="comfort_zone">Comfort Zone — similar background preferred</option>
              <option value="mixed">Mixed — no strong preference</option>
              <option value="explorer">Explorer — open to different cultures</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>State Preference</label>
            <select className={selectClass} value={form.culturalOpenness.sameStatePreference} onChange={(e) => set('culturalOpenness.sameStatePreference', e.target.value)}>
              <option value="open_to_all">Open to all states</option>
              <option value="same_state_only">Same state only</option>
            </select>
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={submitting}
        className="w-full md:w-auto px-8 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
      >
        {submitting ? 'Creating Profile…' : 'Create Profile'}
      </button>
    </form>
  );
}
