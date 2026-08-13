"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { sendContactEmail } from "@/lib/email";

export type ContactState = { ok: boolean; error?: string; emailSent?: boolean };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Name, email and message are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  db.prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)").run(
    name,
    email,
    subject,
    message
  );

  const emailSent = await sendContactEmail({ name, email, subject, message });
  return { ok: true, emailSent };
}

export async function trackPageView(path: string): Promise<void> {
  try {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    db.prepare("INSERT INTO page_views (path, ip) VALUES (?, ?)").run(path.slice(0, 500), ip.slice(0, 64));
  } catch {
    // Analytics must never break the page load.
  }
}
