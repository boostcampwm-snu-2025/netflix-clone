import { loadTemplate, loadStyle, updateSlotData } from '../utils.ts';

interface MovieData {
  [key: string]: string | number | undefined | null;
}

class MovieModal extends HTMLElement {
  private _isOpen: boolean = false;

  constructor() {
    super();
  }

  async connectedCallback(): Promise<void> {
    const template = await loadTemplate('./template.html', import.meta.url);
    const style = await loadStyle('./style.css', import.meta.url);
    document.head.appendChild(style);
    this.appendChild(template.content.cloneNode(true));

    this.addEventListener('click', (e: Event) => {
      if ((e.target as Element)?.closest('.movie-modal')) {
        this.close();
        this._isOpen = false;
      }
    });

    const closeButton = this.querySelector(
      '.movie-modal__close'
    ) as HTMLButtonElement;
    closeButton?.addEventListener('click', () => {
      this.close();
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this._isOpen) {
        this.close();
      }
    });

    const content = this.querySelector('.movie-modal__content') as HTMLElement;
    content?.addEventListener('click', (e: Event) => e.stopPropagation());
  }

  open(movieData: MovieData): void {
    updateSlotData(this, movieData);

    const modal = this.querySelector('.movie-modal') as HTMLElement;
    if (modal) {
      modal.classList.add('active');
      this._isOpen = true;
    }
  }

  close(): void {
    const modal = this.querySelector('.movie-modal') as HTMLElement;
    if (!modal) return;

    modal.classList.remove('active');
    this._isOpen = false;
  }
}

customElements.define('movie-modal', MovieModal);

export default MovieModal;
