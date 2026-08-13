import Link from "next/link";
import { ExperienceForm, DeleteButton } from "@/components/admin/forms";
import { deleteExperience } from "@/app/admin/actions";
import { getExperiences } from "@/lib/site";

export default async function AdminExperiencePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const experiences = getExperiences();
  const editing = edit ? experiences.find((e) => e.id === Number(edit)) : undefined;

  return (
    <>
      <div>
        <h1 className="font-head text-2xl font-bold">Experience</h1>
        <p className="text-sm text-muted">Career timeline shown on the home and resume pages.</p>
      </div>

      <ExperienceForm experience={editing} />

      <div className="card-surface overflow-x-auto p-4">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Company</th>
              <th className="px-3 py-3">Years</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="table-row-hover">
            {experiences.map((e) => (
              <tr key={e.id} className="border-b border-white/5">
                <td className="px-3 py-3 font-semibold">{e.role}</td>
                <td className="px-3 py-3 text-muted">{e.company}</td>
                <td className="px-3 py-3 text-muted">{e.years}</td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/experience?edit=${e.id}`} className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-2 text-sm font-semibold text-accent hover:bg-accent/20">
                      <i className="fa-solid fa-pen" /> Edit
                    </Link>
                    <DeleteButton action={deleteExperience} id={e.id} />
                  </div>
                </td>
              </tr>
            ))}
            {experiences.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-muted">No experience entries yet — add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
