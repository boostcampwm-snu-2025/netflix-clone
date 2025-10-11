import { loadData } from './api/loadData.js';
import { initCarousels } from './carousel.js';
import { initMuteButton } from './mute.js';
import { renderHero, renderRecommendations, renderNotifications } from './render.js';
import { initHoverPreview } from './hoverPreview.js';

async function initializeApp() {
  try {
    const data = await loadData();
    renderHero(data.hero);
    renderRecommendations(data.recommendations);
    renderNotifications(data.notifications);
    initHoverPreview();
    initCarousels();
    initMuteButton();
  } catch (e) {
    console.error('Failed to initialize app:', e);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await initializeApp();
});
