import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

/* ------------------------------------------------------------------ */
/* Connection                                                          */
/* ------------------------------------------------------------------ */

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, "site.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

/* ------------------------------------------------------------------ */
/* Schema                                                              */
/* ------------------------------------------------------------------ */

db.exec(`
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS services (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT 'fas fa-code',
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  level      TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS experiences (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  role        TEXT NOT NULL,
  company     TEXT NOT NULL DEFAULT '',
  years       TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  tech          TEXT NOT NULL DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'Planned',
  url           TEXT NOT NULL DEFAULT '',
  source_url    TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT NOT NULL DEFAULT '',
  is_featured   INTEGER NOT NULL DEFAULT 0,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pages (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  intro        TEXT NOT NULL DEFAULT '',
  body         TEXT NOT NULL DEFAULT '',
  show_in_nav  INTEGER NOT NULL DEFAULT 1,
  is_published INTEGER NOT NULL DEFAULT 1,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL,
  is_read    INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS page_views (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  path       TEXT NOT NULL,
  ip         TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

/* ------------------------------------------------------------------ */
/* Seed                                                                */
/* ------------------------------------------------------------------ */

function seedIfEmpty() {
  const { c } = db.prepare("SELECT COUNT(*) AS c FROM projects").get() as { c: number };
  if (c > 0) return;

  const setSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  const defaults: Record<string, string> = {
    site_name: "Code With Rahim",
    hero_title: "Hi, I'm Rahim.",
    hero_text:
      "I design and build modern web applications, portfolio sites, and digital experiences that help brands stand out online.",
    about_title: "About Me",
    about_text:
      "I'm a full-stack web developer with a passion for crafting beautiful interfaces and building robust backend systems. I love turning ideas into polished digital products that users enjoy.",
    services_title: "Services I Offer",
    projects_title: "Featured Projects",
    contact_title: "Let's Work Together",
    footer_text: "© 2026 Code With Rahim. All rights reserved.",
    resume_summary_title: "Summary",
    resume_summary_text:
      "Experienced web developer specializing in Django and Node.js, responsive design, and backend systems. Skilled at building polished, production-ready portfolio websites and dashboards.",
    resume_contact_title: "Contact",
    resume_contact_text: "Email: youremail@example.com\nPhone: +92 300 0000000\nLocation: Pakistan",
    resume_education_title: "Education",
    resume_education_text: "Bachelor's in Computer Science, UET, 2021 - 2025",
    profile_intro_title: "Who I Am",
    profile_intro_text:
      "I am a passionate web developer skilled in Python, Node.js, HTML, CSS, and JavaScript. I enjoy creating clean user interfaces and efficient backend services.",
    profile_work_title: "What I Do",
    profile_work_text:
      "I build portfolio websites, admin dashboards, and web apps with authentication, responsive design, and modern UX.",
    profile_skills_title: "Skills",
    contact_email: "",
  };
  for (const [key, value] of Object.entries(defaults)) setSetting.run(key, value);

  const insertService = db.prepare(
    "INSERT INTO services (title, description, icon, sort_order) VALUES (?, ?, ?, ?)"
  );
  const services: [string, string, string, number][] = [
    ["Web Development", "Modern, responsive websites built with clean HTML, CSS, and JavaScript that look great on every screen.", "fas fa-code", 1],
    ["Node.js & Backend", "Robust server-side applications with authentication, admin dashboards, databases, and REST APIs.", "fas fa-server", 2],
    ["UI / UX Design", "Intuitive, accessible interfaces with thoughtful layouts, typography, and micro-interactions.", "fas fa-pen-ruler", 3],
    ["Performance & SEO", "Fast-loading pages, semantic markup, and on-page SEO so your site ranks and converts.", "fas fa-gauge-high", 4],
  ];
  for (const s of services) insertService.run(...s);

  const insertSkill = db.prepare("INSERT INTO skills (name, level, sort_order) VALUES (?, ?, ?)");
  const skills: [string, string, number][] = [
    ["JavaScript / TypeScript", "Advanced", 1],
    ["React / Next.js", "Advanced", 2],
    ["Node.js", "Advanced", 3],
    ["Python / Django", "Advanced", 4],
    ["PostgreSQL / SQLite", "Intermediate", 5],
    ["REST APIs", "Advanced", 6],
    ["HTML / CSS", "Advanced", 7],
    ["Responsive Design", "Advanced", 8],
    ["Git & GitHub", "Advanced", 9],
    ["Linux & Deployment", "Intermediate", 10],
  ];
  for (const s of skills) insertSkill.run(...s);

  const insertExperience = db.prepare(
    "INSERT INTO experiences (role, company, years, description, sort_order) VALUES (?, ?, ?, ?, ?)"
  );
  const experiences: [string, string, string, string, number][] = [
    ["Freelance Web Developer", "Self-employed", "2024 - Present", "Building portfolio sites, business websites, and full-stack web apps for clients — from design to deployment.", 1],
    ["Full-Stack Developer", "Personal Projects", "2023 - 2024", "Designed and built complete applications with Django and Node.js, including admin dashboards, analytics, and contact systems.", 2],
  ];
  for (const e of experiences) insertExperience.run(...e);

  const insertProject = db.prepare(
    `INSERT INTO projects (title, description, tech, status, url, source_url, thumbnail_url, is_featured, sort_order)
     VALUES (?, ?, ?, ?, '', '', '', ?, ?)`
  );
  const projects: [string, string, string, string, number, number][] = [
    ["Portfolio Website", "A complete personal portfolio with a custom admin dashboard, page-view analytics, and a contact inbox — the site you are looking at now.", "Next.js, TypeScript, Tailwind CSS, SQLite", "Complete", 1, 1],
    ["E-commerce Storefront", "A product catalog with cart, checkout, and order management, backed by a real database.", "Node.js, Next.js, PostgreSQL, Tailwind CSS", "Complete", 0, 2],
    ["Task Manager Web App", "A team task board with user roles, comments, and real-time activity tracking.", "Next.js, TypeScript, SQLite", "In Progress", 0, 3],
    ["AI Content Assistant", "An idea for a Next.js-powered assistant that drafts blog content with AI, with a paid plan gating usage.", "Next.js, PostgreSQL, AI APIs", "Planned", 0, 4],
  ];
  for (const p of projects) insertProject.run(...p);
}

seedIfEmpty();
