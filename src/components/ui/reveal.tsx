import { cn } from "@/lib/utils";

/**
 * Subtle fade-and-rise as the block scrolls into view. Implemented with CSS
 * scroll-driven animations (.reveal in globals.css) so content is always
 * visible without JavaScript, to crawlers, and in browsers without support.
 * Disabled under prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
