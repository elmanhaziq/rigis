import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <div className="container-page py-24 sm:py-32">
          <p className="eyebrow flex items-center gap-3">
            <span className="rule-accent" aria-hidden="true" />
            Error 404
          </p>
          <h1 className="mt-4 font-heading text-4xl font-extrabold sm:text-5xl">Page not found</h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            The page may have moved, or the profile or project may no longer be published.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg"><Link href="/">Go to the homepage</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/research/">Browse research</Link></Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
