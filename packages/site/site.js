/* SPDX-License-Identifier: MIT */
(() => {
  'use strict';
  const container = document.querySelector('[data-portfolio]');
  try { const content = globalThis.PORTFOLIO_CONTENT; document.title = content.title; document.documentElement.lang = content.locale; globalThis.PortfolioView.mount(container, content); }
  catch (error) { const message = document.createElement('p'); message.className = 'pf-error'; message.textContent = 'The portfolio could not be loaded: ' + error.message; container.replaceChildren(message); }
})();
