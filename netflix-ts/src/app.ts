import './style.css';
import { initHeaderMenus } from './menus';
import { initCarousels }   from './carousel';
import { initFavorites }   from './favorites';
import { renderSectionById } from './sections';
import { renderHero } from './hero';

async function bootstrap() {
  initFavorites();
  initHeaderMenus();

  await renderHero();

  await Promise.all([
    renderSectionById('recommend',     '/data/recommend.json'),
    renderSectionById('lovely-videos', '/data/lovely-videos.json'),
    renderSectionById('top10-series',  '/data/top10-series.json'),
  ]);

  initCarousels();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
