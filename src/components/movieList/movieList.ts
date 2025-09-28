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
                .map(
                  () => `
                    <li class="top-contents__item">
                      <movie-skeleton-card></movie-skeleton-card>
                    </li>`
                )
                .join('')}
            </ol>
            <arrow-button direction="right"></arrow-button>
          </div>
  
          <async-component slot="content" id="movies-loader">
            <div class="top-contents__container">
              <arrow-button direction="left"></arrow-button>
              <ol class="top-contents__list" id="movies-list"></ol>
              <arrow-button direction="right"></arrow-button>
            </div>
          </async-component>
        </suspense-container>
      `;

    this.loadMovies();
  }

  async loadMovies() {
    const moviesLoader = this.querySelector('#movies-loader') as AsyncComponent;

    if (!moviesLoader) return;

    const moviesPromise = getTrendingMovies().then(movies => {
      this.renderMovies(movies);
      return movies;
    });

    moviesLoader.dataPromise = moviesPromise;
  }

  renderMovies(movies: Movie[]) {
    const moviesList = this.querySelector('#movies-list');
    if (!moviesList) return;

    moviesList.innerHTML = movies
      .map(
        (movie, idx) => `
          <li class="top-contents__item">
            <movie-card 
              src="${movie.thumbnail}" 
              alt="${movie.title}" 
              title="${movie.title}" 
              rank="${idx + 1}">
            </movie-card>
          </li>`
      )
      .join('');
  }
}

customElements.define('movie-list', MovieList);

export default MovieList;
