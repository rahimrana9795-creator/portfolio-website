import Reveal from "@/components/Reveal";
import { getProjects, getSetting, type Project } from "@/lib/site";

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
          <span className="font-head text-[4.4rem] font-extrabold text-white/90">
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
        <p className="flex-1 text-[0.95rem] text-muted">{project.description}</p>
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

export default function ProjectsPage() {
  const projects = getProjects();
  const title = getSetting("projects_title", "Featured Projects");

  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(560px 300px at 20% 10%, rgba(99,102,241,0.16), transparent 60%)" }}
        />
        <div className="relative mx-auto w-[min(1140px,100%-3rem)]">
          <span className="eyebrow">
            <i className="fa-solid fa-briefcase" /> Portfolio
          </span>
          <h1 className="mt-4 font-head text-[clamp(2.2rem,5vw,3.2rem)] font-bold">{title}</h1>
          <p className="mt-3 max-w-[640px] text-[1.08rem] text-muted">
            Everything here is managed from the admin panel — descriptions, tech stacks, links, and status are updated
            without touching code.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid w-[min(1140px,100%-3rem)] gap-7 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 70}>
              <ProjectCard project={project} index={i} />
            </Reveal>
          ))}
          {projects.length === 0 && (
            <div className="card-surface p-10 text-center text-muted md:col-span-2 lg:col-span-3">
              No projects yet — add some from the admin panel.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
