// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Toggle visibility of main content and search results: True->results, False->main content
function toggleContentView(showResults) {
  const mainSections = document.querySelectorAll('.main > section:not(.search_results_section)');
  const resultsSection = document.querySelector('.search_results_section');

  mainSections.forEach(section => {
    section.style.display = showResults ? 'none' : 'block'; // 또는 'flex' 등 원래 속성
  });
  resultsSection.style.display = showResults ? 'block' : 'none';
}


// Render search results to the page
function renderSearchResults(results, query) {
  const resultsSection = document.querySelector('.search_results_section');

  // show main content if query is empty
  if (query.trim() === '' ) {
    toggleContentView(false); // recover main content view
    resultsSection.innerHTML = '';
    return;
  }

  // hide main content and show results section
  toggleContentView(true); 

  const gridHTML = results.map(item => `
    <div class="movie_card1">
      <img src="${item.img}" alt="${item.title}">
      <h3>${item.title}</h3>
    </div>
  `).join('');

  resultsSection.innerHTML = `
    <h2 class="search_results_title">'${query}' 관련 콘텐츠</h2>
    <div class="results_grid">${gridHTML}</div>
  `;
}

// Perform search by querying the backend API - render results to page
async function performSearch(query) {
  if (!query || query.trim() === '') {
    renderSearchResults([], ''); // recover to main view if query is empty
    return;
  }

  // Express Server API URL
  const searchUrl = `http://localhost:3000/search?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(searchUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const results = await response.json();

    // render results to page
    renderSearchResults(results, query);
  } catch (error) {
    console.error('검색 중 오류가 발생했습니다:', error);
  }
}


/* Setup Search */
export function initSearch() {
  const searchButton = document.querySelector('.search_button');
  const searchInput = document.querySelector('.search_input');

  // 300ms debounced search function
  const debouncedSearch = debounce(performSearch, 500);

  // toggle search input visibility on button click
  searchButton.addEventListener('click', (event) => {
    event.stopPropagation();
    searchInput.classList.toggle('active');
    
    if (searchInput.classList.contains('active')) {
      searchInput.focus();
    }
  });

  // perfom debounced search on input
  searchInput.addEventListener('input', () => {
    debouncedSearch(searchInput.value);
  });

  // close search input when clicking outside and reset if needed
  document.addEventListener('click', (event) => {
    if (searchInput.classList.contains('active') && event.target !== searchInput) {
      searchInput.classList.remove('active');
      
      // recover main view if input had value
      if (searchInput.value) {
        searchInput.value = '';
        renderSearchResults([], '');
      }
    }
  });
}