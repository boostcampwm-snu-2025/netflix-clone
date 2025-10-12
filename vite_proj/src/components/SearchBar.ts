import { get_search_results } from "../api/fetchMovies";

export class SearchBar {
  private button: HTMLButtonElement;
  private input: HTMLInputElement;
  private container: HTMLElement;
  private searchResults: HTMLElement | null;
  private homepage: HTMLElement | null;
  private mainView: HTMLElement | null; // ✅ new line

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
    this.mainView = document.querySelector(".main-view"); // ✅ add reference

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

    // Press Enter to trigger search
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = this.input.value.trim();
        console.log("⏎ Enter pressed with query:", query);
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

    if (query === "") {
      this.clearSearch();
      return;
    }

    // Show loading placeholder
    this.searchResults.innerHTML = `<p class="loading">🔍 검색 중...</p>`;
    this.homepage.classList.add("hidden");
    this.searchResults.classList.remove("hidden");
    if (this.mainView) this.mainView.classList.add("hidden"); // ✅ hide main-view

    try {
      const movies = await get_search_results(query, 20);
      console.log(`✅ Received ${movies.length} results`);
      this.renderResults(movies);
    } catch (err: any) {
      console.error("❌ Search error:", err.message);
      this.searchResults.innerHTML = `<p>오류 발생: ${err.message}</p>`;
    }
  }

  private renderResults(movies: any[]) {
    if (!this.searchResults) return;

    this.searchResults.innerHTML = `
      <h2 class="row-header-title">검색 결과</h2>
      <div class="search-results-grid"></div>
    `;

    const grid = this.searchResults.querySelector(".search-results-grid") as HTMLElement;

    if (movies.length === 0) {
      grid.innerHTML = `<p>검색 결과가 없습니다.</p>`;
      return;
    }

    movies.forEach((movie) => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}">
      `;
      grid.appendChild(card);
    });
  }

  private clearSearch() {
    if (!this.searchResults || !this.homepage) return;

    this.searchResults.classList.add("hidden");
    this.homepage.classList.remove("hidden");
    if (this.mainView) this.mainView.classList.remove("hidden"); // ✅ show it again
    this.input.value = "";
  }
}
