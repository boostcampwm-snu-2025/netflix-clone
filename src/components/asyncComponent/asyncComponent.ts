import SuspenseContainer from '../suspenseContainer/suspenseContainer';

class AsyncComponent extends HTMLElement {
  #dataPromise!: Promise<unknown>;

  set dataPromise(p: Promise<unknown>) {
    this.#dataPromise = p;
    const suspense = this.closest('suspense-container') as SuspenseContainer;
    suspense?.registerPromise(this.id, () => this.#dataPromise!);
  }

  get dataPromise() {
    return this.#dataPromise;
  }
}

customElements.define('async-component', AsyncComponent);

export default AsyncComponent;
