import Link from "next/link";
import { SkillForm, DeleteButton } from "@/components/admin/forms";
import { deleteSkill } from "@/app/admin/actions";
import { getSkills } from "@/lib/site";

export default async function AdminSkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const skills = getSkills();
  const editing = edit ? skills.find((s) => s.id === Number(edit)) : undefined;

  return (
    <>
      <div>
        <h1 className="font-head text-2xl font-bold">Skills</h1>
        <p className="text-sm text-muted">Shown with level bars on the resume page.</p>
      </div>

      <SkillForm skill={editing} />

      <div className="card-surface overflow-x-auto p-4">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Level</th>
              <th className="px-3 py-3">Order</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="table-row-hover">
            {skills.map((s) => (
              <tr key={s.id} className="border-b border-white/5">
                <td className="px-3 py-3 font-semibold">{s.name}</td>
                <td className="px-3 py-3 text-muted">{s.level}</td>
                <td className="px-3 py-3 text-muted">{s.sort_order}</td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/skills?edit=${s.id}`} className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-2 text-sm font-semibold text-accent hover:bg-accent/20">
                      <i className="fa-solid fa-pen" /> Edit
                    </Link>
                    <DeleteButton action={deleteSkill} id={s.id} />
                  </div>
                </td>
              </tr>
            ))}
            {skills.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-muted">No skills yet — add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
