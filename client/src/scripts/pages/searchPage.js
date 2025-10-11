import { loadSearchResults } from '../api/loadData.js';

/**
 * Render search results page
 * @param {Object} ctx - Router context with query params
 */
export function renderSearchPage(ctx) {
  // Hide hero on search route
  const hero = document.querySelector('.hero-container');
  if (hero) {
    hero.innerHTML = '';
    hero.classList.add('is-hidden');
  }

  const recContainer = document.querySelector('.recommendation-container');
  if (recContainer) recContainer.innerHTML = '';

  const q = (ctx?.query?.q || ctx?.query?.query || '').trim();

  // Loading placeholder
  const loading = document.createElement('p');
  loading.style.padding = '80px 40px';
  loading.textContent = q ? `"${q}" 검색 중…` : '검색 중…';
  (recContainer || document.querySelector('main')).appendChild(loading);

  loadSearchResults({ q }).then(results => {
    // Clear placeholder
    loading.remove();

    const container = document.querySelector('.recommendation-container') || document.querySelector('main');
    if (!container) return;

    // Title
    const titleEl = document.createElement('p');
    titleEl.className = 'section-title';
    titleEl.textContent = q ? `검색 결과 (${results.length}개)` : '검색 결과';
    container.appendChild(titleEl);

    if (!results || results.length === 0) {
      const empty = document.createElement('p');
      empty.style.padding = '20px 10px';
      empty.textContent = '검색 결과가 없습니다.';
      container.appendChild(empty);
      return;
    }

    // Grid container
    const grid = document.createElement('div');
    grid.className = 'search-grid';
    results.forEach((r, i) => {
      const card = document.createElement('div');
      card.className = 'recommendation-item';
      const img = document.createElement('img');
      img.src = r.image || '';
      img.alt = r.name || `Result ${i + 1}`;
      card.appendChild(img);
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }).catch(err => {
    loading.textContent = '검색 중 오류가 발생했습니다.';
    console.error('Search error:', err);
  });
}
