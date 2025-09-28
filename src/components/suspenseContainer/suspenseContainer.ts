import ErrorBoundary from '../errorBoundary/errorBoundary';

class SuspenseContainer extends HTMLElement {
  #pending: Map<string, Promise<unknown>> = new Map();
  #resolved: Map<string, unknown> = new Map();
  #fallbackSlot: HTMLSlotElement | null;
  #contentSlot: HTMLSlotElement | null;

  set #loading(value: boolean) {
    if (value) {
      this.#fallbackSlot!.style.display = 'contents';
      this.#contentSlot!.style.display = 'none';
    } else {
      this.#fallbackSlot!.style.display = 'none';
      this.#contentSlot!.style.display = 'contents';
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot!.innerHTML = `
    <slot name="fallback"></slot>
    <slot name="content"></slot>
  `;

    this.#fallbackSlot = this.shadowRoot!.querySelector(
      'slot[name="fallback"]'
    );
    this.#contentSlot = this.shadowRoot!.querySelector('slot[name="content"]');
  }

  registerPromise<T>(key: string, work: () => Promise<T>): void {
    const promise = work();
    this.#pending.set(key, promise);
    this.#loading = true;

    promise
      .then(data => {
        this.#resolved.set(key, data);
        this.#pending.delete(key);
        this.#loading = false;
      })
      .catch(error => {
        this.#pending.delete(key);
        ErrorBoundary.reportError(error);
      });
  }
}

customElements.define('suspense-container', SuspenseContainer);

export default SuspenseContainer;
