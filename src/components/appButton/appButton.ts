import { loadTemplate, processTextSlot } from '../utils.ts';
import './style.css';

type ButtonSize = 'small' | 'medium' | 'large';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

class AppButton extends HTMLElement {
  private _pendingSize: ButtonSize | null = null;
  private _pendingVariant: ButtonVariant | null = null;

  static get observedAttributes(): string[] {
    return ['size', 'variant'];
  }

  constructor() {
    super();
  }

  async connectedCallback(): Promise<void> {
    const template = await loadTemplate('./template.html', import.meta.url);
    this.appendChild(template.content.cloneNode(true));

    processTextSlot(this);

    if (this._pendingSize) {
      const button = this.querySelector('.button') as HTMLButtonElement;
      if (button) {
        button.setAttribute('size', this._pendingSize);
        this._pendingSize = null;
      }
    }

    if (this._pendingVariant) {
      const button = this.querySelector('.button') as HTMLButtonElement;
      if (button) {
        button.setAttribute('variant', this._pendingVariant);
        this._pendingVariant = null;
      }
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (name === 'size' && newValue !== oldValue) {
      const btn = this.querySelector('.button') as HTMLButtonElement;
      if (btn && newValue) {
        btn.setAttribute('size', newValue);
      } else if (newValue) {
        this._pendingSize = newValue as ButtonSize;
      }
    }

    if (name === 'variant' && newValue !== oldValue) {
      const btn = this.querySelector('.button') as HTMLButtonElement;
      if (btn && newValue) {
        btn.setAttribute('variant', newValue);
      } else if (newValue) {
        this._pendingVariant = newValue as ButtonVariant;
      }
    }
  }
}

customElements.define('app-button', AppButton);

export default AppButton;
