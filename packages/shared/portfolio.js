/* SPDX-License-Identifier: MIT */
(function (root) {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function mount(container, content) {
    root.PortfolioContract.validate(content);
    container._portfolioEvents?.abort();
    container._portfolioEvents = new AbortController();
    const previous = container.querySelector('dialog'); if (previous?.open) previous.close();
    const projects = content.projects;
    const options = key => [...new Map(projects.flatMap(p => p[key]).map(item => [item.id, item.label]))].sort((a, b) => a[1].localeCompare(b[1])).map(([id, label]) => `<option value="${esc(id)}">${esc(label)}</option>`).join('');
    container.classList.add('portfolio-app');
    container.innerHTML = `<header class="pf-heading"><p class="pf-eyebrow">Selected work</p><h1>${esc(content.title)}</h1><p>${esc(content.summary)}</p></header><div class="pf-filters"><label>System<select data-pf-system><option value="">All systems</option>${options('systems')}</select></label><label>Technology<select data-pf-tech><option value="">All technologies</option>${options('technologies')}</select></label><p data-pf-count role="status" aria-live="polite"></p></div><div class="pf-grid" data-pf-grid></div><dialog class="pf-dialog" aria-label="Project case study"><div class="pf-dialog-tools"><button type="button" data-pf-print>Print</button><button type="button" data-pf-close autofocus>Close ×</button></div><article data-pf-detail></article></dialog>`;
    const dialog = container.querySelector('dialog'); let trigger;
    const evidence = (p, ids) => ids.map(id => p.evidence.find(e => e.id === id)).filter(Boolean).map(e => `<figure class="pf-evidence">${e.type === 'image' ? `<img loading="lazy" src="${esc(e.src)}" alt="${esc(e.alt)}">` : ''}<figcaption><a href="${esc(e.src)}" target="_blank" rel="noopener noreferrer">${esc(e.title)} ↗</a>${e.caption ? `<p>${esc(e.caption)}</p>` : ''}</figcaption></figure>`).join('');
    const paragraph = text => text ? `<p>${esc(text).replace(/\n/g, '<br>')}</p>` : '';
    function render() {
      const system = container.querySelector('[data-pf-system]').value, tech = container.querySelector('[data-pf-tech]').value;
      const visible = projects.filter(p => (!system || p.systems.some(x => x.id === system)) && (!tech || p.technologies.some(x => x.id === tech)));
      container.querySelector('[data-pf-count]').textContent = visible.length + (visible.length === 1 ? ' project' : ' projects');
      container.querySelector('[data-pf-grid]').innerHTML = visible.map(p => {
        const cover = p.evidence.find(e => e.type === 'image');
        return `<article class="pf-card">${cover ? `<img class="pf-cover" loading="lazy" src="${esc(cover.src)}" alt="${esc(cover.alt)}">` : `<div class="pf-card-mark" aria-hidden="true">${esc(p.title.slice(0, 1))}</div>`}<div class="pf-card-body"><p class="pf-eyebrow">${esc(p.systems.map(s => s.label).join(' / ') || 'Project')} · ${esc(p.status)}</p><h2>${esc(p.title)}</h2>${paragraph(p.summary)}<div class="pf-tags">${p.technologies.map(t => `<span>${esc(t.label)}</span>`).join('')}</div><button class="pf-project-link" type="button" data-pf-open="${esc(p.id)}">Read case study <span aria-hidden="true">↗</span></button></div></article>`;
      }).join('') || '<p class="pf-empty">No projects match these filters.</p>';
    }
    function open(id) {
      const p = projects.find(item => item.id === id); if (!p) return;
      trigger = document.activeElement;
      const section = s => s.body ? `<section class="pf-section"><h2>${esc(s.title)}</h2>${paragraph(s.body)}${evidence(p, s.evidenceIds)}</section>` : '';
      const graph = p.architecture.nodes.length ? `<section class="pf-section"><h2>How the system works</h2><ol class="pf-nodes">${p.architecture.nodes.map(n => `<li>${esc(n.label)}</li>`).join('')}</ol><ul>${p.architecture.edges.map(e => `<li>${esc(p.architecture.nodes.find(n => n.id === e.from).label)} → ${esc(p.architecture.nodes.find(n => n.id === e.to).label)}${e.label ? ': ' + esc(e.label) : ''}</li>`).join('')}</ul></section>` : '';
      container.querySelector('[data-pf-detail]').innerHTML = `<header class="pf-heading"><p class="pf-eyebrow">${esc(p.status)}${p.client ? ' / ' + esc(p.client.displayName) : ''}</p><h1>${esc(p.title)}</h1>${paragraph(p.summary)}</header>${section(p.sections.overview)}${section(p.sections.challenge)}${section(p.sections.solution)}${graph}${p.implementations.length ? `<section class="pf-section"><h2>What we built</h2>${p.implementations.map(i => `<details><summary>${esc(i.title)}</summary>${paragraph(i.summary)}${paragraph(i.details)}${evidence(p, i.evidenceIds)}</details>`).join('')}</section>` : ''}${section(p.sections.outcomes)}${p.results.length ? `<section class="pf-section"><h2>Outcomes, with context</h2><div class="pf-results">${p.results.map(r => `<article><p class="pf-eyebrow">${esc(r.provenance)}</p><strong>${esc(r.value)}</strong><h3>${esc(r.label)}</h3>${paragraph(r.context)}${evidence(p, r.evidenceIds)}</article>`).join('')}</div></section>` : ''}${p.evidence.length ? `<section class="pf-section"><h2>Evidence</h2>${evidence(p, p.evidence.map(e => e.id))}</section>` : ''}`;
      dialog.showModal(); dialog.scrollTop = 0;
    }
    container.querySelector('[data-pf-system]').addEventListener('change', render); container.querySelector('[data-pf-tech]').addEventListener('change', render);
    container.addEventListener('click', event => { const button = event.target.closest('[data-pf-open]'); if (button && container.contains(button)) open(button.dataset.pfOpen); }, { signal: container._portfolioEvents.signal });
    container.querySelector('[data-pf-close]').addEventListener('click', () => dialog.close());
    container.querySelector('[data-pf-print]').addEventListener('click', () => root.print());
    dialog.addEventListener('close', () => { if (trigger?.isConnected) trigger.focus(); });
    render(); return { open };
  }
  root.PortfolioView = { mount, escape: esc };
})(globalThis);
