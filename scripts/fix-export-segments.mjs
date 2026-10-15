/**
 * Works around a Next.js static-export bug on Windows: segment prefetch files
 * are written as nested folders (`__next.!X/__PAGE__.txt`) instead of dotted
 * filenames (`__next.!X.__PAGE__.txt`) because the exporter splits paths on
 * "/" only. The client requests the dotted name, so prefetches 404.
 * On Linux (e.g. Cloudflare Pages builds) there is nothing to fix and this
 * script exits without changes.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.argv[2] ?? "out");
let moved = 0;

async function flatten(dir, prefix, target) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const name = `${prefix}.${entry.name}`;
    if (entry.isDirectory()) await flatten(full, name, target);
    else {
      await fs.rename(full, path.join(target, name));
      moved++;
    }
  }
  await fs.rmdir(dir);
}

async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) await flatten(full, entry.name, dir);
    else if (entry.name !== "_next") await walk(full);
  }
}

await walk(outDir);
if (moved) console.log(`fix-export-segments: flattened ${moved} segment file(s)`);
