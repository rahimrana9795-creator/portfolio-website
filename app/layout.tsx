import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ViewTracker from "@/components/ViewTracker";
import { getNavPages, getServices, getSetting, getSocials } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Code With Rahim — Web Developer",
  description:
    "Portfolio of Rahim — building modern web applications with React, Next.js, and Node.js.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteName = getSetting("site_name", "Code With Rahim");
  const footerText = getSetting("footer_text", "© 2026 Code With Rahim. All rights reserved.");
  const navPages = getNavPages().map((p) => ({ slug: p.slug, title: p.title }));
  const socials = getSocials();
  const services = getServices();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/code-with-rahim-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-bg font-body text-ink">
        <Navbar siteName={siteName} navPages={navPages} />
        <main className="flex-1">{children}</main>
        <Footer siteName={siteName} footerText={footerText} socials={socials} services={services} />
        <ViewTracker />
      </body>
    </html>
  );
}
