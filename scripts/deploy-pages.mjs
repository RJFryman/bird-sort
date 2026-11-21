// Publishes the static export to the existing GitHub Pages branch without switching source checkouts.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const git = (args, cwd = root) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
if (!existsSync(join(root, 'dist/index.html'))) throw Error('Run npm run build first.');
const source = git(['rev-parse', '--short', 'HEAD']);
const remote = git(['remote', 'get-url', 'origin']);
const temp = mkdtempSync(join(tmpdir(), 'bird-sort-pages-'));
try {
  git(['clone', '--depth', '1', '--branch', 'gh-pages', '--single-branch', remote, temp]);
  for (const name of readdirSync(temp)) {
    if (name !== '.git') rmSync(join(temp, name), { recursive: true, force: true });
  }
  cpSync(join(root, 'dist'), temp, { recursive: true });
  writeFileSync(join(temp, '.nojekyll'), '');
  git(['add', '--all'], temp);
  if (!git(['diff', '--cached', '--stat'], temp)) {
    console.log('GitHub Pages already contains this build.');
  } else {
    git(['commit', '-m', `Publish Bird Sort from ${source}`], temp);
    git(['push', 'origin', 'HEAD:gh-pages'], temp);
    console.log(`Published ${source} to https://rjfryman.github.io/bird-sort/`);
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
