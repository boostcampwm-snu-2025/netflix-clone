import { loadTemplate, loadStyle, processTextSlot } from '../utils.js';

class AppButton extends HTMLElement {
  static get observedAttributes() {
    return ['size'];
  }

  constructor() {
    super();
    this._pendingSize = null;
  }

  async connectedCallback() {
    const template = await loadTemplate('./template.html', import.meta.url);
    const style = await loadStyle('./style.css', import.meta.url);
    document.head.appendChild(style);

    this.appendChild(template.content.cloneNode(true));

    processTextSlot(this);

    if (this._pendingSize) {
      const button = this.querySelector('button');
      button.setAttribute('size', this._pendingSize);
      this._pendingSize = null;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'size' && newValue !== oldValue) {
      const btn = this.querySelector('button');
      if (btn) {
        btn.setAttribute('size', newValue);
      } else {
        this._pendingSize = newValue;
      }
    }
  }
}

customElements.define('app-button', AppButton);
