import { createHash } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SALT = "::rahim-portfolio::";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "admin12345");
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password + SALT).digest("hex");
}

export async function isAuthed(): Promise<boolean> {
  const password = getAdminPassword();
  if (!password) return false;
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === hashPassword(password);
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, hashPassword(getAdminPassword()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
