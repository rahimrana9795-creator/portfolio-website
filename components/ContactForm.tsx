"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions";

const initialState: ContactState = { ok: false };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  return (
    <form action={formAction} className="rounded-[20px] border border-white/15 bg-surface p-9">
      {state.ok ? (
        <div className="text-center py-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-good/15 text-2xl text-good">
            <i className="fa-solid fa-check" />
          </div>
          <h3 className="mb-2 text-xl font-bold">Message sent!</h3>
          <p className="text-muted">
            Thanks for reaching out{state.emailSent ? " — I&apos;ll reply by email soon" : " — I&apos;ll get back to you soon"}.
          </p>
          <a href="/" className="btn btn-ghost btn-sm mt-6">
            Back to home
          </a>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="mb-1">
              <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                Your Name
              </label>
              <input id="name" name="name" required placeholder="John Doe" className="field" />
            </div>
            <div className="mb-1">
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                Your Email
              </label>
              <input id="email" name="email" type="email" required placeholder="john@example.com" className="field" />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="subject" className="mb-2 block text-sm font-semibold">
              Subject
            </label>
            <input id="subject" name="subject" placeholder="Project inquiry" className="field" />
          </div>
          <div className="mb-5">
            <label htmlFor="message" className="mb-2 block text-sm font-semibold">
              Message
            </label>
            <textarea id="message" name="message" required rows={6} placeholder="Tell me about your project…" className="field" />
          </div>

          {state.error && (
            <div className="mb-5 rounded-xl border border-bad/40 bg-bad/10 px-4 py-3 text-sm font-semibold text-bad">
              {state.error}
            </div>
          )}

          <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
            <i className="fa-solid fa-paper-plane" />
            {pending ? "Sending…" : "Send Message"}
          </button>
        </>
      )}
    </form>
  );
}
