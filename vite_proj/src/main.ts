import "./styles/style.css";
import { initSlider } from "./components/Slider";
import { initSearchBar } from "./components/SearchBar";

const items_per_page = 6;

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll<HTMLElement>(".sliderWrapper").forEach((wrapper) => {
    initSlider(wrapper, items_per_page);
  });

  const searchContainer = document.querySelector(".navbar-secondary-element");
  if (searchContainer) initSearchBar(searchContainer);
});
