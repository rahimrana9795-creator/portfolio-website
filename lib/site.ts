import { db } from "./db";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Project = {
  id: number;
  title: string;
  description: string;
  tech: string;
  status: string;
  url: string;
  source_url: string;
  thumbnail_url: string;
  is_featured: number;
  sort_order: number;
};

export type Service = { id: number; title: string; description: string; icon: string; sort_order: number };
export type Skill = { id: number; name: string; level: string; sort_order: number };
export type Experience = { id: number; role: string; company: string; years: string; description: string; sort_order: number };
export type Page = { id: number; title: string; slug: string; intro: string; body: string; show_in_nav: number; is_published: number; sort_order: number };
export type ContactMessage = { id: number; name: string; email: string; subject: string; message: string; is_read: number; created_at: string };

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export function getSetting(key: string, fallback = ""): string {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as { value: string } | undefined;
  return row ? row.value : fallback;
}

export function getSettings(): Record<string, string> {
  const rows = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

export function getProjects(limit?: number, featuredOnly = false): Project[] {
  let sql = "SELECT * FROM projects";
  const where: string[] = [];
  if (featuredOnly) where.push("is_featured = 1");
  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += " ORDER BY sort_order, title";
  if (limit) sql += " LIMIT " + limit;
  return db.prepare(sql).all() as Project[];
}

export function getServices(): Service[] {
  return db.prepare("SELECT * FROM services ORDER BY sort_order, title").all() as Service[];
}

export function getSkills(): Skill[] {
  return db.prepare("SELECT * FROM skills ORDER BY sort_order, name").all() as Skill[];
}

export function getExperiences(): Experience[] {
  return db.prepare("SELECT * FROM experiences ORDER BY sort_order, company").all() as Experience[];
}

export function getNavPages(): Page[] {
  return db
    .prepare("SELECT * FROM pages WHERE show_in_nav = 1 AND is_published = 1 ORDER BY sort_order, title")
    .all() as Page[];
}

export function getSocials(): { key: string; label: string; icon: string; url: string }[] {
  const defs: [string, string, string][] = [
    ["github", "GitHub", "fa-github"],
    ["linkedin", "LinkedIn", "fa-linkedin-in"],
    ["twitter", "Twitter", "fa-twitter"],
    ["instagram", "Instagram", "fa-instagram"],
    ["facebook", "Facebook", "fa-facebook-f"],
  ];
  const socials: { key: string; label: string; icon: string; url: string }[] = [];
  for (const [key, label, icon] of defs) {
    const url = process.env[`SOCIAL_${key.toUpperCase()}`];
    if (url) socials.push({ key, label, icon, url });
  }
  return socials;
}

export function getPageBySlug(slug: string): Page | undefined {
  return db.prepare("SELECT * FROM pages WHERE slug = ? AND is_published = 1").get(slug) as Page | undefined;
}

/* ------------------------------------------------------------------ */
/* Messages & stats                                                    */
/* ------------------------------------------------------------------ */

export function getMessages(limit?: number): ContactMessage[] {
  let sql = "SELECT * FROM messages ORDER BY created_at DESC, id DESC";
  if (limit) sql += " LIMIT " + limit;
  return db.prepare(sql).all() as ContactMessage[];
}

export function getStats() {
  const count = (table: string) =>
    (db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get() as { c: number }).c;
  return {
    projects: count("projects"),
    services: count("services"),
    skills: count("skills"),
    experiences: count("experiences"),
    messages: count("messages"),
    unreadMessages: (db.prepare("SELECT COUNT(*) AS c FROM messages WHERE is_read = 0").get() as { c: number }).c,
    pageViews: count("page_views"),
    uniqueVisitors: (db.prepare("SELECT COUNT(DISTINCT ip) AS c FROM page_views WHERE ip != ''").get() as { c: number }).c,
  };
}

export function getWeeklyViews(): { labels: string[]; counts: number[] } {
  const rows = db
    .prepare(
      `SELECT date(created_at) AS day, COUNT(*) AS c
       FROM page_views
       WHERE created_at >= datetime('now', '-6 days')
       GROUP BY day`
    )
    .all() as { day: string; c: number }[];
  const byDay = new Map(rows.map((r) => [r.day, r.c]));
  const labels: string[] = [];
  const counts: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    labels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
    counts.push(byDay.get(key) ?? 0);
  }
  return { labels, counts };
}

export function getPopularPages(limit = 5): { path: string; c: number }[] {
  return db
    .prepare(
      `SELECT path, COUNT(*) AS c FROM page_views GROUP BY path ORDER BY c DESC LIMIT ?`
    )
    .all(limit) as { path: string; c: number }[];
}
