import { loadTemplate, loadStyle } from '../utils.js';

class MovieCard extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'alt', 'title', 'rank'];
  }

  constructor() {
    super();
    this._pendingAttributes = {};
  }

  async connectedCallback() {
    console.log('connectedCallback');
    const template = await loadTemplate('./template.html', import.meta.url);
    const style = await loadStyle('./style.css', import.meta.url);
    document.head.appendChild(style);

    this.appendChild(template.content.cloneNode(true));

    this.updateAttributes(this._pendingAttributes);
    this._pendingAttributes = null;

    this.querySelector('.card')?.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('open-movie-detail', {
          detail: { title: this.getAttribute('title') },
        })
      );
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const card = this.querySelector('.card');
    if (card) {
      this.updateAttributes({ [name]: newValue });
    } else {
      this._pendingAttributes[name] = newValue;
    }
  }

  updateAttributes(attrs = {}) {
    console.log(attrs);
    const img = this.querySelector('img');
    const caption = this.querySelector('.title');
    const rank = this.querySelector('.rank');

    if ('src' in attrs && img) img.src = attrs.src || '';
    if ('alt' in attrs && img) img.alt = attrs.alt || '';
    if ('title' in attrs && caption) caption.textContent = attrs.title || '';
    if ('rank' in attrs && rank) rank.textContent = attrs.rank || '';
  }
}

customElements.define('movie-card', MovieCard);
