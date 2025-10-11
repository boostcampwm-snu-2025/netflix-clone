import './components/spinner/spinner.ts';
import './components/suspenseContainer/suspenseContainer.ts';
import './components/asyncComponent/asyncComponent.ts';
import './components/movieGrid/movieGrid.ts';
import type MovieGrid from './components/movieGrid/movieGrid.ts';

function debounce(func: () => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<typeof func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector(
    '.search-input'
  ) as HTMLInputElement;
  const searchButton = document.querySelector(
    '.search-button'
  ) as HTMLButtonElement;
  const movieGrid = document.querySelector('movie-grid') as MovieGrid;

  if (!searchInput || !searchButton || !movieGrid) return;

  const handleSearch = debounce(() => {
    const query = searchInput.value.trim();
    movieGrid.search(query);
  }, 200);
  searchInput.addEventListener('input', handleSearch);
  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
});
