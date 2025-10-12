import { get_search_results } from "../api/fetchMovies";

// ✅ simple debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

export class SearchBar {
  private button: HTMLButtonElement;
  private input: HTMLInputElement;
  private container: HTMLElement;
  private searchResults: HTMLElement | null;
  private homepage: HTMLElement | null;
  private mainView: HTMLElement | null;
  private lastQuery: string = "";

  constructor(container: HTMLElement) {
    this.container = container;
    this.button = container.querySelector(".navbar-search") as HTMLButtonElement;

    // Create search input dynamically
    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.className = "navbar-search-input";
    this.input.placeholder = "제목, 사람, 장르";
    this.container.appendChild(this.input);

    // Reference to homepage + search section + main view
    this.homepage = document.querySelector(".homepage-content");
    this.searchResults = document.querySelector(".search-results");
    this.mainView = document.querySelector(".main-view");

    this.addListeners();
  }

  private addListeners() {
    // Toggle search bar
    this.button.addEventListener("click", () => {
      this.container.classList.toggle("active");
      if (this.container.classList.contains("active")) {
        this.input.focus();
      } else {
        this.input.blur();
      }
    });

    this.input.addEventListener("blur", () => {
      this.container.classList.remove("active");
    });

    // ✅ Debounced live search
    const debouncedSearch = debounce((query: string) => {
      if (query.trim() === "") {
        this.clearSearch();
        return;
      }
      this.performSearch(query.trim());
    }, 400);

    this.input.addEventListener("input", (e) => {
      const query = this.input.value;
      debouncedSearch(query);
    });

    // ✅ Optional instant search on Enter
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = this.input.value.trim();
        this.performSearch(query);
      }
    });

    // ESC key exits search mode
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.clearSearch();
      }
    });
  }

  private async performSearch(query: string) {
    if (!this.searchResults || !this.homepage) return;
    if (query === this.lastQuery) return; // ✅ prevent duplicate calls
    this.lastQuery = query;

    this.searchResults.innerHTML = `<p class="loading">🔍 검색 중...</p>`;
    this.homepage.classList.add("hidden");
    this.searchResults.classList.remove("hidden");
    if (this.mainView) this.mainView.classList.add("hidden");

    try {
      const movies = await get_search_results(query, 20);
      this.renderResults(movies);
    } catch (err: any) {
      console.error("❌ Search error:", err.message);
      this.searchResults.innerHTML = `<p>오류 발생: ${err.message}</p>`;
    }
  }

  private renderResults(sections: any[]) {
    if (!this.searchResults) return;

    this.searchResults.innerHTML = `
      <h2 class="row-header-title">검색 결과</h2>
      <div class="search-results-sections"></div>
    `;

    const wrapper = this.searchResults.querySelector(".search-results-sections") as HTMLElement;

    if (sections.length === 0) {
      wrapper.innerHTML = `<p>검색 결과가 없습니다.</p>`;
      return;
    }

    sections.forEach((section) => {
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "search-section";
      sectionDiv.innerHTML = `
        <h3 class="search-section-title">${section.title}</h3>
        <div class="search-results-grid"></div>
      `;

      const grid = sectionDiv.querySelector(".search-results-grid") as HTMLElement;

      section.results.forEach((movie: any) => {
        const card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML = `<img src="${movie.image}" alt="${movie.title}">`;
        grid.appendChild(card);
      });

      wrapper.appendChild(sectionDiv);
    });
  }

  private clearSearch() {
    if (!this.searchResults || !this.homepage) return;
    this.searchResults.classList.add("hidden");
    this.homepage.classList.remove("hidden");
    if (this.mainView) this.mainView.classList.remove("hidden");
    this.input.value = "";
    this.lastQuery = "";
  }
}
