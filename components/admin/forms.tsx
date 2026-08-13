"use client";

import { useActionState } from "react";
import {
  login,
  saveProject,
  saveService,
  saveSkill,
  saveExperience,
  savePage,
  saveSettings,
  deleteProject,
  deleteService,
  deleteSkill,
  deleteExperience,
  deletePage,
  type FormState,
} from "@/app/admin/actions";

/* ---------- Shared bits ---------- */

const inputCls = "field";
const labelCls = "mb-1.5 block text-sm font-semibold";

function FieldError({ state }: { state: FormState }) {
  if (!state.error) return null;
  return (
    <div className="mb-4 rounded-xl border border-bad/40 bg-bad/10 px-4 py-2.5 text-sm font-semibold text-bad">
      {state.error}
    </div>
  );
}

function PlainSubmit({ children }: { children: React.ReactNode }) {
  return (
    <button type="submit" className="btn btn-primary">
      {children}
    </button>
  );
}

/* ---------- Login ---------- */

export function LoginForm() {
  const [state, formAction] = useActionState(login, {});
  return (
    <form action={formAction} className="w-full max-w-sm rounded-3xl border border-white/15 bg-surface p-9 shadow-2xl">
      <div className="mb-6 text-center">
        <img
          src="/images/code-with-rahim-logo.png"
          alt=""
          className="mx-auto mb-4 h-16 w-16 rounded-full object-cover ring-2 ring-accent/40"
        />
        <h1 className="font-head text-2xl font-bold">Admin Login</h1>
        <p className="mt-1 text-sm text-muted">Enter the admin password to continue.</p>
      </div>
      <FieldError state={state} />
      <label htmlFor="password" className={labelCls}>
        Password
      </label>
      <input id="password" name="password" type="password" required autoFocus className={inputCls} />
      <button type="submit" className="btn btn-primary mt-6 w-full">
        <i className="fa-solid fa-lock" /> Sign In
      </button>
    </form>
  );
}

/* ---------- Projects ---------- */

