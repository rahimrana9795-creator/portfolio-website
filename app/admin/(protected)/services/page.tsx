import Link from "next/link";
import { ServiceForm, DeleteButton } from "@/components/admin/forms";
import { deleteService } from "@/app/admin/actions";
import { getServices } from "@/lib/site";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const services = getServices();
  const editing = edit ? services.find((s) => s.id === Number(edit)) : undefined;

  return (
    <>
      <div>
        <h1 className="font-head text-2xl font-bold">Services</h1>
        <p className="text-sm text-muted">The service cards shown on the home page.</p>
      </div>

      <ServiceForm service={editing} />

      <div className="card-surface overflow-x-auto p-4">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3">Icon</th>
              <th className="px-3 py-3">Order</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="table-row-hover">
            {services.map((s) => (
              <tr key={s.id} className="border-b border-white/5">
                <td className="px-3 py-3 font-semibold">{s.title}</td>
                <td className="px-3 py-3 text-muted">
                  <i className={`${s.icon || "fa-solid fa-code"} mr-2 text-accent`} />
                  {s.icon || "fa-solid fa-code"}
                </td>
                <td className="px-3 py-3 text-muted">{s.sort_order}</td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/services?edit=${s.id}`} className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-2 text-sm font-semibold text-accent hover:bg-accent/20">
                      <i className="fa-solid fa-pen" /> Edit
                    </Link>
                    <DeleteButton action={deleteService} id={s.id} />
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-muted">No services yet — add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
