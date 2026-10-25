/* SPDX-License-Identifier: MIT */
(() => {
  'use strict';
  const data = globalThis.PORTFOLIO_EXAMPLE;
  const grid = document.querySelector('#project-grid');
  const systemSelect = document.querySelector('#system-filter');
  const technologySelect = document.querySelector('#technology-filter');
  const dialog = document.querySelector('#project-dialog');
  const detail = document.querySelector('#project-detail');
  let previousFocus = null;

  // Bundled fictional data only. This preview has no user-content import route.
  const esc = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId = (items, id) => items.find(item => item.id === id);
  const evidenceLinks = (project, ids) => ids.map(id => byId(project.evidence, id)).filter(Boolean).map(item => `<a class="evidence-link" href="../examples/${esc(item.src)}" target="_blank" rel="noopener noreferrer">${esc(item.title)} ↗<span>${esc(item.caption)}</span></a>`).join('');

  function populateFilter(select, field) {
    const labels = new Map();
    data.projects.forEach(project => project[field].forEach(item => labels.set(item.id, item.label)));
    [...labels].sort((a, b) => a[1].localeCompare(b[1])).forEach(([id, label]) => {
      const option = document.createElement('option'); option.value = id; option.textContent = label; select.append(option);
    });
  }

  function artwork(project) {
    const kind = project.systems[0]?.id || 'workflow';
    if (kind === 'reporting') return '<div class="mini-report"><span></span><span></span><span></span><span></span></div>';
    if (kind === 'knowledge') return '<div class="mini-doc"><span></span><span></span><span></span><span></span></div>';
    return '<div class="mini-flow"><span class="mini-node">Request</span><span class="mini-arrow">→</span><span class="mini-node">Review</span><span class="mini-arrow">→</span><span class="mini-node">Delivery</span></div>';
  }

  function render() {
    const visible = data.projects.filter(project =>
      (!systemSelect.value || project.systems.some(item => item.id === systemSelect.value)) &&
      (!technologySelect.value || project.technologies.some(item => item.id === technologySelect.value))
    );
    document.querySelector('#result-count').textContent = `${visible.length} ${visible.length === 1 ? 'project' : 'projects'}`;
    grid.innerHTML = visible.length ? visible.map(project => `<article class="project-card">
      <div class="card-art" data-kind="${esc(project.systems[0]?.id || 'workflow')}" aria-hidden="true">${artwork(project)}<span class="art-label">Illustrative system / ${esc(project.id.replace('sample-', ''))}</span></div>
      <div class="card-body"><div class="card-kicker"><span>${esc(project.systems[0]?.label || 'Project')}</span><span>Concept</span></div><h3>${esc(project.title)}</h3><p>${esc(project.summary)}</p><div class="tags">${project.technologies.map(item => `<span class="tag">${esc(item.label)}</span>`).join('')}</div><button class="card-link" type="button" data-project-id="${esc(project.id)}" aria-label="Read case study: ${esc(project.title)}">Read the case study <span aria-hidden="true">↗</span></button></div>
    </article>`).join('') : '<p class="empty-state">No projects match these filters. Try another system or technology.</p>';
  }

  function section(project, value) {
    if (!value.body.trim()) return '';
    return `<section class="detail-section"><h3>${esc(value.title)}</h3><p>${esc(value.body)}</p>${evidenceLinks(project, value.evidenceIds)}</section>`;
  }

  function openProject(id) {
    const project = byId(data.projects, id);
    if (!project) return;
    const nodes = project.architecture.nodes;
    const architecture = nodes.length ? `<section class="detail-section"><h3>How the pieces connect</h3><ol class="architecture-nodes">${nodes.map(node => `<li>${esc(node.label)}</li>`).join('')}</ol><ul class="architecture-edges">${project.architecture.edges.map(edge => `<li>${esc(byId(nodes, edge.from).label)} → ${esc(byId(nodes, edge.to).label)}: ${esc(edge.label)}</li>`).join('')}</ul></section>` : '';
    const implementations = project.implementations.length ? `<section class="detail-section"><h3>What we built</h3>${project.implementations.map(item => `<details><summary>${esc(item.title)}</summary><p>${esc(item.summary)}</p><p>${esc(item.details)}</p>${evidenceLinks(project, item.evidenceIds)}</details>`).join('')}</section>` : '';
    const results = project.results.length ? `<section class="detail-section"><h3>Outcomes, with context</h3>${project.results.map(item => `<div class="result-card"><p class="eyebrow">${esc(item.provenance)} outcome</p><strong class="result-value">${esc(item.value)}</strong><strong>${esc(item.label)}</strong><p>${esc(item.context)}</p>${evidenceLinks(project, item.evidenceIds)}</div>`).join('')}</section>` : '';
    detail.innerHTML = `<header class="detail-intro"><p class="eyebrow">Fictional project / ${esc(project.status)}</p><h2 id="detail-title">${esc(project.title)}</h2><p>${esc(project.summary)}</p><div class="tags">${project.technologies.map(item => `<span class="tag">${esc(item.label)}</span>`).join('')}</div></header>${section(project, project.sections.overview)}${section(project, project.sections.challenge)}${section(project, project.sections.solution)}${architecture}${implementations}${section(project, project.sections.outcomes)}${results}<p class="detail-disclaimer">This is an original fictional example. It is not customer evidence, a live integration, or a measured product result.</p>`;
    previousFocus = document.activeElement;
    dialog.showModal(); dialog.scrollTop = 0;
  }

  document.querySelectorAll('[data-mode-button]').forEach(button => button.addEventListener('click', () => {
    document.body.dataset.mode = button.dataset.modeButton;
    document.querySelectorAll('[data-mode-button]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#form-explanation').textContent = button.dataset.modeButton === 'wordpress' ? 'A Work section inside an existing WordPress website.' : 'An independent portfolio site, published without WordPress.';
  }));
  systemSelect.addEventListener('change', render);
  technologySelect.addEventListener('change', render);
  grid.addEventListener('click', event => { const button = event.target.closest('[data-project-id]'); if (button) openProject(button.dataset.projectId); });
  document.querySelector('#close-project').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { if (previousFocus?.isConnected) previousFocus.focus(); });
  document.querySelector('#print-project').addEventListener('click', () => globalThis.print());
  populateFilter(systemSelect, 'systems'); populateFilter(technologySelect, 'technologies'); render();
})();
