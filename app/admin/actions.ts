"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession, getAdminPassword } from "@/lib/auth";

export type FormState = { error?: string };

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!getAdminPassword()) {
    return { error: "ADMIN_PASSWORD is not configured on this deployment." };
  }
  if (password !== getAdminPassword()) {
    return { error: "Incorrect password." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export async function saveProject(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = Number(formData.get("id") ?? 0) || null;
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const fields = [
    title,
    String(formData.get("description") ?? "").trim(),
    String(formData.get("tech") ?? "").trim(),
    String(formData.get("status") ?? "Planned").trim(),
    String(formData.get("url") ?? "").trim(),
    String(formData.get("source_url") ?? "").trim(),
    String(formData.get("thumbnail_url") ?? "").trim(),
    formData.get("is_featured") ? 1 : 0,
    Number(formData.get("sort_order") ?? 0) || 0,
  ] as const;

  if (id) {
    db.prepare(
      `UPDATE projects SET title=?, description=?, tech=?, status=?, url=?, source_url=?, thumbnail_url=?, is_featured=?, sort_order=? WHERE id=?`
    ).run(...fields, id);
  } else {
    db.prepare(
      `INSERT INTO projects (title, description, tech, status, url, source_url, thumbnail_url, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(...fields);
  }
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData): Promise<void> {
  const id = Number(formData.get("id") ?? 0);
  if (id) db.prepare("DELETE FROM projects WHERE id = ?").run(id);
  redirect("/admin/projects");
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export async function saveService(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = Number(formData.get("id") ?? 0) || null;
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };
  const values = [
    title,
    String(formData.get("description") ?? "").trim(),
    String(formData.get("icon") ?? "fas fa-code").trim(),
    Number(formData.get("sort_order") ?? 0) || 0,
  ] as const;
  if (id) {
    db.prepare("UPDATE services SET title=?, description=?, icon=?, sort_order=? WHERE id=?").run(...values, id);
  } else {
    db.prepare("INSERT INTO services (title, description, icon, sort_order) VALUES (?, ?, ?, ?)").run(...values);
  }
  redirect("/admin/services");
}

export async function deleteService(formData: FormData): Promise<void> {
  const id = Number(formData.get("id") ?? 0);
  if (id) db.prepare("DELETE FROM services WHERE id = ?").run(id);
  redirect("/admin/services");
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export async function saveSkill(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = Number(formData.get("id") ?? 0) || null;
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };
  const values = [
    name,
    String(formData.get("level") ?? "").trim(),
    Number(formData.get("sort_order") ?? 0) || 0,
  ] as const;
  if (id) {
    db.prepare("UPDATE skills SET name=?, level=?, sort_order=? WHERE id=?").run(...values, id);
  } else {
    db.prepare("INSERT INTO skills (name, level, sort_order) VALUES (?, ?, ?)").run(...values);
  }
  redirect("/admin/skills");
}

export async function deleteSkill(formData: FormData): Promise<void> {
  const id = Number(formData.get("id") ?? 0);
  if (id) db.prepare("DELETE FROM skills WHERE id = ?").run(id);
  redirect("/admin/skills");
}

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export async function saveExperience(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = Number(formData.get("id") ?? 0) || null;
  const role = String(formData.get("role") ?? "").trim();
  if (!role) return { error: "Role is required." };
  const values = [
    role,
    String(formData.get("company") ?? "").trim(),
    String(formData.get("years") ?? "").trim(),
    String(formData.get("description") ?? "").trim(),
    Number(formData.get("sort_order") ?? 0) || 0,
  ] as const;
  if (id) {
    db.prepare("UPDATE experiences SET role=?, company=?, years=?, description=?, sort_order=? WHERE id=?").run(
      ...values,
      id
    );
  } else {
    db.prepare(
      "INSERT INTO experiences (role, company, years, description, sort_order) VALUES (?, ?, ?, ?, ?)"
    ).run(...values);
  }
  redirect("/admin/experience");
}

export async function deleteExperience(formData: FormData): Promise<void> {
  const id = Number(formData.get("id") ?? 0);
  if (id) db.prepare("DELETE FROM experiences WHERE id = ?").run(id);
  redirect("/admin/experience");
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

export async function savePage(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = Number(formData.get("id") ?? 0) || null;
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase().replace(/^\/|\/$/g, "");
  if (!title || !slug) return { error: "Title and slug are required." };

  const values = [
    title,
    slug,
    String(formData.get("intro") ?? "").trim(),
    String(formData.get("body") ?? "").trim(),
    formData.get("show_in_nav") ? 1 : 0,
    formData.get("is_published") ? 1 : 0,
    Number(formData.get("sort_order") ?? 0) || 0,
  ] as const;

  if (id) {
    db.prepare(
      "UPDATE pages SET title=?, slug=?, intro=?, body=?, show_in_nav=?, is_published=?, sort_order=? WHERE id=?"
    ).run(...values, id);
  } else {
    db.prepare(
      "INSERT INTO pages (title, slug, intro, body, show_in_nav, is_published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(...values);
  }
  redirect("/admin/pages");
}

export async function deletePage(formData: FormData): Promise<void> {
  const id = Number(formData.get("id") ?? 0);
  if (id) db.prepare("DELETE FROM pages WHERE id = ?").run(id);
  redirect("/admin/pages");
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

const SETTING_KEYS = [
  "site_name",
  "hero_title",
  "hero_text",
  "about_title",
  "about_text",
  "services_title",
  "projects_title",
  "contact_title",
  "contact_email",
  "footer_text",
  "resume_summary_title",
  "resume_summary_text",
  "resume_contact_title",
  "resume_contact_text",
  "resume_education_title",
  "resume_education_text",
  "profile_intro_title",
  "profile_intro_text",
  "profile_work_title",
  "profile_work_text",
  "profile_skills_title",
];

export async function saveSettings(formData: FormData): Promise<void> {
  const upsert = db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  );
  for (const key of SETTING_KEYS) {
    upsert.run(key, String(formData.get(key) ?? ""));
  }
  redirect("/admin/settings");
}

/* ------------------------------------------------------------------ */
/* Messages                                                            */
/* ------------------------------------------------------------------ */

export async function toggleMessageRead(formData: FormData): Promise<void> {
  const id = Number(formData.get("id") ?? 0);
  if (id) db.prepare("UPDATE messages SET is_read = 1 - is_read WHERE id = ?").run(id);
  redirect("/admin/messages");
}

export async function markAllRead(): Promise<void> {
  db.prepare("UPDATE messages SET is_read = 1 WHERE is_read = 0").run();
  redirect("/admin/messages");
}

export async function deleteMessage(formData: FormData): Promise<void> {
  const id = Number(formData.get("id") ?? 0);
  if (id) db.prepare("DELETE FROM messages WHERE id = ?").run(id);
  redirect("/admin/messages");
}
