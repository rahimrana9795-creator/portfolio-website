import WeeklyChart from "@/components/admin/WeeklyChart";
import { getPopularPages, getStats, getWeeklyViews } from "@/lib/site";

export default function AdminAnalyticsPage() {
  const stats = getStats();
  const weekly = getWeeklyViews();
  const popular = getPopularPages(10);

  return (
    <>
      <div>
        <h1 className="font-head text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted">Traffic insights for your portfolio.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-surface p-5">
          <p className="text-sm text-muted">Total Views</p>
          <p className="font-head text-2xl font-bold">{stats.pageViews}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-sm text-muted">Unique Visitors</p>
          <p className="font-head text-2xl font-bold">{stats.uniqueVisitors}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-sm text-muted">Messages</p>
          <p className="font-head text-2xl font-bold">{stats.messages}</p>
        </div>
      </div>

      <div className="card-surface p-6">
        <h2 className="mb-6 font-head text-lg font-bold">
          <i className="fa-solid fa-chart-area mr-2 text-accent" /> Views — Last 7 Days
        </h2>
        <WeeklyChart labels={weekly.labels} counts={weekly.counts} />
      </div>

      <div className="card-surface p-6">
        <h2 className="mb-5 font-head text-lg font-bold">
          <i className="fa-solid fa-ranking-star mr-2 text-accent" /> Top Pages
        </h2>
        <ul className="space-y-2.5">
          {popular.map((p, i) => (
            <li key={p.path} className="flex items-center gap-3 rounded-xl border border-white/5 bg-bg/60 px-4 py-2.5">
              <span className="font-head text-sm font-bold text-muted">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-sm">{p.path}</span>
              <span className="text-sm font-semibold text-accent">{p.c}</span>
            </li>
          ))}
          {popular.length === 0 && <li className="text-sm text-muted">No page views yet.</li>}
        </ul>
      </div>
    </>
  );
}
