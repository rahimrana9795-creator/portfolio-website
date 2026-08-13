import Link from "next/link";

type FooterProps = {
  siteName: string;
  footerText: string;
  socials: { key: string; label: string; icon: string; url: string }[];
  services: { title: string }[];
};

export default function Footer({ siteName, footerText, socials, services }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-bg-alt">
      <div className="mx-auto w-[min(1140px,100%-3rem)]">
        <div className="grid gap-11 pb-11 pt-14 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-3 font-head text-lg font-bold">
              <img
                src="/images/code-with-rahim-logo.png"
                alt=""
                className="h-10 w-10 rounded-full object-cover ring-2 ring-accent/40"
              />
              {siteName}
            </Link>
            <p className="mt-4 max-w-xs text-[0.95rem] text-muted">
              Building modern web applications with React, Next.js, and Node.js — from idea to deployment.
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-surface text-muted transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-r hover:from-cyan-400 hover:to-indigo-500 hover:text-white"
                  >
                    <i className={`fa-brands ${s.icon}`} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-4 text-[0.95rem] font-bold">Explore</h4>
            <ul className="space-y-2.5 text-[0.94rem] text-muted">
              <li><Link href="/#about" className="transition-colors hover:text-accent">About</Link></li>
              <li><Link href="/projects" className="transition-colors hover:text-accent">Projects</Link></li>
              <li><Link href="/resume" className="transition-colors hover:text-accent">Resume</Link></li>
              <li><Link href="/#contact" className="transition-colors hover:text-accent">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[0.95rem] font-bold">Services</h4>
            <ul className="space-y-2.5 text-[0.94rem] text-muted">
              {services.slice(0, 4).map((s) => (
                <li key={s.title}>
                  <Link href="/#services" className="transition-colors hover:text-accent">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-5 text-[0.88rem] text-muted">
          <span>{footerText}</span>
          <span>
            Built with <i className="fa-solid fa-heart text-[#f87171]" /> Next.js &amp; Node.js
          </span>
        </div>
      </div>
    </footer>
  );
}
