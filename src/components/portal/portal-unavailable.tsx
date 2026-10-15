import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

/**
 * Shown on portal routes until Supabase authentication is connected (Phase 2).
 * Deliberately has no form fields so nothing looks functional when it is not.
 */
export function PortalUnavailable({ title }: { title: string }) {
  return (
    <main id="main" className="flex min-h-full flex-1 flex-col bg-paper">
      <div className="container-page flex h-[72px] items-center">
        <Logo />
      </div>
      <div className="container-page flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-md border border-border bg-card p-8 sm:p-10">
          <span className="flex size-11 items-center justify-center rounded-full bg-muted text-purple-700">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-6 font-heading text-2xl font-semibold">{title}</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The RIGIS member portal is not available yet. Sign-in and membership requests will
            open once the website&rsquo;s secure database and authentication are connected.
          </p>
          <Button asChild variant="outline" className="mt-8">
            <Link href="/">
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Back to the website
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
