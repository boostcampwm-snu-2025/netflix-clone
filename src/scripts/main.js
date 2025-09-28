import { loadData } from './api/loadData.js';
import { initCarousels } from './carousel.js';
import { initMuteButton } from './mute.js';
import { renderHero, renderRecommendations, renderNotifications } from './render.js';

async function initializeApp() {
  try {
    const data = await loadData();
    renderHero(data.hero);
    renderRecommendations(data.recommendations);
    renderNotifications(data.notifications);
    initCarousels();
    initMuteButton();
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await initializeApp();
});
