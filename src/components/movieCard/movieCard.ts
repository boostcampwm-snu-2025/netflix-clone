import { loadTemplate, loadStyle } from '../utils.ts';

interface MovieCardAttributes {
  src?: string;
  alt?: string;
  title?: string;
  rank?: string;
}

interface MovieDetailEvent extends CustomEvent {
  detail: {
    title: string;
  };
}

class MovieCard extends HTMLElement {
  private _pendingAttributes: MovieCardAttributes = {};

  static get observedAttributes(): string[] {
    return ['src', 'alt', 'title', 'rank'];
  }

  constructor() {
    super();
  }

  async connectedCallback(): Promise<void> {
    const template = await loadTemplate('./template.html', import.meta.url);
    const style = await loadStyle('./style.css', import.meta.url);
    document.head.appendChild(style);

    this.appendChild(template.content.cloneNode(true));

    this.updateAttributes(this._pendingAttributes);
    this._pendingAttributes = {};

    const movieCardElement = this.querySelector('.movie-card') as HTMLElement;
    movieCardElement?.addEventListener('click', () => {
      const title = this.getAttribute('title') || '';
      this.dispatchEvent(
        new CustomEvent('open-movie-detail', {
          detail: { title },
        }) as MovieDetailEvent
      );
    });
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ): void {
    const card = this.querySelector('.movie-card');
    if (card && newValue !== null) {
      this.updateAttributes({ [name]: newValue });
    } else if (newValue !== null) {
      this._pendingAttributes[name as keyof MovieCardAttributes] = newValue;
    }
  }

  updateAttributes(attrs: MovieCardAttributes = {}): void {
    const img = this.querySelector('.movie-card__image') as HTMLImageElement;
    const caption = this.querySelector('.movie-card__title') as HTMLElement;
    const rank = this.querySelector('.movie-card__rank') as HTMLElement;

    if ('src' in attrs && img) img.src = attrs.src || '';
    if ('alt' in attrs && img) img.alt = attrs.alt || '';
    if ('title' in attrs && caption) caption.textContent = attrs.title || '';
    if ('rank' in attrs && rank) rank.textContent = attrs.rank || '';
  }
}

customElements.define('movie-card', MovieCard);

export default MovieCard;
