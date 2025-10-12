import { loadData } from './api/loadData.js';
import { initCarousels } from './carousel.js';
import { initMuteButton } from './mute.js';
import { renderHero, renderRecommendations, renderNotifications } from './render.js';
import { initHoverPreview } from './hoverPreview.js';
import { initSearchToggle } from './search.js';
import { initRouter } from './router.js';
import { renderSearchPage } from './pages/searchPage.js';

async function initializeApp() {

  const hero = document.querySelector('.hero-container');
  const rec = document.querySelector('.recommendation-container');
  if (hero) {
    hero.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;"><p style="font-size:24px;color:#fff;">콘텐츠를 불러오는 중...</p></div>';
  }

  try {
    const data = await loadData();
    const renderHome = () => {
      const mainEl = document.querySelector('main');
      if (!mainEl) return;
      const hero = document.querySelector('.hero-container');
      const rec = document.querySelector('.recommendation-container');
      if (hero) { hero.classList.remove('is-hidden'); hero.innerHTML = ''; }
      if (rec) rec.innerHTML = '';
      renderHero(data.hero);
      renderRecommendations(data.recommendations);
      initHoverPreview();
      initCarousels();
      initMuteButton();
    };

    initRouter({
      '#/': renderHome,
      '#/search': renderSearchPage,
      '#/404': renderHome,
    });

    renderNotifications(data.notifications);
    initSearchToggle();
  } catch (e) {
    console.error('Failed to initialize app:', e);
    if (hero) {
      hero.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;"><p style="font-size:24px;color:#fff;">콘텐츠를 불러오는 중 오류가 발생했습니다.</p></div>';
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await initializeApp();
});
