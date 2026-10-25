// SPDX-License-Identifier: MIT
import { readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
for (const folder of ['packages', 'scripts', 'tests', 'prototype']) {
  async function walk(directory) { for (const item of await readdir(directory, { withFileTypes: true })) { const target = path.join(directory, item.name); if (item.isDirectory()) await walk(target); else if (/\.(c?js|mjs)$/u.test(item.name)) execFileSync(process.execPath, ['--check', target], { stdio: 'pipe' }); } }
  await walk(folder);
}
console.log('All package, browser, test, and build JavaScript syntax checks passed.');
