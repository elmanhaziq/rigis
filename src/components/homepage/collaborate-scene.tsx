import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, GraduationCap, Handshake, Landmark, Mail } from "lucide-react";
import type { PublicDataset } from "@/lib/data";
import { StatusTag } from "@/components/layout/demo-banner";
import { formatDate } from "@/lib/format";

const pathways = [
  {
    type: "collaboration",
    icon: Handshake,
    title: "Research collaboration",
    text: "Joint projects, grant applications and shared datasets with RIGIS researchers.",
  },
  {
    type: "partnership",
    icon: Landmark,
    title: "Academic partnerships",
    text: "Visiting researchers, co-supervision and institutional partnerships.",
  },
  {
    type: "postgraduate",
    icon: GraduationCap,
    title: "Student involvement",
    text: "Postgraduate study, supervision and research opportunities for students.",
  },
  {
    type: "research",
    icon: BookOpenCheck,
    title: "Research enquiries",
    text: "Questions about our publications, methods or areas of expertise.",
  },
] as const;

/** Scene 6 — the close of the story: how to take part. */
export function CollaborateScene({ data }: { data: PublicDataset }) {
  const { site } = data;
  const news = data.announcements.slice(0, 2);
  return (
    <section id="collaborate" aria-labelledby="collaborate-title" className="scroll-mt-20 bg-purple-700 text-white">
      <div className="container-page py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-purple-200">
              <span className="rule-accent" aria-hidden="true" />
              06 · Work with us
            </p>
            <h2 id="collaborate-title" className="mt-5 font-heading text-[2.25rem] leading-[1.08] font-extrabold text-white sm:text-5xl lg:text-[3.5rem]">
              The next connection
              <br />
              <span className="text-brass">could be yours.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              Research moves further together. Tell us what you are working on and the right member of the group can follow
              up with you.
            </p>
          </div>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden border border-white/12 bg-white/12 sm:grid-cols-2 lg:grid-cols-4">
          {pathways.map(({ type, icon: Icon, title, text }) => (
            <li key={type} className="bg-purple-700">
              <Link
                href={`/contact/?type=${type}`}
                className="group flex h-full flex-col p-6 transition-colors duration-200 hover:bg-purple-800 focus-visible:bg-purple-800 sm:p-7"
              >
                <Icon className="size-6 text-brass" aria-hidden="true" />
                <span className="mt-6 font-heading text-lg font-bold text-white">{title}</span>
                <span className="mt-2 text-[0.9375rem] leading-relaxed text-white/70">{text}</span>
                <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold text-brass">
                  Start an enquiry
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-10 border-t border-white/12 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="eyebrow text-purple-200">Contact</h3>
            <p className="mt-3 flex items-center gap-3 text-[0.9375rem] text-white/85">
              <Mail className="size-4 text-brass" aria-hidden="true" />
              {site.contactEmail ? (
                <a href={`mailto:${site.contactEmail}`} className="hover:underline">{site.contactEmail}</a>
              ) : (
                <Link href="/contact/" className="inline-flex min-h-10 items-center underline-offset-4 hover:underline">Use the contact form</Link>
              )}
            </p>
            <p className="mt-2 text-sm text-white/60">{site.affiliation}</p>
          </div>
          {news.length > 0 && (
            <div className="lg:col-span-7">
              <h3 className="eyebrow text-purple-200">Latest from the group</h3>
              <ul className="mt-3 divide-y divide-white/12">
                {news.map((a) => (
                  <li key={a.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6">
                    <time dateTime={a.publishedAt} className="shrink-0 text-sm text-white/55 tabular-nums sm:w-36">
                      {formatDate(a.publishedAt)}
                    </time>
                    <span className="flex flex-wrap items-center gap-2 text-[0.9375rem] text-white/85">
                      {a.title}
                      {a.isDemo && <StatusTag status="demo" inverted />}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
