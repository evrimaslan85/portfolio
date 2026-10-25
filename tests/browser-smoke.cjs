// SPDX-License-Identifier: MIT
// Exercise the actual released static ZIP and embed packages, not a separate mock UI.
const { chromium } = require(process.env.PORTFOLIO_PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');

(async () => {
  const root = path.resolve(__dirname, '..'), version = require('../release.json').version;
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), 'portfolio-browser-'));
  const site = path.join(folder, 'site'), embed = path.join(folder, 'embed');
  await fs.mkdir(site); await fs.mkdir(embed);
  execFileSync('unzip', ['-q', path.join(root, 'dist', 'portfolio-cpanel-' + version + '.zip'), '-d', site]);
  execFileSync('unzip', ['-q', path.join(root, 'dist', 'portfolio-webflow-embed-' + version + '.zip'), '-d', embed]);
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
  const server = http.createServer(async (req, res) => {
    try { const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); const file = path.resolve(site, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname)); if (!file.startsWith(site + path.sep)) { res.writeHead(403).end(); return; } const body = await fs.readFile(file); res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream'); res.end(body); }
    catch { res.writeHead(404).end('Not found'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); const origin = 'http://127.0.0.1:' + server.address().port;
  const parent = http.createServer((req, res) => { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><title>Embed parent</title><iframe title="Project portfolio" src="' + origin + '/embed.html" width="100%" height="1100"></iframe>'); });
  await new Promise(resolve => parent.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    const launch = { headless: true }; if (process.env.PORTFOLIO_CHROME_PATH) launch.executablePath = process.env.PORTFOLIO_CHROME_PATH;
    browser = await chromium.launch(launch); const page = await browser.newPage({ viewport: { width: 1360, height: 1000 }, acceptDownloads: true });
    const errors = [], externalRequests = []; page.on('pageerror', e => errors.push(e.message)); page.on('request', request => { if (/^https?:/.test(request.url()) && new URL(request.url()).hostname !== '127.0.0.1') externalRequests.push(request.url()); });
    await page.goto(origin + '/index.html'); await page.locator('.pf-card').first().waitFor(); assert.equal(await page.locator('.pf-card').count(), 3);
    await page.locator('[data-pf-system]').selectOption('workflow'); assert.equal(await page.locator('.pf-card').count(), 1);
    await page.locator('[data-pf-tech]').selectOption('json'); assert.equal(await page.locator('.pf-card').count(), 0);
    await page.locator('[data-pf-tech]').selectOption(''); await page.locator('[data-pf-open]').first().click(); assert.equal(await page.locator('dialog').evaluate(e => e.open), true);
    await page.locator('summary').first().click(); assert.equal(await page.locator('details').first().getAttribute('open'), '');
    await page.keyboard.press('Escape'); assert.equal(await page.locator('dialog').evaluate(e => e.open), false);
    await page.goto(origin + '/editor.html'); await page.locator('#project-form > label input[data-field="title"]').waitFor();
    const title = 'Public project <img src=x onerror="window.unwanted=true">';
    await page.locator('#project-form > label input[data-field="title"]').fill(title);
    await page.locator('#preview-projects').click(); await page.locator('#preview-projects').click();
    assert.equal(await page.locator('#live-preview .pf-card').count(), 3);
    assert.equal(await page.evaluate(() => Boolean(window.unwanted)), false);
    await page.locator('#add-project').click(); await page.locator('#project-form > label input[data-field="title"]').fill('An added project');
    const downloadEvent = page.waitForEvent('download'); await page.locator('#download-content').click(); const download = await downloadEvent; const downloaded = path.join(folder, 'downloaded-content.js'); await download.saveAs(downloaded);
    const script = await fs.readFile(downloaded, 'utf8'), context = {}; vm.runInNewContext(script, context); assert.equal(context.PORTFOLIO_CONTENT.projects.length, 4); assert.equal(context.PORTFOLIO_CONTENT.projects[0].title, title);
    await fs.writeFile(path.join(site, 'content.js'), script);
    await page.goto(origin + '/index.html'); await page.locator('.pf-card').first().waitFor(); assert.equal(await page.locator('.pf-card').count(), 4); assert.equal(await page.evaluate(() => Boolean(window.unwanted)), false);
    await page.setViewportSize({ width: 390, height: 844 }); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    if (process.env.PORTFOLIO_SCREENSHOTS) { await fs.mkdir(process.env.PORTFOLIO_SCREENSHOTS, { recursive: true }); await page.screenshot({ path: path.join(process.env.PORTFOLIO_SCREENSHOTS, 'portfolio-site-mobile.png'), fullPage: true }); }
    await page.goto(origin + '/editor.html'); await page.locator('#project-picker').waitFor();
    const invalid = JSON.parse(JSON.stringify(context.PORTFOLIO_CONTENT)); invalid.privateNotes = 'Should never import';
    await page.locator('#import-json').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(invalid)) });
    assert.match(await page.locator('#editor-status').textContent(), /unsupported field/); assert.equal(await page.locator('#project-picker option').count(), 4);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.goto(pathToFileURL(path.join(embed, 'make-embed.html')).href);
    await page.locator('#embed-url').fill('http://example.invalid/portfolio/embed.html'); await page.locator('#make-embed').click(); assert.match(await page.locator('#embed-status').textContent(), /HTTPS/);
    await page.locator('#embed-url').fill('https://example.invalid/portfolio/embed.html'); await page.locator('#make-embed').click(); assert.match(await page.locator('#embed-code').inputValue(), /<iframe src="https:\/\/example.invalid\/portfolio\/embed.html"/);
    await page.goto('http://127.0.0.1:' + parent.address().port); const frame = page.frameLocator('iframe'); await frame.locator('.pf-card').first().waitFor(); assert.equal(await frame.locator('.pf-card').count(), 4); assert.equal(await frame.locator('.site-nav').count(), 0);
    assert.deepEqual(errors, []); assert.deepEqual(externalRequests, []);
    console.log(JSON.stringify({ staticZip: 'pass', editorSaveAndReopen: 'pass', importValidation: 'pass', textEscaping: 'pass', mobile: 'pass', embedGenerator: 'pass', crossOriginFrame: 'pass', externalRequests: 0, browser: browser.version() }));
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); await new Promise(resolve => parent.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
