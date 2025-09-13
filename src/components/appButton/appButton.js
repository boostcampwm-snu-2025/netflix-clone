import { loadTemplate, loadStyle } from '../utils.js';

class AppButton extends HTMLElement {
  static get observedAttributes() {
    return ['size'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._pendingSize = null;
  }

  async connectedCallback() {
    const template = await loadTemplate('./template.html', import.meta.url);
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const style = await loadStyle('./style.css', import.meta.url);
    this.shadowRoot.appendChild(style);

    if (this._pendingSize) {
      const btn = this.shadowRoot.querySelector('button');
      btn.setAttribute('size', this._pendingSize);
      this._pendingSize = null;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'size' && newValue !== oldValue) {
      const btn = this.shadowRoot.querySelector('button');
      if (btn) {
        btn.setAttribute('size', newValue);
      } else {
        this._pendingSize = newValue;
      }
    }
  }
}

customElements.define('app-button', AppButton);
