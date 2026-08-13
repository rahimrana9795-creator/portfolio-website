"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavPage = { slug: string; title: string };

export default function Navbar({ siteName, navPages }: { siteName: string; navPages: NavPage[] }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkCls =
    "rounded-full px-4 py-2 text-[0.95rem] font-medium text-muted transition-colors hover:text-ink hover:bg-white/5";

  const links = [
    { href: "/", label: "Home", hash: false },
    { href: "/#services", label: "Services", hash: true },
    { href: "/projects", label: "Projects", hash: false },
    { href: "/#about", label: "About", hash: true },
    { href: "/resume", label: "Resume", hash: false },
    ...navPages.map((p) => ({ href: `/${p.slug}`, label: p.title, hash: false })),
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-colors ${
        scrolled ? "border-white/10 bg-bg/90" : "border-transparent bg-bg/70"
      }`}
    >
      <nav className="mx-auto flex h-[78px] w-[min(1140px,100%-3rem)] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 font-head text-lg font-bold tracking-tight">
          <img
            src="/images/code-with-rahim-logo.png"
            alt=""
            className="h-10 w-10 rounded-full object-cover ring-2 ring-accent/40"
          />
          <span className="hidden sm:inline">{siteName}</span>
          <span className="sm:hidden">{siteName.length > 12 ? siteName.slice(0, 12) + "…" : siteName}</span>
        </Link>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold md:hidden"
        >
          <i className="fa-solid fa-bars text-accent" />
          Menu
        </button>

        <ul
          className={`${
            open ? "flex" : "hidden"
          } absolute left-6 right-6 top-[88px] flex-col gap-1 rounded-2xl border border-white/20 bg-[#0a1120]/98 p-3.5 shadow-2xl md:static md:top-auto md:left-auto md:right-auto md:flex md:w-auto md:flex-row md:items-center md:gap-1.5 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {links.map((link) => {
            const active = !link.hash && pathname === link.href;
            return (
              <li key={link.href}>
                {link.hash ? (
                  <a href={link.href} className={`${linkCls} ${active ? "text-ink bg-white/5" : ""}`}>
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className={`${linkCls} ${active ? "bg-white/5 text-ink" : ""}`}>
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
          <li className="mt-1.5 md:ml-3.5 md:mt-0">
            <a href="/#contact">
              <span className="btn btn-primary !px-6 !py-2.5 text-sm">Hire Me</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
