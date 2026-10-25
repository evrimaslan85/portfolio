/* SPDX-License-Identifier: GPL-2.0-or-later */
document.querySelectorAll('[data-cpf-gallery]').forEach(gallery => {
  function filter() { const system = gallery.querySelector('[data-cpf-filter="system"]').value, tech = gallery.querySelector('[data-cpf-filter="tech"]').value; let count = 0; gallery.querySelectorAll('.pf-card').forEach(card => { card.hidden = Boolean((system && !card.dataset.cpfSystem.split(' ').includes(system)) || (tech && !card.dataset.cpfTech.split(' ').includes(tech))); if (!card.hidden) count++; }); gallery.querySelector('[data-cpf-count]').textContent = count + (count === 1 ? ' project' : ' projects'); gallery.querySelector('[data-cpf-empty]').hidden = count > 0; }
  gallery.querySelectorAll('select').forEach(select => select.addEventListener('change', filter));
});
