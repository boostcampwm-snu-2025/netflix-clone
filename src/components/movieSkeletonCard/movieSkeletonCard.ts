import { loadTemplate } from '../utils.ts';
import './style.css';

class MovieSkeletonCard extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback(): Promise<void> {
    const template = await loadTemplate('./template.html', import.meta.url);
    this.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('movie-skeleton-card', MovieSkeletonCard);

export default MovieSkeletonCard;
