import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { getPageBySlug } from "@/lib/site";

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPageBySlug(slug.toLowerCase());

  if (!page) {
    notFound();
  }

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(560px 300px at 20% 10%, rgba(99,102,241,0.16), transparent 60%)" }}
        />
        <div className="relative mx-auto w-[min(1140px,100%-3rem)]">
          <span className="eyebrow">
            <i className="fa-solid fa-file-lines" /> Page
          </span>
          <h1 className="mt-4 font-head text-[clamp(2.2rem,5vw,3.2rem)] font-bold">{page.title}</h1>
          {page.intro && <p className="mt-3 max-w-[640px] text-[1.08rem] text-muted">{page.intro}</p>}
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto w-[min(1000px,100%-3rem)]">
          <Reveal className="card-surface p-9 md:p-12">
            <div className="page-body text-[1rem] leading-relaxed text-muted">{page.body}</div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
