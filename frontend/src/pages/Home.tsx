import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto text-center py-16 space-y-8">
      <div className="text-6xl">🏠</div>
      <h1 className="text-4xl font-bold text-gray-900">
        Room<span className="text-brand-600">Sync</span>
      </h1>
      <p className="text-xl text-gray-600 leading-relaxed">
        Find roommates who match your <strong>life intent</strong>, not just your budget.<br />
        We predict conflicts before they happen and explain <em>why</em> a match works.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12">
        <div className="bg-white rounded-xl border p-6">
          <div className="text-2xl mb-3">🎯</div>
          <h3 className="font-semibold text-gray-800">Intent Alignment</h3>
          <p className="text-sm text-gray-500 mt-2">Growth vs. chill vs. balanced — we match you with people in the same life phase.</p>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <div className="text-2xl mb-3">⚡</div>
          <h3 className="font-semibold text-gray-800">Conflict Prediction</h3>
          <p className="text-sm text-gray-500 mt-2">We simulate daily friction before you move in. No surprises.</p>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <div className="text-2xl mb-3">💡</div>
          <h3 className="font-semibold text-gray-800">Explainable Matching</h3>
          <p className="text-sm text-gray-500 mt-2">Every score comes with human-readable reasons. You understand <em>why</em>.</p>
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-8">
        <Link to="/profile" className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors">
          Create Profile
        </Link>
        <Link to="/rooms" className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Browse Rooms
        </Link>
      </div>
    </div>
  );
}
