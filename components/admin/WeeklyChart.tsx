"use client";

export default function WeeklyChart({ labels, counts }: { labels: string[]; counts: number[] }) {
  const max = Math.max(...counts, 1);
  return (
    <div className="flex h-52 items-end gap-3">
      {labels.map((label, i) => (
        <div key={label + i} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-semibold text-muted">{counts[i]}</span>
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-cyan-400 transition-all"
            style={{ height: `${Math.max((counts[i] / max) * 100, counts[i] > 0 ? 6 : 2)}%` }}
            title={`${label}: ${counts[i]} views`}
          />
          <span className="text-[0.7rem] font-medium text-muted">{label}</span>
        </div>
      ))}
    </div>
  );
}
