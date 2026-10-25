// SPDX-License-Identifier: MIT
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';

export const root = fileURLToPath(new URL('../', import.meta.url));
const read = name => readFile(path.join(root, name));
const table = Array.from({ length: 256 }, (_, n) => { for (let i = 0; i < 8; i++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1; return n >>> 0; });
function crc32(buffer) { let n = 0xffffffff; for (const byte of buffer) n = table[(n ^ byte) & 255] ^ (n >>> 8); return (n ^ 0xffffffff) >>> 0; }

// Small dependency-free, deterministic ZIP writer. Inputs are known package files,
// never user-uploaded archives. No symlinks or executable filesystem paths are used.
export function zip(entries) {
  const local = [], central = []; let offset = 0;
  for (const [name, raw] of [...entries].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    if (!/^[A-Za-z0-9_./-]+$/u.test(name) || name.startsWith('/') || name.split('/').includes('..')) throw Error('Unsafe package path: ' + name);
    const content = Buffer.isBuffer(raw) ? raw : Buffer.from(raw), filename = Buffer.from(name), compressed = deflateRawSync(content, { level: 9 }), crc = crc32(content);
    const head = Buffer.alloc(30); head.writeUInt32LE(0x04034b50); head.writeUInt16LE(20, 4); head.writeUInt16LE(0x0800, 6); head.writeUInt16LE(8, 8); head.writeUInt16LE((46 << 9) | (1 << 5) | 1, 12); head.writeUInt32LE(crc, 14); head.writeUInt32LE(compressed.length, 18); head.writeUInt32LE(content.length, 22); head.writeUInt16LE(filename.length, 26);
    const center = Buffer.alloc(46); center.writeUInt32LE(0x02014b50); center.writeUInt16LE((3 << 8) | 20, 4); center.writeUInt16LE(20, 6); center.writeUInt16LE(0x0800, 8); center.writeUInt16LE(8, 10); center.writeUInt16LE((46 << 9) | (1 << 5) | 1, 14); center.writeUInt32LE(crc, 16); center.writeUInt32LE(compressed.length, 20); center.writeUInt32LE(content.length, 24); center.writeUInt16LE(filename.length, 28); center.writeUInt32LE((0o100644 << 16) >>> 0, 38); center.writeUInt32LE(offset, 42);
    local.push(head, filename, compressed); central.push(center, filename); offset += head.length + filename.length + compressed.length;
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.size, 8); end.writeUInt16LE(entries.size, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}

async function directoryFiles(directory, prefix = '') {
  const files = new Map();
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name), source = path.posix.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw Error('Symlink not allowed in package sources');
    if (entry.isDirectory()) for (const [p, content] of await directoryFiles(source, relative)) files.set(p, content);
    else if (entry.isFile()) files.set(relative, await read(source));
  }
  return files;
}

export async function packageEntries() {
  const plugin = await directoryFiles('packages/wordpress-plugin', 'portfolio-case-studies');
  plugin.set('portfolio-case-studies/assets/portfolio.css', await read('packages/shared/portfolio.css'));
  plugin.set('portfolio-case-studies/third-party-notices.txt', Buffer.concat([Buffer.from('The bundled shared presentation CSS is MIT licensed. Other plugin runtime files are GPL-2.0-or-later.\n\n'), await read('LICENSE')]));
  const site = await directoryFiles('packages/site');
  for (const name of ['index.html', 'editor.html']) site.set(name, Buffer.from(site.get(name).toString().replaceAll('../shared/', 'assets/')));
  for (const [name, content] of await directoryFiles('packages/shared')) site.set('assets/' + name, content);
  site.set('media/workflow.svg', await read('examples/media/workflow.svg'));
  site.set('LICENSE', await read('LICENSE'));
  const embedded = site.get('index.html').toString().replace(/<nav class="site-nav"[\s\S]*?<\/nav>/u, '').replace(/<footer class="site-footer"[\s\S]*?<\/footer>/u, '');
  site.set('embed.html', Buffer.from(embedded));
  const packages = new Map([['wordpress', plugin], ['cpanel', site]]);
  for (const [key, file] of [['webflow', 'WEBFLOW'], ['wix', 'WIX'], ['squarespace', 'SQUARESPACE'], ['html', 'HTML']]) {
    const entries = new Map([...site].map(([p, content]) => ['hosted-portfolio/' + p, content]));
    entries.set('INSTALL.md', await read('packages/embed/' + file + '.md'));
    entries.set('make-embed.html', Buffer.from((await read('packages/embed/make-embed.html')).toString().replace('../site/site.css', 'hosted-portfolio/site.css')));
    entries.set('make-embed.js', await read('packages/embed/make-embed.js'));
    entries.set('LICENSE', await read('LICENSE'));
    entries.set('START-HERE.html', Buffer.from('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Portfolio ' + key + ' embed</title><link rel="stylesheet" href="hosted-portfolio/site.css"><main class="embed-shell editor-panel"><h1>Your ' + key + ' portfolio embed</h1><ol><li><a href="hosted-portfolio/editor.html">Edit your portfolio</a>, download content.js, and replace that file inside hosted-portfolio.</li><li>Upload the contents of hosted-portfolio to a new folder on your own HTTPS hosting.</li><li><a href="make-embed.html">Create your embed code</a> with the hosted embed.html address.</li><li>Paste the code into a supported HTML/Embed block, or use Wix Embed Site.</li></ol><p><a href="INSTALL.md">Read the platform instructions</a>. This is a hosted embed, not a native platform application. Check your platform plan and the published mobile layout.</p></main></html>'));
    packages.set(key + '-embed', entries);
  }
  return packages;
}

export async function buildRelease(destination = path.join(root, 'dist')) {
  const release = JSON.parse((await read('release.json')).toString());
  if (!/^\d+\.\d+\.\d+$/u.test(release.version)) throw Error('Invalid release version');
  await mkdir(destination, { recursive: true }); const manifest = [];
  const packages = await packageEntries();
  for (const name of release.artifacts) {
    const entries = packages.get(name); if (!entries) throw Error('Unknown release package: ' + name);
    const filename = 'portfolio-' + name + '-' + release.version + '.zip', bytes = zip(entries);
    await writeFile(path.join(destination, filename), bytes);
    manifest.push({ file: filename, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), entries: entries.size });
  }
  await writeFile(path.join(destination, 'SHA256SUMS.txt'), manifest.map(item => item.sha256 + '  ' + item.file).join('\n') + '\n');
  await writeFile(path.join(destination, 'manifest.json'), JSON.stringify({ version: release.version, artifacts: manifest }, null, 2) + '\n');
  return manifest;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await buildRelease(), null, 2));
