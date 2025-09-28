import { initModal } from "./modules/modal.js";
import { initCarousel } from "./modules/carousel.js";
import { loadMovies } from "./modules/movieLoader.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadMovies();
  initCarousel();
  initModal();
});
