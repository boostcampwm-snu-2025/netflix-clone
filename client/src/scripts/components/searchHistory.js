const HISTORY_KEY = 'netflix-search-history';
const MAX_HISTORY = 5;

export function getSearchHistory() {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

export function addSearchHistory(query) {
  if (!query || !query.trim()) return;
  const q = query.trim();
  let history = getSearchHistory();
  history = history.filter(h => h !== q);
  history.unshift(q);
  history = history.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearSearchHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function renderSearchHistory(container, onSelect) {
  const history = getSearchHistory();
  container.innerHTML = '';
  
  if (history.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'search-history-empty';
    empty.textContent = '최근 검색 기록이 없습니다';
    container.appendChild(empty);
    return;
  }

  history.forEach(query => {
    const item = document.createElement('div');
    item.className = 'search-history-item';
    
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-clock-rotate-left';
    
    const text = document.createElement('span');
    text.textContent = query;
    
    item.appendChild(icon);
    item.appendChild(text);
    
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onSelect) onSelect(query);
    });
    
    container.appendChild(item);
  });
}
