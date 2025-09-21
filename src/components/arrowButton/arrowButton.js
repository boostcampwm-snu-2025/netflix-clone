import { loadTemplate, loadStyle } from '../utils.js';

class ArrowButton extends HTMLElement {
  static get observedAttributes() {
    return ['direction'];
  }

  constructor() {
    super();
    this._pendingDirection = null;
  }

  async connectedCallback() {
    const template = await loadTemplate('./template.html', import.meta.url);
    const style = await loadStyle('./style.css', import.meta.url);
    document.head.appendChild(style);

    this.appendChild(template.content.cloneNode(true));

    if (this._pendingDirection) {
      const button = this.querySelector('.arrow-button');
      button.setAttribute('direction', this._pendingDirection);
      this._pendingDirection = null;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'direction') {
      const button = this.querySelector('.arrow-button');
      if (button) {
        button.setAttribute('direction', newValue);
      } else {
        this._pendingDirection = newValue;
      }
    }
  }
}

customElements.define('arrow-button', ArrowButton);
