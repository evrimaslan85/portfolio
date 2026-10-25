// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import { packageEntries, buildRelease, zip } from '../scripts/build-release.mjs';
const require = createRequire(import.meta.url), contract = require('../packages/shared/contract.js');
const example = JSON.parse(await readFile(new URL('../examples/portfolio.json', import.meta.url), 'utf8'));

test('runtime contract accepts the portable fixture and rejects private or broken content', () => {
  assert.equal(contract.validate(structuredClone(example)).projects.length, 3);
  const unknown = structuredClone(example); unknown.projects[0].secret = 'private'; assert.throws(() => contract.validate(unknown), /unsupported field/);
  const reference = structuredClone(example); reference.projects[0].sections.solution.evidenceIds = ['missing']; assert.throws(() => contract.validate(reference), /unknown evidence/);
  for (const source of ['javascript:alert(1)', '//example.invalid/a', '../private.png', 'media/%252e%252e/x', 'https://user:password@example.invalid/a', 'file:///private/a']) assert.equal(contract.safeSource(source), false);
});

test('schema wrappers and editable sample content match the canonical source', async () => {
  const schema = JSON.parse(await readFile(new URL('../schemas/portfolio.schema.json', import.meta.url), 'utf8'));
  assert.deepEqual(require('../packages/shared/schema.js'), schema);
  assert.deepEqual(JSON.parse(await readFile(new URL('../packages/wordpress-plugin/portfolio.schema.json', import.meta.url), 'utf8')), schema);
  const context = {}; vm.runInNewContext(await readFile(new URL('../packages/site/content.js', import.meta.url), 'utf8'), context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.PORTFOLIO_CONTENT)), example);
});

test('release packages have installable layouts, local assets, and complete instructions', async () => {
  const packages = await packageEntries(); assert.equal(packages.size, 6);
  const wordpress = packages.get('wordpress'); assert(wordpress.has('portfolio-case-studies/portfolio-case-studies.php')); assert(wordpress.has('portfolio-case-studies/license.txt')); assert(wordpress.has('portfolio-case-studies/assets/portfolio.css'));
  const site = packages.get('cpanel'); for (const name of ['index.html', 'editor.html', 'embed.html', 'content.js', 'assets/contract.js', 'assets/schema.js', 'assets/portfolio.js', 'assets/portfolio.css', 'INSTALL.md']) assert(site.has(name), name);
  for (const [edition, entries] of packages) {
    for (const [filename, bytes] of entries) {
      assert(!filename.includes('..') && !filename.startsWith('/'));
      assert(!/\.(sql|env|log|zip)$/u.test(filename));
      if (filename.endsWith('.html')) {
        const html = bytes.toString();
        for (const match of html.matchAll(/(?:href|src)="([^"]+)"/gu)) {
          const target = match[1]; if (/^(https?:|#)/u.test(target)) continue;
          assert(entries.has(path.posix.normalize(path.posix.join(path.posix.dirname(filename), target))), edition + ': missing ' + target);
        }
      }
    }
  }
});

test('six downloadable ZIPs are valid, deterministic, and have checksum manifests', async () => {
  const first = await mkdtemp(path.join(tmpdir(), 'portfolio-release-one-')), second = await mkdtemp(path.join(tmpdir(), 'portfolio-release-two-'));
  const a = await buildRelease(first), b = await buildRelease(second); assert.deepEqual(a, b); assert.equal(a.length, 6);
  for (const artifact of a) execFileSync('unzip', ['-t', path.join(first, artifact.file)], { stdio: 'pipe' });
  assert((await readFile(path.join(first, 'SHA256SUMS.txt'), 'utf8')).includes(a[0].sha256));
  assert.throws(() => zip(new Map([['../escape', 'bad']])), /Unsafe package path/);
});
