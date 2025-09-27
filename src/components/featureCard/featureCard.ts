import { loadTemplate, processNamedSlots } from '../utils.ts';
import './style.css';

interface PendingAttributes {
  [key: string]: string;
}

class FeatureCard extends HTMLElement {
  private _pendingAttributes: PendingAttributes = {};

  static get observedAttributes(): string[] {
    return ['src', 'alt'];
  }

  constructor() {
    super();
  }

  async connectedCallback(): Promise<void> {
    const template = await loadTemplate('./template.html', import.meta.url);
    this.appendChild(template.content.cloneNode(true));
    processNamedSlots(this);
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ): void {
    if (newValue !== null) {
      this._pendingAttributes[name] = newValue;
    }
  }
}

customElements.define('feature-card', FeatureCard);

export default FeatureCard;
