import { useState } from 'react';
import type { Room } from '../types';
import { useUserStore } from '../store/userStore';

interface Props {
  onSubmit: (data: any) => void;
  submitting?: boolean;
}

export default function RoomForm({ onSubmit, submitting }: Props) {
  const currentUser = useUserStore((s) => s.currentUser);
  const [form, setForm] = useState({
    title: '',
    rent: 10000,
    city: currentUser?.location.city || '',
    state: currentUser?.location.state || '',
    amenities: '' as string,
    vacancyType: 'shared' as 'single' | 'shared',
    availableFrom: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: form.title,
      rent: form.rent,
      location: { city: form.city, state: form.state },
      amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      images: [],
      vacancyType: form.vacancyType,
      availableFrom: form.availableFrom,
      currentRoommates: currentUser?._id ? [currentUser._id] : [],
      postedBy: currentUser?._id || undefined,
      description: form.description,
    });
  };

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Title *</label>
        <input required className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Rent (₹/mo) *</label>
          <input required type="number" className={inputClass} value={form.rent} onChange={(e) => setForm({ ...form, rent: +e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Vacancy Type</label>
          <select className={inputClass} value={form.vacancyType} onChange={(e) => setForm({ ...form, vacancyType: e.target.value as any })}>
            <option value="shared">Shared</option>
            <option value="single">Single Room</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>City *</label>
          <input required className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>State *</label>
          <input required className={inputClass} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Amenities (comma separated)</label>
        <input className={inputClass} placeholder="WiFi, AC, Kitchen…" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
      </div>
      <div>
        <label className={labelClass}>Available From *</label>
        <input required type="date" className={inputClass} value={form.availableFrom} onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}/>
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea rows={3} className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="px-8 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
      >
        {submitting ? 'Posting…' : 'Post Room'}
      </button>
    </form>
  );
}
