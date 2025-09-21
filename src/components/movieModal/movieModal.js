import {
  loadTemplate,
  loadStyle,
  processSlots,
  updateSlotData,
} from '../utils.js';

class MovieModal extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const template = await loadTemplate('./template.html', import.meta.url);
    const style = await loadStyle('./style.css', import.meta.url);
    document.head.appendChild(style);
    this.appendChild(template.content.cloneNode(true));

    this.addEventListener('click', e => {
      if (e.target.closest('.movie-modal')) {
        this.close();
        this._isOpen = false;
      }
    });

    const closeButton = this.querySelector('.movie-modal__close');
    closeButton?.addEventListener('click', () => {
      this.close();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this._isOpen) {
        this.close();
      }
    });

    const content = this.querySelector('.movie-modal__content');
    content?.addEventListener('click', e => e.stopPropagation());
  }

  open(movieData) {
    updateSlotData(this, movieData);

    const modal = this.querySelector('.movie-modal');
    if (modal) {
      modal.classList.add('active');
      this._isOpen = true;
    }
  }

  close() {
    const modal = this.querySelector('.movie-modal');
    if (!modal) return;

    modal.classList.remove('active');
    this._isOpen = false;
  }
}

customElements.define('movie-modal', MovieModal);
