import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { MatchResult } from '../types';

const severityColor: Record<string, string> = {
  low: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300',
  medium: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-300',
  high: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300',
};

const typeIcon: Record<string, string> = {
  positive: '✅',
  neutral: 'ℹ️',
  negative: '⚠️',
};

const tierColors: Record<string, string> = {
  green: 'from-green-500 to-emerald-500',
  emerald: 'from-emerald-500 to-teal-500',
  yellow: 'from-yellow-400 to-amber-400',
  orange: 'from-orange-400 to-red-400',
  red: 'from-red-500 to-pink-500',
};

function ScoreRing({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let start = 0;
    const step = score / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= score) {
        setDisplayed(score);
        clearInterval(timer);
      } else {
        setDisplayed(Math.round(start));
      }
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  const dashOffset = circumference - (displayed / 100) * circumference;
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" className="dark:stroke-gray-700" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white" style={{ color }}>{displayed}</div>
        <div className="text-xs text-gray-400">/ 100</div>
      </div>
    </div>
  );
}

function AnimatedBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-400' : 'bg-red-400';
  return (
    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

function InitialsAvatar({ name, avatar }: { name: string; avatar?: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  if (avatar) {
    return <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />;
  }
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
      {initials}
    </div>
  );
}

export default function MatchCard({ match, index = 0 }: { match: MatchResult; index?: number }) {
  const { candidate, matchScore, breakdown, conflicts, explanations, linkedRooms, tier, topReasons } = match;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <InitialsAvatar name={candidate.name || '?'} avatar={candidate.avatar} />
          <div className="min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{candidate.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {candidate.age}y · {candidate.occupation} · {candidate.location?.city}, {candidate.location?.state}
            </p>
            {candidate.lifeIntent && (
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                candidate.lifeIntent.lifeMode === 'growth'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : candidate.lifeIntent.lifeMode === 'chill'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              }`}>
                {candidate.lifeIntent.lifeMode} mode
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 text-center">
          <ScoreRing score={matchScore} />
          {tier && (
            <div className={`mt-1 text-xs font-semibold bg-gradient-to-r ${tierColors[tier.color]} bg-clip-text text-transparent`}>
              {tier.emoji} {tier.tier}
            </div>
          )}
        </div>
      </div>

      {/* Tier description */}
      {tier && (
        <div className={`text-xs px-3 py-2 rounded-lg bg-gradient-to-r ${tierColors[tier.color]} text-white font-medium`}>
          {tier.emoji} {tier.description}
        </div>
      )}

      {/* Top 3 Reasons */}
      {topReasons && topReasons.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Top Reasons</h4>
          <div className="space-y-1.5">
            {topReasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span>{r.type === 'positive' ? '✅' : r.type === 'negative' ? '⚠️' : 'ℹ️'}</span>
                <span className="text-gray-600 dark:text-gray-400">{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score Breakdown */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Score Breakdown</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(breakdown).map(([key, val]) => (
            <div key={key} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
              <div className="flex items-center gap-2 mt-1">
                <AnimatedBar score={val.score} />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-7 text-right">{val.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explanations */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Why This Match</h4>
        <div className="space-y-1.5">
          {explanations.map((exp, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span>{typeIcon[exp.type]}</span>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">{exp.category}:</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">{exp.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Predicted Conflicts</h4>
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
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Their Room{linkedRooms.length > 1 ? 's' : ''}</h4>
          <div className="space-y-2">
            {linkedRooms.map((r) => (
              <div key={r._id} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm">
                <span className="font-medium text-blue-800 dark:text-blue-300">{r.title}</span>
                <span className="text-blue-600 dark:text-blue-400 ml-2">₹{r.rent?.toLocaleString()}/mo</span>
                <span className="text-blue-500 dark:text-blue-500 ml-2">· {r.location?.city}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hobbies */}
      {candidate.hobbies && candidate.hobbies.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {candidate.hobbies.map((h) => (
            <span key={h} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">{h}</span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

