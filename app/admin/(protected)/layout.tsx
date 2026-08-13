import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto flex w-[min(1200px,100%-2rem)] flex-col gap-6 px-0 py-28 lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 space-y-6">{children}</main>
    </div>
  );
}
