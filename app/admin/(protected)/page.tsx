import Link from "next/link";
import WeeklyChart from "@/components/admin/WeeklyChart";
import { getMessages, getPopularPages, getStats, getWeeklyViews } from "@/lib/site";

export default function AdminDashboardPage() {
  const stats = getStats();
  const weekly = getWeeklyViews();
  const popular = getPopularPages(6);
  const recent = getMessages(5);

  const cards = [
    { label: "Projects", value: stats.projects, icon: "fa-briefcase", href: "/admin/projects", color: "text-sky-400 bg-sky-400/10 border-sky-400/25" },
    { label: "Messages", value: stats.messages, icon: "fa-envelope", href: "/admin/messages", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25" },
    { label: "Unread", value: stats.unreadMessages, icon: "fa-envelope-open-text", href: "/admin/messages", color: "text-amber-400 bg-amber-400/10 border-amber-400/25" },
    { label: "Page Views", value: stats.pageViews, icon: "fa-eye", href: "/admin/analytics", color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/25" },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-head text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted">Overview of your portfolio content and activity.</p>
        </div>
        <Link href="/" className="btn btn-ghost btn-sm">
          <i className="fa-solid fa-globe" /> View Site
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="card-surface flex items-center gap-4 p-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl border text-lg ${card.color}`}>
              <i className={`fa-solid ${card.icon}`} />
            </div>
            <div>
              <p className="text-sm text-muted">{card.label}</p>
              <p className="font-head text-2xl font-bold">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="card-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-head text-lg font-bold">
              <i className="fa-solid fa-chart-area mr-2 text-accent" /> Weekly Views
            </h2>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-muted">
              {stats.pageViews} total
            </span>
          </div>
          <WeeklyChart labels={weekly.labels} counts={weekly.counts} />
        </div>

        <div className="card-surface p-6">
          <h2 className="mb-5 font-head text-lg font-bold">
            <i className="fa-solid fa-fire mr-2 text-accent" /> Popular Pages
          </h2>
          <ul className="space-y-2.5">
            {popular.map((p, i) => (
              <li key={p.path} className="flex items-center gap-3 rounded-xl border border-white/5 bg-bg/60 px-4 py-2.5">
                <span className="font-head text-sm font-bold text-muted">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-ink">{p.path}</span>
                <span className="text-sm font-semibold text-accent">{p.c}</span>
              </li>
            ))}
            {popular.length === 0 && <li className="text-sm text-muted">No page views yet — visit the site to start collecting data.</li>}
          </ul>
        </div>
      </div>

      <div className="card-surface p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-head text-lg font-bold">
            <i className="fa-solid fa-inbox mr-2 text-accent" /> Recent Messages
          </h2>
          <Link href="/admin/messages" className="text-sm font-semibold text-accent hover:underline">
            View all <i className="fa-solid fa-arrow-right ml-1" />
          </Link>
        </div>
        <ul className="divide-y divide-white/5">
          {recent.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-3 py-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                  m.is_read ? "bg-white/10 text-muted" : "bg-accent/20 text-accent"
                }`}
              >
                {m.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {m.name} <span className="font-normal text-muted">· {m.subject || "No subject"}</span>
                </p>
                <p className="truncate text-xs text-muted">{m.message}</p>
              </div>
              <span className="text-xs text-muted">{m.created_at.replace("T", " ").slice(0, 16)}</span>
            </li>
          ))}
          {recent.length === 0 && <li className="py-4 text-sm text-muted">No messages yet.</li>}
        </ul>
      </div>
    </>
  );
}
