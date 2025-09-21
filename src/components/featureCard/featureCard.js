import { loadTemplate, loadStyle, processNamedSlots } from '../utils.js';

class FeatureCard extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'alt'];
  }

  constructor() {
    super();
    this._pendingAttributes = {};
  }

  async connectedCallback() {
    const template = await loadTemplate('./template.html', import.meta.url);
    const style = await loadStyle('./style.css', import.meta.url);
    document.head.appendChild(style);

    this.appendChild(template.content.cloneNode(true));
    processNamedSlots(this);
  }
}

customElements.define('feature-card', FeatureCard);
