import Link from "next/link";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import {
  getExperiences,
  getProjects,
  getServices,
  getSetting,
  getSocials,
  type Project,
} from "@/lib/site";

const statusClass = (status: string) => {
  const key = status.toLowerCase().replace(/\s+/g, "");
  if (key === "complete") return "status-complete";
  if (key === "inprogress") return "status-progress";
  return "status-planned";
};

const coverClass = (index: number) => `cover-${["a", "b", "c", "d"][index % 4]}`;

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const tags = project.tech
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return (
    <article className="card-surface group flex flex-col overflow-hidden">
      <div className={`relative flex h-[190px] items-center justify-center overflow-hidden ${coverClass(index)}`}>
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="font-head text-[4.4rem] font-extrabold text-white/90 drop-shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            {project.title.charAt(0).toUpperCase()}
          </span>
        )}
        <span
          className={`absolute right-3.5 top-3.5 rounded-full px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-wide backdrop-blur-sm ${statusClass(
            project.status
          )}`}
        >
          {project.status}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="mb-2.5 font-head text-[1.22rem] font-bold">{project.title}</h3>
        <p className="flex-1 text-[0.95rem] text-muted">
          {project.description.length > 140 ? project.description.slice(0, 140) + "…" : project.description}
        </p>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[0.76rem] font-semibold text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {(project.url || project.source_url) && (
          <div className="mt-5 flex flex-wrap gap-2.5">
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                Live Demo <i className="fa-solid fa-arrow-up-right-from-square" />
              </a>
            )}
            {project.source_url && (
              <a href={project.source_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                <i className="fa-brands fa-github" /> Source
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function HomePage() {
  const site = {
    name: getSetting("site_name", "Code With Rahim"),
    heroTitle: getSetting("hero_title", "Hi, I'm Rahim."),
    heroText: getSetting("hero_text", "I design and build modern web applications."),
    aboutTitle: getSetting("about_title", "About Me"),
    aboutText: getSetting("about_text", "I'm a full-stack web developer."),
    servicesTitle: getSetting("services_title", "Services I Offer"),
    projectsTitle: getSetting("projects_title", "Featured Projects"),
    contactTitle: getSetting("contact_title", "Let's Work Together"),
    contactEmail: getSetting("contact_email", ""),
  };

  const projects = getProjects(6, true).length > 0 ? getProjects(6, true) : getProjects(6);
  const services = getServices();
  const experiences = getExperiences();
  const socials = getSocials();

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden pb-22 pt-40 md:pt-44">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px 340px at 78% 18%, rgba(99,102,241,0.22), transparent 65%), radial-gradient(520px 320px at 12% 78%, rgba(34,211,238,0.14), transparent 60%)",
          }}
        />
        <div className="relative mx-auto grid w-[min(1140px,100%-3rem)] items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-good/25 bg-good/10 px-4 py-2 text-sm font-semibold text-good">
              <span className="relative h-2 w-2 rounded-full bg-good pulse-dot" />
              Available for freelance work
            </span>
            <h1 className="grad-text mt-6 font-head text-[clamp(2.5rem,5.6vw,4rem)] font-bold leading-[1.1]">
              {site.heroTitle}
            </h1>
            <p className="mt-5 max-w-[540px] text-[1.12rem] text-muted">{site.heroText}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/projects" className="btn btn-primary">
                View My Work <i className="fa-solid fa-arrow-right" />
              </Link>
              <Link href="/resume" className="btn btn-ghost">
                <i className="fa-solid fa-file-lines" /> View Resume
              </Link>
            </div>
            <div className="mt-11 flex flex-wrap gap-10 border-t border-white/10 pt-7">
              <div>
                <div className="font-head text-[1.9rem] font-bold">
                  <span className="text-accent">{projects.length}+</span>
                </div>
                <div className="mt-0.5 text-sm text-muted">Projects shipped</div>
              </div>
              <div>
                <div className="font-head text-[1.9rem] font-bold">
                  <span className="text-accent">{services.length}</span>
                </div>
                <div className="mt-0.5 text-sm text-muted">Services offered</div>
              </div>
              <div>
                <div className="font-head text-[1.9rem] font-bold">
                  2<span className="text-accent">+</span>
                </div>
                <div className="mt-0.5 text-sm text-muted">Years of experience</div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="animate-float w-[min(360px,100%)] rounded-[28px] bg-gradient-to-br from-cyan-400 to-indigo-500 p-2.5 shadow-[0_30px_80px_rgba(99,102,241,0.35)]">
              <img
                src="/images/rahim-profile.jpg"
                alt="Portrait of Rahim"
                className="aspect-square w-full rounded-[20px] object-cover"
              />
            </div>
            <span className="animate-float absolute left-0 top-6 hidden items-center gap-2.5 rounded-2xl border border-white/25 bg-[#0e1729]/90 px-4 py-2.5 text-sm font-semibold shadow-2xl backdrop-blur-md sm:flex" style={{ animationDelay: "0.4s" }}>
              <i className="fa-brands fa-python text-accent" /> Python
            </span>
            <span className="animate-float absolute -right-2 bottom-16 hidden items-center gap-2.5 rounded-2xl border border-white/25 bg-[#0e1729]/90 px-4 py-2.5 text-sm font-semibold shadow-2xl backdrop-blur-md sm:flex" style={{ animationDelay: "1.6s" }}>
              <i className="fa-solid fa-layer-group text-accent" /> Next.js
            </span>
            <span className="animate-float absolute bottom-0 left-10 hidden items-center gap-2.5 rounded-2xl border border-white/25 bg-[#0e1729]/90 px-4 py-2.5 text-sm font-semibold shadow-2xl backdrop-blur-md sm:flex" style={{ animationDelay: "2.6s" }}>
              <i className="fa-solid fa-database text-accent" /> SQLite
            </span>
          </div>
        </div>
      </section>

      {/* ================= TECH STRIP ================= */}
      <div className="overflow-hidden border-y border-white/10 bg-bg-alt py-5">
        <div className="mx-auto flex w-[min(1140px,100%-3rem)] flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-7">
          <span className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-muted">Tech Stack</span>
          <div className="flex flex-wrap gap-x-10 gap-y-2 text-[0.95rem] font-semibold text-muted">
            {["JavaScript / TypeScript", "React / Next.js", "Node.js", "Tailwind CSS", "REST APIs", "Git & GitHub", "Linux"].map((t) => (
              <span key={t} className="whitespace-nowrap transition-colors hover:text-accent">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SERVICES ================= */}
      <section id="services" className="py-24">
        <div className="mx-auto w-[min(1140px,100%-3rem)]">
          <Reveal className="mx-auto mb-14 max-w-[640px] text-center">
            <span className="eyebrow">
              <i className="fa-solid fa-cogs" /> What I Do
            </span>
            <h2 className="mt-4 font-head text-[clamp(1.9rem,4vw,2.6rem)] font-bold">{site.servicesTitle}</h2>
            <p className="mt-3.5 text-[1.05rem] text-muted">
              From idea to deployment — I design, build, and maintain web products end to end.
            </p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 60}>
                <article className="card-surface h-full p-8">
                  <div className="mb-5 flex h-[54px] w-[54px] items-center justify-center rounded-[15px] border border-accent/20 bg-accent/10 text-[1.35rem] text-accent transition-colors group-hover:bg-none">
                    <i className={service.icon || "fa-solid fa-code"} />
                  </div>
                  <h3 className="mb-2.5 font-head text-[1.18rem] font-bold">{service.title}</h3>
                  <p className="text-[0.95rem] text-muted">{service.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROJECTS ================= */}
      <section id="projects" className="bg-bg-alt py-24">
        <div className="mx-auto w-[min(1140px,100%-3rem)]">
          <Reveal className="mx-auto mb-14 max-w-[640px] text-center">
            <span className="eyebrow">
              <i className="fa-solid fa-briefcase" /> Portfolio
            </span>
            <h2 className="mt-4 font-head text-[clamp(1.9rem,4vw,2.6rem)] font-bold">{site.projectsTitle}</h2>
            <p className="mt-3.5 text-[1.05rem] text-muted">
              A selection of things I&apos;ve built — all managed from the admin panel.
            </p>
          </Reveal>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={(i % 3) * 70}>
                <ProjectCard project={project} index={i} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Link href="/projects" className="btn btn-ghost">
              View All Projects <i className="fa-solid fa-arrow-right" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="py-24">
        <div className="mx-auto grid w-[min(1140px,100%-3rem)] items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="relative mx-auto max-w-[420px]">
            <div className="absolute -left-4 -top-4 -z-10 h-full w-full rounded-[20px] border border-accent/35" />
            <img
              src="/images/rahim-profile.jpg"
              alt="Portrait of Rahim"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-[20px] border border-white/25 object-cover shadow-[0_24px_60px_rgba(1,4,12,0.55)]"
            />
            <div className="absolute -bottom-6 -right-4 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 px-5 py-3.5 text-center text-white shadow-2xl">
              <strong className="block font-head text-2xl leading-none">2+</strong>
              <span className="text-[0.78rem] font-semibold">Years<br />Experience</span>
            </div>
          </Reveal>

          <Reveal>
            <span className="eyebrow">
              <i className="fa-solid fa-user" /> About Me
            </span>
            <h2 className="mt-4 font-head text-[clamp(1.9rem,4vw,2.5rem)] font-bold">{site.aboutTitle}</h2>
            <p className="mt-4 text-muted">{site.aboutText}</p>
            <ul className="mt-7 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
              {[
                "Clean, maintainable code",
                "Admin dashboards & analytics",
                "Databases & data modeling",
                "Responsive, accessible design",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-[0.97rem]">
                  <i className="fa-solid fa-circle-check mt-1 text-accent" />
                  {point}
                </li>
              ))}
            </ul>
            <Link href="/resume" className="btn btn-primary mt-8">
              View My Resume <i className="fa-solid fa-arrow-right" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ================= EXPERIENCE ================= */}
      <section id="experience" className="bg-bg-alt py-24">
        <div className="mx-auto w-[min(1140px,100%-3rem)]">
          <Reveal className="mx-auto mb-14 max-w-[640px] text-center">
            <span className="eyebrow">
              <i className="fa-solid fa-briefcase" /> Career
            </span>
            <h2 className="mt-4 font-head text-[clamp(1.9rem,4vw,2.6rem)] font-bold">Experience</h2>
            <p className="mt-3.5 text-[1.05rem] text-muted">
              Where I&apos;ve been and what I&apos;ve been building along the way.
            </p>
          </Reveal>
          <div className="timeline-line mx-auto max-w-[760px] pl-2">
            {experiences.map((exp, i) => (
              <Reveal key={exp.id} delay={i * 80} className="relative pb-9 pl-14 last:pb-0">
                <span className="absolute left-0 top-1.5 h-5 w-5 rounded-full border-[3px] border-accent bg-bg shadow-[0_0_0_5px_rgba(56,189,248,0.12)]" />
                <span className="mb-2.5 inline-block rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[0.76rem] font-bold uppercase tracking-wider text-accent">
                  {exp.years}
                </span>
                <h3 className="font-head text-[1.2rem] font-bold">{exp.role}</h3>
                <p className="mb-2 text-[0.94rem] text-muted">{exp.company}</p>
                {exp.description && <p className="text-[0.96rem] text-muted">{exp.description}</p>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="py-24">
        <div className="mx-auto w-[min(1140px,100%-3rem)]">
          <Reveal className="mx-auto mb-14 max-w-[640px] text-center">
            <span className="eyebrow">
              <i className="fa-solid fa-envelope" /> Contact
            </span>
            <h2 className="mt-4 font-head text-[clamp(1.9rem,4vw,2.6rem)] font-bold">{site.contactTitle}</h2>
            <p className="mt-3.5 text-[1.05rem] text-muted">
              Have a project in mind? Send a message and I&apos;ll get back to you soon.
            </p>
          </Reveal>

          <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="card-surface mb-4 flex items-start gap-5 p-6">
                <div className="flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center rounded-[15px] border border-accent/20 bg-accent/10 text-[1.35rem] text-accent">
                  <i className="fa-solid fa-envelope" />
                </div>
                <div>
                  <h4 className="mb-1 font-head text-base font-bold">Email Me</h4>
                  {site.contactEmail ? (
                    <a href={`mailto:${site.contactEmail}`} className="break-words text-[0.93rem] text-muted hover:text-accent">
                      {site.contactEmail}
                    </a>
                  ) : (
                    <p className="text-[0.93rem] text-muted">Use the form — messages land straight in the admin inbox.</p>
                  )}
                </div>
              </div>
              <div className="card-surface mb-4 flex items-start gap-5 p-6">
                <div className="flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center rounded-[15px] border border-accent/20 bg-accent/10 text-[1.35rem] text-accent">
                  <i className="fa-solid fa-location-dot" />
                </div>
                <div>
                  <h4 className="mb-1 font-head text-base font-bold">Location</h4>
                  <p className="text-[0.93rem] text-muted">Pakistan · Remote friendly</p>
                </div>
              </div>
              {socials.length > 0 && (
                <div className="card-surface flex items-start gap-5 p-6">
                  <div className="flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center rounded-[15px] border border-accent/20 bg-accent/10 text-[1.35rem] text-accent">
                    <i className="fa-solid fa-share-nodes" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-head text-base font-bold">Follow Me</h4>
                    <p className="text-[0.93rem] text-muted">
                      {socials.map((s, i) => (
                        <span key={s.key}>
                          {i > 0 && <span className="mx-1">·</span>}
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                            {s.label}
                          </a>
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              )}
            </Reveal>

            <Reveal>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
