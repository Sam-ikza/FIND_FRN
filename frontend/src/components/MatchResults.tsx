import type { MatchResult } from '../types';
import MatchCard from './MatchCard';

interface Props {
  matches: MatchResult[];
  seekerName: string;
}

export default function MatchResults({ matches, seekerName }: Props) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-lg">No matches found for {seekerName}.</p>
        <p className="text-sm">Try adjusting preferences or add more users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {matches.length} Match{matches.length !== 1 ? 'es' : ''} for {seekerName}
        </h2>
        <span className="text-sm text-gray-400 dark:text-gray-500">Sorted by match score</span>
      </div>
      {matches.map((m, i) => (
        <MatchCard key={m.candidate._id} match={m} index={i} />
      ))}
    </div>
  );
}

