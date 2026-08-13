import Link from "next/link";
import { ProjectForm, DeleteButton } from "@/components/admin/forms";
import { deleteProject } from "@/app/admin/actions";
import { getProjects } from "@/lib/site";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const projects = getProjects();
  const editing = edit ? projects.find((p) => p.id === Number(edit)) : undefined;

  return (
    <>
      <div>
        <h1 className="font-head text-2xl font-bold">Projects</h1>
        <p className="text-sm text-muted">Manage the projects shown on your portfolio.</p>
      </div>

      <ProjectForm project={editing} />

      <div className="card-surface overflow-x-auto p-4">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Featured</th>
              <th className="px-3 py-3">Order</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="table-row-hover">
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="px-3 py-3 font-semibold">{p.title}</td>
                <td className="px-3 py-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${p.status === "Complete" ? "status-complete" : p.status === "In Progress" ? "status-progress" : "status-planned"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-muted">{p.is_featured ? "✓" : "—"}</td>
                <td className="px-3 py-3 text-muted">{p.sort_order}</td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/projects?edit=${p.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-2 text-sm font-semibold text-accent hover:bg-accent/20"
                    >
                      <i className="fa-solid fa-pen" /> Edit
                    </Link>
                    <DeleteButton action={deleteProject} id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-muted">
                  No projects yet — add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