export function ProjectForm({ project }: { project?: { id: number; title: string; description: string; tech: string; status: string; url: string; source_url: string; thumbnail_url: string; is_featured: number; sort_order: number } }) {
  const [state, formAction] = useActionState(saveProject, {});
  return (
    <form action={formAction} className="card-surface space-y-4 p-7">
      <h2 className="font-head text-lg font-bold">{project ? "Edit Project" : "Add Project"}</h2>
      <FieldError state={state} />
      {project && <input type="hidden" name="id" value={project.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Title *</label>
          <input name="title" required defaultValue={project?.title} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select name="status" defaultValue={project?.status ?? "Complete"} className={inputCls}>
            <option>Complete</option>
            <option>In Progress</option>
            <option>Planned</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea name="description" rows={3} defaultValue={project?.description} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Tech stack (comma separated)</label>
        <input name="tech" defaultValue={project?.tech} placeholder="Next.js, TypeScript, Tailwind CSS" className={inputCls} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls}>Live URL</label>
          <input name="url" defaultValue={project?.url} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Source URL</label>
          <input name="source_url" defaultValue={project?.source_url} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Thumbnail URL</label>
          <input name="thumbnail_url" defaultValue={project?.thumbnail_url} className={inputCls} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
          <input type="checkbox" name="is_featured" defaultChecked={Boolean(project?.is_featured)} className="h-4 w-4 accent-cyan-400" />
          Featured on home page
        </label>
        <div className="flex-1" />
        <div className="w-32">
          <label className={labelCls}>Order</label>
          <input name="sort_order" type="number" defaultValue={project?.sort_order ?? 0} className={inputCls} />
        </div>
      </div>
      <PlainSubmit>
        <i className="fa-solid fa-floppy-disk" /> {project ? "Save Changes" : "Add Project"}
      </PlainSubmit>
    </form>
  );
}

/* ---------- Services ---------- */

export function ServiceForm({ service }: { service?: { id: number; title: string; description: string; icon: string; sort_order: number } }) {
  const [state, formAction] = useActionState(saveService, {});
  return (
    <form action={formAction} className="card-surface space-y-4 p-7">
      <h2 className="font-head text-lg font-bold">{service ? "Edit Service" : "Add Service"}</h2>
      <FieldError state={state} />
      {service && <input type="hidden" name="id" value={service.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Title *</label>
          <input name="title" required defaultValue={service?.title} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Icon (Font Awesome)</label>
          <input name="icon" defaultValue={service?.icon ?? "fas fa-code"} placeholder="fas fa-code" className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea name="description" rows={2} defaultValue={service?.description} className={inputCls} />
      </div>
      <div className="flex items-end gap-4">
        <div className="w-32">
          <label className={labelCls}>Order</label>
          <input name="sort_order" type="number" defaultValue={service?.sort_order ?? 0} className={inputCls} />
        </div>
        <PlainSubmit>
          <i className="fa-solid fa-floppy-disk" /> {service ? "Save" : "Add Service"}
        </PlainSubmit>
      </div>
    </form>
  );
}

/* ---------- Skills ---------- */

export function SkillForm({ skill }: { skill?: { id: number; name: string; level: string; sort_order: number } }) {
  const [state, formAction] = useActionState(saveSkill, {});
  return (
    <form action={formAction} className="card-surface space-y-4 p-7">
      <h2 className="font-head text-lg font-bold">{skill ? "Edit Skill" : "Add Skill"}</h2>
      <FieldError state={state} />
      {skill && <input type="hidden" name="id" value={skill.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Name *</label>
          <input name="name" required defaultValue={skill?.name} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Level</label>
          <select name="level" defaultValue={skill?.level || "Advanced"} className={inputCls}>
            <option>Advanced</option>
            <option>Intermediate</option>
            <option>Beginner</option>
          </select>
        </div>
      </div>
      <div className="flex items-end gap-4">
        <div className="w-32">
          <label className={labelCls}>Order</label>
          <input name="sort_order" type="number" defaultValue={skill?.sort_order ?? 0} className={inputCls} />
        </div>
        <PlainSubmit>
          <i className="fa-solid fa-floppy-disk" /> {skill ? "Save" : "Add Skill"}
        </PlainSubmit>
      </div>
    </form>
  );
}

/* ---------- Experience ---------- */

export function ExperienceForm({ experience }: { experience?: { id: number; role: string; company: string; years: string; description: string; sort_order: number } }) {
  const [state, formAction] = useActionState(saveExperience, {});
  return (
    <form action={formAction} className="card-surface space-y-4 p-7">
      <h2 className="font-head text-lg font-bold">{experience ? "Edit Experience" : "Add Experience"}</h2>
      <FieldError state={state} />
      {experience && <input type="hidden" name="id" value={experience.id} />}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls}>Role *</label>
          <input name="role" required defaultValue={experience?.role} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Company</label>
          <input name="company" defaultValue={experience?.company} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Years</label>
          <input name="years" defaultValue={experience?.years} placeholder="2024 - Present" className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea name="description" rows={2} defaultValue={experience?.description} className={inputCls} />
      </div>
      <div className="flex items-end gap-4">
        <div className="w-32">
          <label className={labelCls}>Order</label>
          <input name="sort_order" type="number" defaultValue={experience?.sort_order ?? 0} className={inputCls} />
        </div>
        <PlainSubmit>
          <i className="fa-solid fa-floppy-disk" /> {experience ? "Save" : "Add Experience"}
        </PlainSubmit>
      </div>
    </form>
  );
}

/* ---------- Pages ---------- */

export function PageForm({ page }: { page?: { id: number; title: string; slug: string; intro: string; body: string; show_in_nav: number; is_published: number; sort_order: number } }) {
  const [state, formAction] = useActionState(savePage, {});
  return (
    <form action={formAction} className="card-surface space-y-4 p-7">
      <h2 className="font-head text-lg font-bold">{page ? "Edit Page" : "Add Page"}</h2>
      <FieldError state={state} />
      {page && <input type="hidden" name="id" value={page.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Title *</label>
          <input name="title" required defaultValue={page?.title} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Slug (URL path) *</label>
          <input name="slug" required defaultValue={page?.slug} placeholder="services" className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Intro</label>
        <input name="intro" defaultValue={page?.intro} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Body</label>
        <textarea name="body" rows={8} defaultValue={page?.body} className={inputCls} />
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
          <input type="checkbox" name="show_in_nav" defaultChecked={Boolean(page?.show_in_nav)} className="h-4 w-4 accent-cyan-400" />
          Show in navigation
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
          <input type="checkbox" name="is_published" defaultChecked={Boolean(page?.is_published)} className="h-4 w-4 accent-cyan-400" />
          Published
        </label>
        <div className="w-32">
          <label className={labelCls}>Order</label>
          <input name="sort_order" type="number" defaultValue={page?.sort_order ?? 0} className={inputCls} />
        </div>
      </div>
      <PlainSubmit>
        <i className="fa-solid fa-floppy-disk" /> {page ? "Save Changes" : "Add Page"}
      </PlainSubmit>
    </form>
  );
}

/* ---------- Settings ---------- */

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const value = (key: string) => settings[key] ?? "";

  return (
    <form action={saveSettings} className="space-y-6">
      <div className="card-surface space-y-4 p-7">
        <h2 className="font-head text-lg font-bold">
          <i className="fa-solid fa-palette mr-2 text-accent" /> Branding
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Site name</label>
            <input name="site_name" defaultValue={value("site_name")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Contact email</label>
            <input name="contact_email" defaultValue={value("contact_email")} placeholder="you@example.com" className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Hero title</label>
          <input name="hero_title" defaultValue={value("hero_title")} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Hero text</label>
          <textarea name="hero_text" rows={2} defaultValue={value("hero_text")} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Footer text</label>
          <input name="footer_text" defaultValue={value("footer_text")} className={inputCls} />
        </div>
      </div>

      <div className="card-surface space-y-4 p-7">
        <h2 className="font-head text-lg font-bold">
          <i className="fa-solid fa-house mr-2 text-accent" /> Home page
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Services title</label>
            <input name="services_title" defaultValue={value("services_title")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Projects title</label>
            <input name="projects_title" defaultValue={value("projects_title")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Contact title</label>
            <input name="contact_title" defaultValue={value("contact_title")} className={inputCls} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>About title</label>
            <input name="about_title" defaultValue={value("about_title")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>About text</label>
            <textarea name="about_text" rows={2} defaultValue={value("about_text")} className={inputCls} />
          </div>
        </div>
      </div>

      <div className="card-surface space-y-4 p-7">
        <h2 className="font-head text-lg font-bold">
          <i className="fa-solid fa-file-lines mr-2 text-accent" /> Resume
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Summary title</label>
            <input name="resume_summary_title" defaultValue={value("resume_summary_title")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Summary text</label>
            <textarea name="resume_summary_text" rows={2} defaultValue={value("resume_summary_text")} className={inputCls} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Contact title</label>
            <input name="resume_contact_title" defaultValue={value("resume_contact_title")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Contact text (use newlines)</label>
            <textarea name="resume_contact_text" rows={3} defaultValue={value("resume_contact_text")} className={inputCls} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Education title</label>
            <input name="resume_education_title" defaultValue={value("resume_education_title")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Education text</label>
            <input name="resume_education_text" defaultValue={value("resume_education_text")} className={inputCls} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          <i className="fa-solid fa-floppy-disk" /> Save Settings
        </button>
      </div>
    </form>
  );
}

/* ---------- Delete button ---------- */

export function DeleteButton({ action, id, label = "Delete" }: { action: (fd: FormData) => Promise<void>; id: number; label?: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this item?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="inline-flex items-center gap-2 rounded-xl border border-bad/40 bg-bad/10 px-3.5 py-2 text-sm font-semibold text-bad transition-colors hover:bg-bad/20">
        <i className="fa-solid fa-trash" /> {label}
      </button>
    </form>
  );
}
