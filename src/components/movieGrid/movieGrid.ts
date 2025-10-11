import {
  getMovies,
  searchMovies,
  type MoviesResponse,
  type SearchResponse,
  type SearchMovie,
  getNextPage,
} from '../../api/movies.ts';
import type AsyncComponent from '../asyncComponent/asyncComponent.ts';
import { loadTemplate } from '../utils.ts';
import './style.css';
import InfiniteScrollObserver from './infiniteScrollObserver.ts';

class MovieGrid extends HTMLElement {
  private abortController: AbortController | null = null;
  private infiniteScrollObserver: InfiniteScrollObserver | null = null;
  private lastResponse: SearchResponse | MoviesResponse | null = null;
  private query: string = '';
  private hasNextPage: boolean = false;
  private allMovies: SearchMovie[] = [];

  constructor() {
    super();
  }

  async connectedCallback(): Promise<void> {
    const template = await loadTemplate('./template.html', import.meta.url);
    this.appendChild(template.content.cloneNode(true));
    this.infiniteScrollObserver = new InfiniteScrollObserver(
      '#infinite-scroll-observer',
      () => {
        this.loadNextPage();
      }
    );

    this.loadMovies();
  }

  async loadMovies(query: string = '', page: number = 1) {
    const moviesLoader = this.querySelector('#movies-loader') as AsyncComponent;
    if (!moviesLoader) return;

    const scrollContainer = document.querySelector('.search-results__content');

    const savedScrollTop =
      page > 1 && scrollContainer ? scrollContainer.scrollTop : 0;

    if (page === 1) {
      this.allMovies = [];
    }

    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();
    const timeoutSignal = AbortSignal.timeout(5000);

    const signal = AbortSignal.any([
      this.abortController.signal,
      timeoutSignal,
    ]);

    const apiCall = query
      ? searchMovies(signal, query, page)
      : getMovies(signal, page);

    moviesLoader.dataPromise = apiCall
      .then((response: MoviesResponse | SearchResponse) => {
        this.hasNextPage = response.hasNextPage;
        this.lastResponse = response;
        const newMovies =
          'movies' in response ? response.movies : response.results;

        this.allMovies = [...this.allMovies, ...newMovies];

        if (page > 1 && scrollContainer) {
          requestAnimationFrame(() => {
            scrollContainer.scrollTop = savedScrollTop;
          });
        }

        if (this.allMovies.length === 0) {
          return `<div class="movie-grid empty">
          <div class="movie-grid__item">
            <h3 class="movie-grid__title">영화를 찾을 수 없습니다.</h3>
          </div>
          </div>`;
        }

        return `
        <div class="movie-grid">
          ${this.allMovies
            .map(
              movie => `
            <div class="movie-grid__item">
              <img
                class="movie-grid__image"
                src="${movie.thumbnail}"
                alt="${movie.title}"
              />
              <h3 class="movie-grid__title">${movie.title}</h3>
            </div>
          `
            )
            .join('')}
        </div>
      `;
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          return '<div></div>';
        } else if (error.name === 'TimeoutError') {
          return `<div class="movie-grid empty">
            <div class="movie-grid__item">
                <h3 class="movie-grid__title">요청이 타임아웃되었습니다.</h3>
            </div>
          </div>`;
        }
      });
  }

  async loadNextPage() {
    if (!this.lastResponse || !this.hasNextPage) return;
    const nextPage = await getNextPage(
      this.lastResponse,
      this.abortController?.signal as AbortSignal,
      'movies',
      this.query
    );
    this.lastResponse = nextPage;

    if (
      nextPage &&
      this.hasNextPage &&
      nextPage.currentPage < nextPage.totalPages
    ) {
      this.loadMovies(this.query, nextPage.currentPage + 1);
    }
  }

  search(query: string) {
    this.query = query;
    this.loadMovies(query, 1);
  }
}

customElements.define('movie-grid', MovieGrid);

export default MovieGrid;
