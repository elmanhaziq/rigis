import Link from "next/link";
import type { PublicProfile } from "@/types/domain";
import { ProfileAvatar } from "./profile-avatar";
import { DemoTag } from "@/components/layout/demo-banner";
import { roleLabels } from "@/config/site";
import { displayName } from "@/lib/data/selectors";

export function profileHref(slug: string) {
  return `/people/${slug}/`;
}

export function ResearcherCard({
  profile,
  headingLevel: H = "h3",
}: {
  profile: PublicProfile;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden border border-border bg-card">
        <ProfileAvatar
          name={profile.fullName}
          photoUrl={profile.photoUrl}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        {profile.isDemo && <DemoTag className="absolute top-3 right-3 bg-card" />}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow">{roleLabels[profile.role]}</p>
        <H className="mt-2 font-heading text-lg leading-snug font-bold">
          <Link
            href={profileHref(profile.slug)}
            className="link-underline after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:outline-offset-2 after:focus-visible:outline-navy-800"
          >
            {displayName(profile)}
          </Link>
        </H>
        {profile.position && <p className="mt-1 text-[0.9375rem] text-muted-foreground">{profile.position}</p>}
        {profile.researchInterests.length > 0 && (
          <p className="mt-3 line-clamp-2 text-[0.8125rem] text-muted-foreground">
            {profile.researchInterests.join(" · ")}
          </p>
        )}
      </div>
    </article>
  );
}
