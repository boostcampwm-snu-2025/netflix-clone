import { renderSearchHistory, addSearchHistory } from './components/searchHistory.js';

export function initSearchToggle() {
  const search = document.querySelector('.header .user-menu .search');
  if (!search) return;

  const pop = search.querySelector('.search-pop');
  const input = search.querySelector('.search-input');
  const icon = search.querySelector('.search-icon');
  const historyContainer = search.querySelector('.search-history');
  if (!pop || !input || !icon) return;

  const showHistory = () => {
    if (historyContainer) {
      historyContainer.classList.add('is-visible');
      renderSearchHistory(historyContainer, (query) => {
        input.value = query;
        window.location.href = `#/search?query=${encodeURIComponent(query)}`;
        addSearchHistory(query);
        close();
      });
    }
  };

  const hideHistory = () => {
    if (historyContainer) {
      historyContainer.classList.remove('is-visible');
    }
  };

  const open = () => {
    search.classList.add('is-open');
    requestAnimationFrame(() => {
      input.focus();
      const val = input.value;
      input.value = '';
      input.value = val;
      showHistory();
    });
  };

  const close = () => {
    search.classList.remove('is-open');
    hideHistory();
  };

  const toggle = () => {
    if (search.classList.contains('is-open')) close();
    else open();
  };

  const onActivatorClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  icon.addEventListener('click', onActivatorClick);
  search.addEventListener('click', onActivatorClick);

  pop.addEventListener('click', (e) => e.stopPropagation());

  document.addEventListener('click', () => {
    if (search.classList.contains('is-open')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = input.value.trim();
      if (query) {
        addSearchHistory(query);
        window.location.href = `#/search?query=${encodeURIComponent(query)}`;
        close();
      }
    } else if (e.key === 'ArrowDown') {
      if (historyContainer && historyContainer.classList.contains('is-visible')) {
        const firstItem = historyContainer.querySelector('.search-history-item');
        if (firstItem) {
          e.preventDefault();
          firstItem.focus();
        }
      }
    }
  });

  input.addEventListener('focus', showHistory);
  input.addEventListener('input', () => {
    if (input.value.trim() === '') {
      showHistory();
    } else {
      hideHistory();
    }
  });

  if (historyContainer) {
    historyContainer.addEventListener('keydown', (e) => {
      const items = Array.from(historyContainer.querySelectorAll('.search-history-item'));
      const currentIndex = items.indexOf(document.activeElement);
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentIndex < items.length - 1) {
          items[currentIndex + 1].focus();
        } else {
          items[0].focus();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) {
          items[currentIndex - 1].focus();
        } else {
          input.focus();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (document.activeElement && document.activeElement.classList.contains('search-history-item')) {
          document.activeElement.click();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        input.focus();
      }
    });
  }
}
