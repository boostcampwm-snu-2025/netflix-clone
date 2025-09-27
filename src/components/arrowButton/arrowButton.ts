import { loadTemplate, loadStyle } from '../utils.ts';

type ArrowDirection = 'left' | 'right';

class ArrowButton extends HTMLElement {
  private _pendingDirection: ArrowDirection | null = null;

  static get observedAttributes(): string[] {
    return ['direction'];
  }

  constructor() {
    super();
  }

  async connectedCallback(): Promise<void> {
    const template = await loadTemplate('./template.html', import.meta.url);
    const style = await loadStyle('./style.css', import.meta.url);
    document.head.appendChild(style);

    this.appendChild(template.content.cloneNode(true));

    if (this._pendingDirection) {
      const button = this.querySelector('.arrow-button') as HTMLButtonElement;
      if (button) {
        button.setAttribute('direction', this._pendingDirection);
        this._pendingDirection = null;
      }
    }

    const arrowButton = this.querySelector(
      '.arrow-button'
    ) as HTMLButtonElement;
    arrowButton?.addEventListener('click', () => {
      this.scrollMovieCards();
    });
  }

  scrollMovieCards(): void {
    const direction = this.getAttribute('direction') as ArrowDirection;
    const container = this.closest('.top-contents__container') as HTMLElement;
    const movieList = container?.querySelector(
      '.top-contents__list'
    ) as HTMLElement;

    if (!movieList) return;

    const firstCard = movieList.querySelector(
      '.top-contents__item'
    ) as HTMLElement;
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth;

      const listStyle = getComputedStyle(movieList);
      const gap = parseInt(listStyle.columnGap || listStyle.gap || '0');

      const totalWidth = cardWidth + gap;

      const scrollAmount = totalWidth * (direction === 'left' ? -1 : 1);

      movieList.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ): void {
    if (name === 'direction' && newValue) {
      const button = this.querySelector('.arrow-button') as HTMLButtonElement;
      if (button) {
        button.setAttribute('direction', newValue);
      } else {
        this._pendingDirection = newValue as ArrowDirection;
      }
    }
  }
}

customElements.define('arrow-button', ArrowButton);

export default ArrowButton;
