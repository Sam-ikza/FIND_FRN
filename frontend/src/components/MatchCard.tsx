import type { MatchResult } from '../types';

const severityColor: Record<string, string> = {
  low: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  medium: 'bg-orange-50 border-orange-200 text-orange-800',
  high: 'bg-red-50 border-red-200 text-red-800',
};

const typeIcon: Record<string, string> = {
  positive: '✅',
  neutral: 'ℹ️',
  negative: '⚠️',
};

export default function MatchCard({ match }: { match: MatchResult }) {
  const { candidate, matchScore, breakdown, conflicts, explanations, linkedRooms } = match;

  const scoreColor =
    matchScore >= 70 ? 'text-green-600' : matchScore >= 45 ? 'text-yellow-600' : 'text-red-500';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
          <p className="text-sm text-gray-500">
            {candidate.age}y · {candidate.occupation} · {candidate.location?.city}, {candidate.location?.state}
          </p>
          {candidate.lifeIntent && (
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
              candidate.lifeIntent.lifeMode === 'growth'
                ? 'bg-purple-100 text-purple-700'
                : candidate.lifeIntent.lifeMode === 'chill'
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {candidate.lifeIntent.lifeMode} mode
            </span>
          )}
        </div>
        <div className="text-center">
          <div className={`text-3xl font-bold ${scoreColor}`}>{matchScore}</div>
          <div className="text-xs text-gray-400">match score</div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Score Breakdown</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(breakdown).map(([key, val]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${val.score >= 70 ? 'bg-green-500' : val.score >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${val.score}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">{val.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explanations */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Why This Match</h4>
        <div className="space-y-1.5">
          {explanations.map((exp, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span>{typeIcon[exp.type]}</span>
              <div>
                <span className="font-medium text-gray-700">{exp.category}:</span>{' '}
                <span className="text-gray-600">{exp.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Predicted Conflicts</h4>
          <div className="space-y-2">
            {conflicts.map((c, i) => (
              <div key={i} className={`text-sm px-3 py-2 rounded-lg border ${severityColor[c.severity]}`}>
                <span className="font-medium capitalize">[{c.severity}]</span> {c.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linked Rooms */}
      {linkedRooms.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Their Room{linkedRooms.length > 1 ? 's' : ''}</h4>
          <div className="space-y-2">
            {linkedRooms.map((r) => (
              <div key={r._id} className="bg-blue-50 rounded-lg p-3 text-sm">
                <span className="font-medium text-blue-800">{r.title}</span>
                <span className="text-blue-600 ml-2">₹{r.rent?.toLocaleString()}/mo</span>
                <span className="text-blue-500 ml-2">· {r.location?.city}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hobbies */}
      {candidate.hobbies && candidate.hobbies.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {candidate.hobbies.map((h) => (
            <span key={h} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{h}</span>
          ))}
        </div>
      )}
    </div>
  );
}
