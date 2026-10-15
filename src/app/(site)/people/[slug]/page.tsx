import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileSlugs, getPublicDataset } from "@/lib/data";
import { displayName } from "@/lib/data/selectors";
import { ProfileView } from "@/components/people/profile-view";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProfileSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/people/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { profiles } = await getPublicDataset();
  const profile = profiles.find((p) => p.slug === slug);
  if (!profile) return { title: "Profile not found" };
  const name = displayName(profile);
  const description =
    profile.biography?.slice(0, 160) ??
    `${name}${profile.position ? `, ${profile.position}` : ""} — member of RIGIS.`;
  return {
    title: name,
    description,
    alternates: { canonical: `/people/${slug}/` },
    openGraph: { type: "profile", title: name, description, url: `/people/${slug}/` },
  };
}

export default async function ProfilePage({ params }: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  const data = await getPublicDataset();
  const profile = data.profiles.find((p) => p.slug === slug);
  if (!profile) notFound();
  return <ProfileView profile={profile} data={data} />;
}
