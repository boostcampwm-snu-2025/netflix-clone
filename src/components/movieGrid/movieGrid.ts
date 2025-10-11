import {
  getMovies,
  searchMovies,
  type MoviesResponse,
  type SearchResponse,
} from '../../api/movies.ts';
import type AsyncComponent from '../asyncComponent/asyncComponent.ts';
import { loadTemplate } from '../utils.ts';
import './style.css';

class MovieGrid extends HTMLElement {
  private abortController: AbortController | null = null;
  constructor() {
    super();
  }

  async connectedCallback(): Promise<void> {
    const template = await loadTemplate('./template.html', import.meta.url);
    this.appendChild(template.content.cloneNode(true));

    this.loadMovies();
  }

  async loadMovies(query: string = '', page: number = 1) {
    const moviesLoader = this.querySelector('#movies-loader') as AsyncComponent;
    if (!moviesLoader) return;

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
        const movies =
          'movies' in response ? response.movies : response.results;

        if (movies.length === 0) {
          return `<div class="movie-grid empty">
          <div class="movie-grid__item">
            <h3 class="movie-grid__title">영화를 찾을 수 없습니다.</h3>
          </div>
          </div>`;
        }

        return `
        <div class="movie-grid">
          ${movies
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
        console.log(error.name);
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

  search(query: string) {
    this.loadMovies(query, 1);
  }
}

customElements.define('movie-grid', MovieGrid);

export default MovieGrid;
