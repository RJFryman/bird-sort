// Per-deploy version stamp.
//
// Emits a fresh version.json with a unique build id on every web build. The
// UpdateBanner fetches /version.json at boot and re-checks it later; when the
// id changes (because a new build was deployed), it offers an opt-in refresh.
//
// Reusable: no app-specific logic. Writes to public/ (so `expo export` copies it
// into dist/) AND directly to dist/ when it exists (so the freshly-built site
// root always carries the newest id, regardless of export caching).
//
// Run as part of each build: `expo export -p web && node scripts/stamp-version.mjs`.
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Unique per build: timestamp + a little randomness so two builds in the same
// millisecond still differ.
const build = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const payload = JSON.stringify({ build }) + '\n';

const targets = [
  join(root, 'public', 'version.json'), // copied into dist/ by expo export
  join(root, 'dist', 'version.json'), // the actual deployed site root
];

for (const target of targets) {
  const dir = dirname(target);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(target, payload);
  console.log(`stamped ${target} → build ${build}`);
}
