import './styles/style.css';
import { fetch_movies_for_row } from './api/fetchMovies';
import { Slider } from './components/Slider';

const items_per_page = 6;

// ✅ Everything initializes here
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll<HTMLElement>(".sliderWrapper").forEach(wrapper => {
    const slider_content = wrapper.querySelector(".sliderContent") as HTMLElement;
    fetch_movies_for_row(slider_content, items_per_page * 3).then(() => {
      new Slider(wrapper, items_per_page);
    });
  });
});
