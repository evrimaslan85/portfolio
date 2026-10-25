/* SPDX-License-Identifier: GPL-2.0-or-later */
(() => {
  'use strict';
  let counter = Date.now();
  document.addEventListener('click', event => {
    const add = event.target.closest('[data-cpf-add]');
    if (add) { const key = add.dataset.cpfAdd; const template = document.querySelector('template[data-cpf-template="' + key + '"]'); const html = template.innerHTML.replace(/__INDEX__/g, String(counter++)).replace(/__ID__/g, 'item-' + crypto.randomUUID()); document.querySelector('[data-cpf-list="' + key + '"]').insertAdjacentHTML('beforeend', html); }
    if (event.target.closest('[data-cpf-remove]')) event.target.closest('.cpf-row').remove();
    const media = event.target.closest('[data-cpf-media]');
    if (media && globalThis.wp?.media) {
      const frame = wp.media({ title: 'Choose project image', button: { text: 'Use image' }, library: { type: 'image' }, multiple: false });
      frame.on('select', () => { const file = frame.state().get('selection').first().toJSON(); const url = new URL(file.url, location.href); const row = media.closest('.cpf-row'); row.querySelector('[name$="[src]"]').value = url.origin === location.origin ? url.pathname.replace(/^\//, '') : file.url; if (!row.querySelector('[name$="[alt]"]').value) row.querySelector('[name$="[alt]"]').value = file.alt || file.title || ''; }); frame.open();
    }
  });
})();
