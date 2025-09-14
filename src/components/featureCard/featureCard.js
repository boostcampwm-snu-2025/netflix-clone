import { loadTemplate, loadStyle } from '../utils.js';

class FeatureCard extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'alt'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._pendingAttributes = {};
  }

  async connectedCallback() {
    const template = await loadTemplate('./template.html', import.meta.url);
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const style = await loadStyle('./style.css', import.meta.url);
    this.shadowRoot.appendChild(style);
  }
}

customElements.define('feature-card', FeatureCard);
