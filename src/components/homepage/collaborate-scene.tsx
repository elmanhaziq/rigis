import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PublicDataset } from "@/lib/data";
import { StatusTag } from "@/components/layout/demo-banner";
import { formatDate } from "@/lib/format";

const pathways = [
  {
    type: "collaboration",
    title: "Research collaboration",
    text: "Joint projects, grant applications and shared datasets.",
  },
  {
    type: "partnership",
    title: "Academic partnerships",
    text: "Visiting researchers, co-supervision and institutional links.",
  },
  {
    type: "postgraduate",
    title: "Student involvement",
    text: "Postgraduate study, supervision and research opportunities.",
  },
  {
    type: "research",
    title: "Research enquiries",
    text: "Questions about our publications, methods or expertise.",
  },
] as const;

/**
 * Scene 6 — the close of the story. A typographic index of ways to work with
 * the group, each opening the contact form with the right enquiry selected.
 */
export function CollaborateScene({ data }: { data: PublicDataset }) {
  const { site } = data;
  const news = data.announcements.slice(0, 2);
  return (
    <section id="collaborate" aria-labelledby="collaborate-title" className="scroll-mt-20 bg-purple-700 text-white">
      <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:gap-10 lg:py-28">
        <div className="lg:col-span-5">
          <p className="eyebrow text-purple-200">Work with us</p>
          <h2
            id="collaborate-title"
            className="mt-5 font-heading text-[2.625rem] leading-[1.02] font-normal text-white sm:text-[3.75rem]"
          >
            Work with <em className="text-brass">RIGIS</em>
          </h2>
          <p className="mt-6 max-w-[40ch] text-[1.0625rem] leading-relaxed text-white/80">
            Tell us what you are working on and the right member of the group can follow up with you.
          </p>
          <dl className="mt-10 space-y-5 border-t border-white/15 pt-6 text-[0.9375rem]">
            <div>
              <dt className="eyebrow text-purple-200">Contact</dt>
              <dd className="mt-1">
                {site.contactEmail ? (
                  <a href={`mailto:${site.contactEmail}`} className="text-white hover:underline">{site.contactEmail}</a>
                ) : (
                  <Link href="/contact/" className="inline-flex min-h-10 items-center text-white underline-offset-4 hover:underline">
                    Use the contact form
                  </Link>
                )}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-purple-200">Affiliation</dt>
              <dd className="mt-1 text-white/80">{site.affiliation}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <ol className="border-t border-white/25">
            {pathways.map(({ type, title, text }, i) => (
              <li key={type} className="border-b border-white/25">
                <Link
                  href={`/contact/?type=${type}`}
                  className="group grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-4 py-6 transition-colors sm:grid-cols-[3rem_1fr_auto] sm:py-7"
                >
                  <span className="font-heading text-lg text-purple-200 tabular-nums">{i + 1}</span>
                  <span>
                    <span className="block font-heading text-[1.5rem] leading-snug text-white transition-colors group-hover:text-brass sm:text-[1.875rem]">
                      {title}
                    </span>
                    <span className="mt-1 block text-[0.9375rem] text-white/75">{text}</span>
                  </span>
                  <ArrowUpRight
                    className="size-5 self-center text-white/70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brass"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ol>

          {news.length > 0 && (
            <div className="mt-12">
              <h3 className="eyebrow text-purple-200">Latest from the group</h3>
              <ul className="mt-3 divide-y divide-white/15">
                {news.map((a) => (
                  <li key={a.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6">
                    <time dateTime={a.publishedAt} className="shrink-0 text-sm text-white/65 tabular-nums sm:w-36">
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
