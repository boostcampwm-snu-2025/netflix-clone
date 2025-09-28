import AsyncComponent from '../asyncComponent/asyncComponent';
import { getTrendingMovies } from '../../api/getMovies';
import type { Movie } from '../../api/getMovies';

class MovieList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <suspense-container>
        <div slot="fallback" class="top-contents__container">
        <arrow-button direction="left"></arrow-button>
        <ol class="top-contents__list">
          ${Array.from({ length: 10 })
            .map(() => '<movie-skeleton-card></movie-skeleton-card>')
            .join('')}
          </ol>
        <arrow-button direction="right"></arrow-button>
        </div>
        <async-component slot="content" id="movies-loader"></async-component>
      </suspense-container>
    `;

    this.loadMovies();
  }

  async loadMovies() {
    const moviesLoader = this.querySelector('#movies-loader') as AsyncComponent;
    if (!moviesLoader) return;

    moviesLoader.dataPromise = getTrendingMovies().then((movies: Movie[]) => {
      return `
        <div class="top-contents__container">
        <arrow-button direction="left"></arrow-button>
          <ol class="top-contents__list">
            ${movies
              .map(
                (movie, idx) => `
                  <li class="top-contents__item">
                    <movie-card
                      src="${movie.thumbnail}"
                      alt="${movie.title}"
                      title="${movie.title}"
                      rank="${idx + 1}"
                    ></movie-card>
                  </li>`
              )
              .join('')}
          </ol>
          <arrow-button direction="right"></arrow-button>
        </div>
      `;
    });
  }
}

customElements.define('movie-list', MovieList);

export default MovieList;
