import { getMovies, type MoviesResponse } from '../../api/movies.ts';
import type AsyncComponent from '../asyncComponent/asyncComponent.ts';
import { loadTemplate } from '../utils.ts';
import './style.css';

class MovieGrid extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback(): Promise<void> {
    const template = await loadTemplate('./template.html', import.meta.url);
    this.appendChild(template.content.cloneNode(true));

    this.loadMovies();
  }

  async loadMovies() {
    const moviesLoader = this.querySelector('#movies-loader') as AsyncComponent;
    if (!moviesLoader) return;
    moviesLoader.dataPromise = getMovies().then((response: MoviesResponse) => {
      return `
        <div class="movie-grid">
          ${response.movies
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
    });
  }
}

customElements.define('movie-grid', MovieGrid);

export default MovieGrid;
