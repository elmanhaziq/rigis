"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogIn } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";
import { mainNav } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-10 items-center px-3.5 text-[0.9375rem] font-medium transition-colors",
                      "after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-200",
                      "hover:text-navy-900 hover:after:scale-x-100",
                      active ? "text-navy-900 after:scale-x-100" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/portal/login/">
              <LogIn data-icon="inline-start" aria-hidden="true" />
              Member portal
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm bg-paper">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo />
              </SheetHeader>
              <nav aria-label="Mobile" className="px-4">
                <ul className="divide-y divide-border border-y border-border">
                  {[{ href: "/", label: "Home" }, ...mainNav].map((item) => {
                    const active = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex min-h-12 items-center font-heading text-lg font-semibold",
                            active ? "text-navy-900" : "text-muted-foreground",
                          )}
                        >
                          {active && <span className="mr-3 h-4 w-px bg-brass" aria-hidden="true" />}
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Button asChild className="mt-6 w-full" size="lg">
                  <Link href="/portal/login/" onClick={() => setOpen(false)}>
                    <LogIn data-icon="inline-start" aria-hidden="true" />
                    Member portal
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
