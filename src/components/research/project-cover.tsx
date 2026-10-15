/* eslint-disable @next/next/no-img-element -- static export: images are pre-compressed WebP, no optimiser available */
import { cn } from "@/lib/utils";

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Project cover image. When no cover has been uploaded, renders a deterministic
 * line-field pattern derived from the project slug, so every project has a
 * distinct but restrained visual instead of a stock illustration.
 */
export function ProjectCover({
  slug,
  title,
  coverUrl,
  className,
  priority = false,
}: {
  slug: string;
  title: string;
  coverUrl: string | null;
  className?: string;
  priority?: boolean;
}) {
  if (coverUrl) {
    return (
      <img
        src={coverUrl}
        alt=""
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const h = hash(slug);
  const lines = 14;
  const tilt = (h % 40) - 20;
  const focusX = 50 + (h % 100);
  const focusY = 20 + ((h >>> 8) % 60);
  // Keep nodes inside the central band so they survive "slice" cropping.
  const nodes = Array.from({ length: 5 }, (_, i) => ({
    x: 55 + ((h >>> (i * 4)) % 90),
    y: 18 + ((h >>> (i * 5 + 2)) % 64),
  }));

  return (
    <svg
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Abstract cover for ${title}`}
      className={cn("h-full w-full bg-navy-900", className)}
    >
      <defs>
        <radialGradient id={`g-${h}`} cx={focusX / 200} cy={focusY / 100} r="0.8">
          <stop offset="0" stopColor="#1D4263" />
          <stop offset="1" stopColor="#10243A" />
        </radialGradient>
      </defs>
      <rect width="200" height="100" fill={`url(#g-${h})`} />
      <g stroke="#9AA9B8" strokeOpacity="0.22" strokeWidth="0.4" fill="none">
        {Array.from({ length: lines }, (_, i) => {
          const y = (i + 1) * (100 / (lines + 1));
          return (
            <path
              key={i}
              d={`M -10 ${y} Q ${focusX} ${y + tilt * Math.sin((i + 1) * 0.6)} 210 ${y + tilt / 3}`}
            />
          );
        })}
      </g>
      <g stroke="#B89B68" strokeOpacity="0.6" strokeWidth="0.5">
        {nodes.slice(1).map((n, i) => (
          <line key={i} x1={nodes[i]!.x} y1={nodes[i]!.y} x2={n.x} y2={n.y} />
        ))}
      </g>
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i === 0 ? 2.2 : 1.4} fill={i === 0 ? "#B89B68" : "#ffffff"} fillOpacity={i === 0 ? 1 : 0.8} />
      ))}
    </svg>
  );
}
