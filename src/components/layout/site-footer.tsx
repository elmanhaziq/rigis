import Link from "next/link";
import { Logo } from "./logo";
import { mainNav, siteConfig } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-navy-950 text-white/75">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo inverted />
          <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed">
            A research group advancing knowledge in intelligent systems through rigorous
            research, mentoring and collaboration.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="font-heading text-sm font-semibold tracking-wide text-white">Explore</h2>
          <ul className="mt-4 space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="link-underline inline-flex min-h-9 items-center text-[0.9375rem] hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="font-heading text-sm font-semibold tracking-wide text-white">Members</h2>
          <ul className="mt-4 space-y-1">
            <li>
              <Link href="/portal/login/" className="link-underline inline-flex min-h-9 items-center text-[0.9375rem] hover:text-white">
                Sign in to the portal
              </Link>
            </li>
            <li>
              <Link href="/portal/register/" className="link-underline inline-flex min-h-9 items-center text-[0.9375rem] hover:text-white">
                Request membership
              </Link>
            </li>
            <li>
              <Link href="/contact/" className="link-underline inline-flex min-h-9 items-center text-[0.9375rem] hover:text-white">
                Collaboration enquiries
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-[0.8125rem] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.shortName} — {siteConfig.name}
          </p>
          <p>Content is managed by RIGIS members.</p>
        </div>
      </div>
    </footer>
  );
}
