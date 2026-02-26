import { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
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
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('image', file);
          const res = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return res.data.url as string;
        })
      );
      setImages(prev => [...prev, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploaded`);
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: form.title,
      rent: form.rent,
      location: { city: form.city, state: form.state },
      amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      images,
      vacancyType: form.vacancyType,
      availableFrom: form.availableFrom,
      currentRoommates: currentUser?._id ? [currentUser._id] : [],
      postedBy: currentUser?._id || undefined,
      description: form.description,
    });
  };

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
  const inputClass = 'w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none';

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

      {/* Image Upload */}
      <div>
        <label className={labelClass}>Images (up to 5)</label>
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-amber-400 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Uploading...</p>
          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400">📷 Click to upload images</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Max 5 images, 5MB each</p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
          disabled={images.length >= 5 || uploading}
        />
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {images.map((url, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <img src={url} alt={`Room ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting || uploading}
        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-teal-500 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? 'Posting…' : 'Post Room'}
      </button>
    </form>
  );
}
