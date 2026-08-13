import Reveal from "@/components/Reveal";
import { getExperiences, getSetting, getSkills } from "@/lib/site";

const levelWidth = (level: string) => {
  const key = level.toLowerCase();
  if (key === "advanced") return "92%";
  if (key === "intermediate") return "70%";
  if (key === "beginner") return "45%";
  return "75%";
};

export default function ResumePage() {
  const site = {
    title: getSetting("resume_page_title", "Resume"),
    summaryTitle: getSetting("resume_summary_title", "Summary"),
    summaryText: getSetting("resume_summary_text", "Experienced web developer building modern web applications."),
    contactTitle: getSetting("resume_contact_title", "Contact"),
    contactText: getSetting("resume_contact_text", "Email: youremail@example.com\nPhone: +92 300 0000000\nLocation: Pakistan"),
    educationTitle: getSetting("resume_education_title", "Education"),
    educationText: getSetting("resume_education_text", "Bachelor's in Computer Science, UET, 2021 - 2025"),
  };
  const experiences = getExperiences();
  const skills = getSkills();

  return (
    <>
      <section className="relative overflow-hidden pb-10 pt-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(560px 300px at 20% 10%, rgba(99,102,241,0.16), transparent 60%)" }}
        />
        <div className="relative mx-auto w-[min(1140px,100%-3rem)]">
          <span className="eyebrow">
            <i className="fa-solid fa-file-lines" /> Resume
          </span>
          <h1 className="mt-4 font-head text-[clamp(2.2rem,5vw,3.2rem)] font-bold">{site.title}</h1>
          <p className="mt-3 max-w-[640px] text-[1.08rem] text-muted">{site.summaryText}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a href="/#contact" className="btn btn-primary">
              Hire Me <i className="fa-solid fa-arrow-right" />
            </a>
            <a href="/" className="btn btn-ghost">
              <i className="fa-solid fa-arrow-left" /> Back Home
            </a>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid w-[min(1140px,100%-3rem)] items-start gap-7 lg:grid-cols-[1fr_1.25fr]">
          <div className="space-y-6">
            <Reveal className="card-surface p-8">
              <h2 className="mb-4 flex items-center gap-3 font-head text-[1.3rem] font-bold">
                <i className="fa-solid fa-user text-accent" /> {site.summaryTitle}
              </h2>
              <p className="whitespace-pre-line text-[0.96rem] text-muted">{site.summaryText}</p>
            </Reveal>

            <Reveal className="card-surface p-8">
              <h2 className="mb-4 flex items-center gap-3 font-head text-[1.3rem] font-bold">
                <i className="fa-solid fa-address-card text-accent" /> {site.contactTitle}
              </h2>
              <p className="whitespace-pre-line text-[0.96rem] text-muted">{site.contactText}</p>
            </Reveal>

            <Reveal className="card-surface p-8">
              <h2 className="mb-4 flex items-center gap-3 font-head text-[1.3rem] font-bold">
                <i className="fa-solid fa-graduation-cap text-accent" /> {site.educationTitle}
              </h2>
              <p className="text-[0.96rem] text-muted">{site.educationText}</p>
            </Reveal>
          </div>

          <div className="space-y-6">
            <Reveal className="card-surface p-8">
              <h2 className="mb-6 flex items-center gap-3 font-head text-[1.3rem] font-bold">
                <i className="fa-solid fa-briefcase text-accent" /> Experience
              </h2>
              <div className="timeline-line space-y-0">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pb-7 pl-14 last:pb-0">
                    <span className="absolute left-0 top-1.5 h-5 w-5 rounded-full border-[3px] border-accent bg-bg shadow-[0_0_0_5px_rgba(56,189,248,0.12)]" />
                    <span className="mb-2 inline-block rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[0.76rem] font-bold uppercase tracking-wider text-accent">
                      {exp.years}
                    </span>
                    <h3 className="font-head text-[1.15rem] font-bold">{exp.role}</h3>
                    <p className="mb-1.5 text-[0.94rem] text-muted">{exp.company}</p>
                    {exp.description && <p className="text-[0.95rem] text-muted">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="card-surface p-8">
              <h2 className="mb-6 flex items-center gap-3 font-head text-[1.3rem] font-bold">
                <i className="fa-solid fa-code text-accent" /> Skills
              </h2>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="mb-1.5 flex justify-between text-[0.92rem] font-semibold">
                      <span>{skill.name}</span>
                      <span className="font-medium text-muted">{skill.level}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-bg">
                      <i
                        className="block h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
                        style={{ width: levelWidth(skill.level) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
