/* SPDX-License-Identifier: MIT */
(() => {
  'use strict';
  const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  document.querySelector('#make-embed').addEventListener('click', () => {
    const status = document.querySelector('#embed-status');
    try {
      const url = new URL(document.querySelector('#embed-url').value.trim());
      if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Enter your hosted HTTPS address without login credentials.');
      const height = Number(document.querySelector('#embed-height').value);
      if (!Number.isInteger(height) || height < 300 || height > 5000) throw new Error('Choose a height from 300 to 5000 pixels.');
      document.querySelector('#embed-code').value = '<iframe src="' + esc(url.href) + '" title="Project portfolio" width="100%" height="' + height + '" style="border:0;display:block;width:100%;" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      status.textContent = 'Embed code ready. Copy it into your platform’s supported HTML or embed block. No request has been sent to that address.';
    } catch (error) { document.querySelector('#embed-code').value = ''; status.textContent = error.message; }
  });
})();
