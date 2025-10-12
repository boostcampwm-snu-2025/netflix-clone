import { get_search_results } from "../api/fetchMovies";

// debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

export function initSearchBar(container: HTMLElement) {
  const button = container.querySelector(".navbar-search") as HTMLButtonElement;

  // create input
  const input = document.createElement("input");
  input.type = "text";
  input.className = "navbar-search-input";
  input.placeholder = "제목, 사람, 장르";
  container.appendChild(input);

  const homepage = document.querySelector(".homepage-content") as HTMLElement;
  const searchResults = document.querySelector(".search-results") as HTMLElement;
  const mainView = document.querySelector(".main-view") as HTMLElement;

  let lastQuery = "";

  // === Event listeners ===
  button.addEventListener("click", () => {
    container.classList.toggle("active");
    container.classList.contains("active") ? input.focus() : input.blur();
  });

  input.addEventListener("blur", () => container.classList.remove("active"));

  const debouncedSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      clearSearch();
      return;
    }
    await performSearch(query.trim());
  }, 250);

  input.addEventListener("input", () => debouncedSearch(input.value));

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") performSearch(input.value.trim());
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") clearSearch();
  });

  // === Inner functions ===
  async function performSearch(query: string) {
    if (query === lastQuery) return;
    lastQuery = query;

    homepage.classList.add("hidden");
    searchResults.classList.remove("hidden");
    mainView?.classList.add("hidden");

    searchResults.innerHTML = `<p class="loading">🔍 검색 중...</p>`;

    try {
      const movies = await get_search_results(query, 20);
      renderResults(movies);
    } catch (err: any) {
      searchResults.innerHTML = `<p>오류 발생: ${err.message}</p>`;
    }
  }

  function renderResults(movies: any[]) {
    searchResults.innerHTML = `
      <h2 class="row-header-title">검색 결과</h2>
      <div class="search-results-grid"></div>
    `;
    const grid = searchResults.querySelector(".search-results-grid") as HTMLElement;

    if (movies.length === 0) {
      grid.innerHTML = `<p>검색 결과가 없습니다.</p>`;
      return;
    }

    const fragment = document.createDocumentFragment();
    movies.forEach((m) => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `<img src="${m.image}" alt="${m.title}">`;
      fragment.appendChild(card);
    });
    grid.appendChild(fragment);
  }

  function clearSearch() {
    searchResults.classList.add("hidden");
    homepage.classList.remove("hidden");
    mainView?.classList.remove("hidden");
    input.value = "";
    lastQuery = "";
  }
}
