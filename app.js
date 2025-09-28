import { initModal } from "./modules/modal.js";
import { initCarousel } from "./modules/carousel.js";
import { loadMovies } from "./modules/movieLoader.js";
import { initLikeButtons } from "./modules/like.js";
import { initBookmarkButtons } from "./modules/bookmark.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadMovies();
  initCarousel();
  initLikeButtons();
  initBookmarkButtons();
  initModal();
});
