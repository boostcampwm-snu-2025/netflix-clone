// /js/app.js
import { initHeaderMenus } from './menus.js';
import { initCarousels }   from './carousel.js';

const boot = () => {
  initHeaderMenus();
  initCarousels();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
