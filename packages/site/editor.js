/* SPDX-License-Identifier: MIT */
(() => {
  'use strict';
  const clone = data => JSON.parse(JSON.stringify(data));
  let data = clone(globalThis.PORTFOLIO_CONTENT), index = 0, dirty = false;
  const form = document.querySelector('#project-form'), picker = document.querySelector('#project-picker'), status = document.querySelector('#editor-status');
  const esc = globalThis.PortfolioView.escape;
  const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 65) || 'project';
  const field = (label, name, value, multiline = false) => `<label>${esc(label)}${multiline ? `<textarea data-field="${esc(name)}">${esc(value)}</textarea>` : `<input data-field="${esc(name)}" value="${esc(value)}">`}</label>`;
  function message(text, error = false) { status.textContent = text; status.dataset.error = String(error); }
  function options() {
    picker.replaceChildren(...data.projects.map((p, i) => { const o = document.createElement('option'); o.value = String(i); o.textContent = p.title; return o; })); picker.value = String(index);
    document.querySelector('#site-title').value = data.title; document.querySelector('#site-summary').value = data.summary;
  }
  function paint() {
    options(); const p = data.projects[index];
    if (!p) { form.innerHTML = '<h2>No projects yet</h2><p>Choose Add project to begin.</p>'; return; }
    const statuses = ['prototype', 'live', 'completed', 'ongoing'].map(s => `<option ${s === p.status ? 'selected' : ''}>${s}</option>`).join('');
    form.innerHTML = `<h2>Project details</h2>${field('Title', 'title', p.title)}${field('Short summary', 'summary', p.summary, true)}${field('Public client label (optional)', 'client', p.client?.displayName || '')}<label>Delivery status<select data-field="status">${statuses}</select></label>${field('Systems / services (comma-separated)', 'systems', p.systems.map(t => t.label).join(', '))}${field('Technologies (comma-separated)', 'technologies', p.technologies.map(t => t.label).join(', '))}${Object.entries(p.sections).map(([key, value]) => `<h3>${esc(value.title)}</h3>${field('Section heading', 'sections.' + key + '.title', value.title)}${field('Story', 'sections.' + key + '.body', value.body, true)}`).join('')}<h3>What we built</h3><div>${p.implementations.map((item, i) => `<div class="editor-row" data-row="implementations" data-index="${i}">${field('Title', 'title', item.title)}${field('Summary', 'summary', item.summary, true)}${field('Details', 'details', item.details, true)}<button type="button" data-remove="implementations" data-index="${i}">Remove implementation</button></div>`).join('')}</div><button type="button" data-add="implementations">Add implementation</button><h3>Evidence and screenshots</h3><p class="editor-help">Use an HTTPS address or a relative file such as media/screenshot.png. Upload local media files with your website. Images need alternative text.</p>${p.evidence.map((item, i) => `<div class="editor-row" data-row="evidence" data-index="${i}"><label>Type<select data-field="type">${['image', 'link', 'video'].map(t => `<option ${t === item.type ? 'selected' : ''}>${t}</option>`).join('')}</select></label>${field('Title', 'title', item.title)}${field('Image / link address', 'src', item.src)}${field('Alternative text', 'alt', item.alt)}${field('Caption', 'caption', item.caption)}<button type="button" data-remove="evidence" data-index="${i}">Remove evidence</button></div>`).join('')}<button type="button" data-add="evidence">Add evidence</button><h3>Results</h3>${p.results.map((item, i) => `<div class="editor-row" data-row="results" data-index="${i}">${field('Label', 'label', item.label)}${field('Value or outcome', 'value', item.value)}${field('Context and basis', 'context', item.context, true)}<label>Result basis<select data-field="provenance">${['illustrative', 'reported', 'measured'].map(t => `<option ${t === item.provenance ? 'selected' : ''}>${t}</option>`).join('')}</select></label><button type="button" data-remove="results" data-index="${i}">Remove result</button></div>`).join('')}<button type="button" data-add="results">Add result</button><details><summary>Architecture (optional)</summary><p class="editor-help">A simple ordered sequence. Editing these steps replaces the imported graph. Leave it untouched to preserve a more detailed imported architecture.</p>${['source', 'process', 'storage', 'output'].map((kind, i) => field('Step ' + (i + 1) + ' — ' + kind, 'architecture.' + kind, p.architecture.nodes.find(n => n.kind === kind)?.label || '')).join('')}</details><hr><button type="button" id="delete-project">Delete this project</button>`;
  }
  function markDirty() { dirty = true; }
  function preview() { try { globalThis.PortfolioView.mount(document.querySelector('#live-preview'), globalThis.PortfolioContract.validate(data)); message('Preview updated. Download content.js to save your changes.'); } catch (e) { message(e.message, true); } }
  form.addEventListener('input', event => {
    const element = event.target.closest('[data-field]'); if (!element) return; const p = data.projects[index]; markDirty();
    const row = element.closest('[data-row]'); if (row) { p[row.dataset.row][Number(row.dataset.index)][element.dataset.field] = element.value; return; }
    const key = element.dataset.field;
    if (key === 'client') { if (element.value.trim()) p.client = { displayName: element.value }; else delete p.client; }
    else if (key === 'systems' || key === 'technologies') {
      const old = p[key]; const labels = [...new Set(element.value.split(',').map(x => x.trim()).filter(Boolean))];
      p[key] = labels.map(label => old.find(t => t.label === label) || { id: slug(key + '-' + label), label });
      if (key === 'technologies') p.implementations.forEach(item => { item.technologyIds = item.technologyIds.filter(id => p.technologies.some(t => t.id === id)); });
    } else if (key.startsWith('sections.')) { const [, section, property] = key.split('.'); p.sections[section][property] = element.value; }
    else if (key.startsWith('architecture.')) {
      const nodes = [...form.querySelectorAll('[data-field^="architecture."]')].filter(e => e.value.trim()).map((e, i) => ({ id: 'step-' + (i + 1), label: e.value, kind: e.dataset.field.split('.')[1] }));
      p.architecture = { nodes, edges: nodes.slice(1).map((n, i) => ({ from: nodes[i].id, to: n.id, label: '' })) };
    } else p[key] = element.value;
    if (key === 'title') { p.slug = slug(p.title); picker.options[index].textContent = p.title; }
  });
  form.addEventListener('click', event => {
    const p = data.projects[index]; const remove = event.target.closest('[data-remove]'), add = event.target.closest('[data-add]');
    if (remove) { const removed = p[remove.dataset.remove].splice(Number(remove.dataset.index), 1)[0]; if (remove.dataset.remove === 'evidence') [...Object.values(p.sections), ...p.implementations, ...p.results].forEach(item => { item.evidenceIds = item.evidenceIds.filter(id => id !== removed.id); }); markDirty(); paint(); }
    if (add) {
      const id = 'item-' + crypto.randomUUID();
      const empty = { implementations: { id, title: 'New implementation', summary: 'What this part does.', details: '', status: 'prototype', technologyIds: [], evidenceIds: [] }, evidence: { id, type: 'image', title: 'New evidence', src: 'media/screenshot.png', alt: 'Describe the screenshot.', caption: '' }, results: { id, label: 'Outcome', value: 'Describe the result', context: 'Explain how this result was established.', provenance: 'reported', evidenceIds: [] } };
      p[add.dataset.add].push(empty[add.dataset.add]); markDirty(); paint();
    }
    if (event.target.id === 'delete-project' && confirm('Delete this project from the current editor? Previously downloaded files are unchanged.')) { data.projects.splice(index, 1); index = Math.max(0, index - 1); markDirty(); paint(); }
  });
  picker.addEventListener('change', () => { index = Number(picker.value); paint(); });
  document.querySelector('#site-title').addEventListener('input', event => { data.title = event.target.value; markDirty(); });
  document.querySelector('#site-summary').addEventListener('input', event => { data.summary = event.target.value; markDirty(); });
  document.querySelector('#add-project').addEventListener('click', () => { data.projects.push(globalThis.PortfolioContract.freshProject()); index = data.projects.length - 1; markDirty(); paint(); });
  document.querySelector('#preview-projects').addEventListener('click', preview);
  function download(name, content, type) { const url = URL.createObjectURL(new Blob([content], { type })); const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  document.querySelector('#download-content').addEventListener('click', () => { try { globalThis.PortfolioContract.validate(data); const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029'); download('content.js', '/* Your public portfolio content. */\nglobalThis.PORTFOLIO_CONTENT = ' + json + ';\n', 'text/javascript'); dirty = false; message('content.js downloaded. Replace that file in your website folder and upload it to publish.'); } catch (e) { message(e.message, true); } });
  document.querySelector('#download-json').addEventListener('click', () => { try { globalThis.PortfolioContract.validate(data); download('portfolio.json', JSON.stringify(data, null, 2), 'application/json'); message('JSON backup downloaded.'); } catch (e) { message(e.message, true); } });
  document.querySelector('#import-json').addEventListener('change', async event => { try { const file = event.target.files[0]; if (!file) return; if (file.size > 2 * 1024 * 1024) throw new Error('Use a JSON file smaller than 2 MB.'); const imported = globalThis.PortfolioContract.validate(JSON.parse(await file.text())); if (dirty && !confirm('Replace your unsaved editor changes with this file?')) return; data = clone(imported); index = 0; markDirty(); paint(); preview(); message('JSON loaded. Review it, then download content.js.'); } catch (e) { message(e.message, true); } finally { event.target.value = ''; } });
  addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
  paint(); preview();
})();
