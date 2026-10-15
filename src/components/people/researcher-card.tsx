import Link from "next/link";
import type { PublicProfile } from "@/types/domain";
import { ProfileAvatar } from "./profile-avatar";
import { DemoTag } from "@/components/layout/demo-banner";
import { displayName } from "@/lib/data/selectors";

export function profileHref(slug: string) {
  return `/people/${slug}/`;
}

/**
 * Faculty-directory entry: portrait, name, position and one line of real
 * activity (e.g. publications listed). The whole entry is one link target.
 */
export function ResearcherCard({
  profile,
  meta,
  headingLevel: H = "h3",
}: {
  profile: PublicProfile;
  /** One line of factual context, e.g. "11 publications · 3 co-authors in RIGIS". */
  meta?: string;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden bg-card">
        <ProfileAvatar
          name={profile.fullName}
          photoUrl={profile.photoUrl}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-purple-700 transition-transform duration-300 group-hover:scale-x-100"
        />
        {profile.isDemo && <DemoTag className="absolute top-3 right-3 bg-card" />}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <H className="font-heading text-[1.3125rem] leading-snug font-normal">
          <Link
            href={profileHref(profile.slug)}
            className="after:absolute after:inset-0 group-hover:text-purple-700 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:outline-offset-2 after:focus-visible:outline-purple-700"
          >
            {displayName(profile)}
          </Link>
        </H>
        {profile.position && <p className="mt-1 text-[0.9375rem] text-muted-foreground">{profile.position}</p>}
        {meta && <p className="mt-3 border-t border-border pt-3 text-[0.8125rem] text-muted-foreground">{meta}</p>}
      </div>
    </article>
  );
}
