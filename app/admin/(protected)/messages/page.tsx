import { toggleMessageRead, markAllRead, deleteMessage } from "@/app/admin/actions";
import { getMessages } from "@/lib/site";

export default function AdminMessagesPage() {
  const messages = getMessages();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-head text-2xl font-bold">Messages</h1>
          <p className="text-sm text-muted">
            Contact form submissions — {messages.filter((m) => !m.is_read).length} unread.
          </p>
        </div>
        <form action={markAllRead}>
          <button type="submit" className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-check-double" /> Mark all read
          </button>
        </form>
      </div>

      <div className="card-surface overflow-x-auto p-4">
        <div className="divide-y divide-white/5">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col gap-3 px-3 py-5 sm:flex-row sm:items-start ${!m.is_read ? "bg-accent/[0.04]" : ""}`}>
              <span
                className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  m.is_read ? "bg-white/10 text-muted" : "bg-accent/25 text-accent"
                }`}
              >
                {m.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="text-sm text-accent hover:underline">
                    {m.email}
                  </a>
                  <span className="text-xs text-muted">{m.created_at.replace("T", " ").slice(0, 16)}</span>
                  {!m.is_read && (
                    <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-xs font-bold text-warn">
                      Unread
                    </span>
                  )}
                </div>
                {m.subject && <p className="mt-1 text-sm font-semibold text-ink">{m.subject}</p>}
                <p className="mt-1 whitespace-pre-line text-sm text-muted">{m.message}</p>
              </div>
              <div className="flex flex-shrink-0 gap-2 sm:flex-col">
                <form action={toggleMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    title={m.is_read ? "Mark as unread" : "Mark as read"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-2 text-sm font-semibold text-accent hover:bg-accent/20"
                  >
                    <i className={`fa-solid ${m.is_read ? "fa-envelope" : "fa-envelope-open-text"}`} />
                    {m.is_read ? "Unread" : "Read"}
                  </button>
                </form>
                <form
                  action={deleteMessage}
                  onSubmit={(e) => {
                    if (!confirm("Delete this message?")) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-bad/40 bg-bad/10 px-3.5 py-2 text-sm font-semibold text-bad hover:bg-bad/20"
                  >
                    <i className="fa-solid fa-trash" /> Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="px-3 py-12 text-center text-muted">No contact messages yet.</div>
          )}
        </div>
      </div>
    </>
  );
}
