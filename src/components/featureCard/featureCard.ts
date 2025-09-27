import { loadTemplate, loadStyle, processNamedSlots } from '../utils.ts';

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
    const style = await loadStyle('./style.css', import.meta.url);
    document.head.appendChild(style);

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
