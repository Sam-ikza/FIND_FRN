import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  breakdown: Record<string, { score: number; max: number }>;
}

const DIMENSION_LABELS: Record<string, string> = {
  intentAlignment: 'Intent',
  lifestyle: 'Lifestyle',
  social: 'Social',
  budget: 'Budget',
  location: 'Location',
  timing: 'Timing',
  cultural: 'Cultural',
};

export default function MatchRadarChart({ breakdown }: Props) {
  const data = Object.entries(breakdown).map(([key, val]) => ({
    subject: DIMENSION_LABELS[key] || key.replace(/([A-Z])/g, ' $1').trim(),
    score: val.score,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
        <Radar
          name="Match Score"
          dataKey="score"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6' }}
          formatter={(val: number) => [`${val}%`, 'Score']}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
