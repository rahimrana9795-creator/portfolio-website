import Link from "next/link";
import { PageForm, DeleteButton } from "@/components/admin/forms";
import { deletePage } from "@/app/admin/actions";
import { db } from "@/lib/db";

type AdminPage = {
  id: number;
  title: string;
  slug: string;
  intro: string;
  body: string;
  show_in_nav: number;
  is_published: number;
  sort_order: number;
};

export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const pages = db.prepare("SELECT * FROM pages ORDER BY sort_order, title").all() as AdminPage[];
  const editing = edit ? pages.find((p) => p.id === Number(edit)) : undefined;

  return (
    <>
      <div>
        <h1 className="font-head text-2xl font-bold">Pages</h1>
        <p className="text-sm text-muted">Dynamic pages — each becomes a URL like /your-slug/.</p>
      </div>

      <PageForm page={editing} />

      <div className="card-surface overflow-x-auto p-4">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3">URL</th>
              <th className="px-3 py-3">Nav</th>
              <th className="px-3 py-3">Live</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="table-row-hover">
            {pages.map((p) => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="px-3 py-3 font-semibold">{p.title}</td>
                <td className="px-3 py-3">
                  <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    /{p.slug}/
                  </a>
                </td>
                <td className="px-3 py-3 text-muted">{p.show_in_nav ? "✓" : "—"}</td>
                <td className="px-3 py-3 text-muted">{p.is_published ? "✓" : "—"}</td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/pages?edit=${p.id}`} className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-2 text-sm font-semibold text-accent hover:bg-accent/20">
                      <i className="fa-solid fa-pen" /> Edit
                    </Link>
                    <DeleteButton action={deletePage} id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-muted">
                  No pages yet — add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
