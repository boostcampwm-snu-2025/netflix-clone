import './style.css';
import { initHeaderMenus } from './menus';
import { initCarousels }   from './carousel';
import { initFavorites }   from './favorites';
import { renderSectionById } from './sections';
import { renderHero } from './hero';

import { initSearch } from './search/search';
import "./styles/search.css";

import { initSearchPage } from "./search/searchPage";
import "./styles/search-page.css";

async function bootstrap() {
  initFavorites();
  initHeaderMenus();

  initSearchPage();
  initSearch({ mount: "#search-root", dropdown: false });

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
