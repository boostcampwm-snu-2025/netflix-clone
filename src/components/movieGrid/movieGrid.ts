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
  private latestRequestId = 0;

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

    const requestId = ++this.latestRequestId;

    const apiCall = query ? searchMovies(query, page) : getMovies(page);

    moviesLoader.dataPromise = apiCall.then(
      (response: MoviesResponse | SearchResponse) => {
        const movies =
          'movies' in response ? response.movies : response.results;

        if (requestId !== this.latestRequestId) {
          return '';
        }

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
      }
    );
  }

  search(query: string) {
    this.loadMovies(query, 1);
  }
}

customElements.define('movie-grid', MovieGrid);

export default MovieGrid;
