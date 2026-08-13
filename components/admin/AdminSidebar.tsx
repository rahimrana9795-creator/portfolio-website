"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";

const items = [
  { href: "/admin", label: "Dashboard", icon: "fa-th-large" },
  { href: "/admin/projects", label: "Projects", icon: "fa-briefcase" },
  { href: "/admin/services", label: "Services", icon: "fa-cogs" },
  { href: "/admin/skills", label: "Skills", icon: "fa-star" },
  { href: "/admin/experience", label: "Experience", icon: "fa-history" },
  { href: "/admin/pages", label: "Pages", icon: "fa-file-alt" },
  { href: "/admin/messages", label: "Messages", icon: "fa-envelope" },
  { href: "/admin/settings", label: "Settings", icon: "fa-gear" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const linkCls = (href: string) =>
    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-[0.94rem] font-medium transition-colors ${
      pathname === href ? "bg-accent/15 text-accent" : "text-muted hover:bg-white/5 hover:text-ink"
    }`;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-[94px] hidden h-[calc(100vh-110px)] w-60 flex-shrink-0 flex-col justify-between rounded-2xl border border-white/10 bg-surface p-4 lg:flex">
        <nav>
          <p className="mb-3 px-4 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted">Admin</p>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkCls(item.href)}>
                  <i className={`fa-solid ${item.icon} w-5 text-center`} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-1 border-t border-white/10 pt-3">
          <Link href="/" className={linkCls("/")}>
            <i className="fa-solid fa-globe w-5 text-center" /> View Site
          </Link>
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[0.94rem] font-medium text-bad transition-colors hover:bg-bad/10">
              <i className="fa-solid fa-sign-out-alt w-5 text-center" /> Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden">
        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-surface p-2.5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium ${
                pathname === item.href ? "bg-accent/15 text-accent" : "text-muted"
              }`}
            >
              <i className={`fa-solid ${item.icon} mr-2`} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
