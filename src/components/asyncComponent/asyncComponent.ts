import SuspenseContainer from '../suspenseContainer/suspenseContainer';
import { wrapPromise } from '../utils';

class AsyncComponent extends HTMLElement {
  #resource: ReturnType<typeof wrapPromise> | null = null;

  set dataPromise(p: Promise<unknown>) {
    this.#resource = wrapPromise(p);
    const suspense = this.closest('suspense-container') as SuspenseContainer;
    suspense?.registerResource(this.id, this.#resource);
  }

  get resource() {
    return this.#resource;
  }
}

customElements.define('async-component', AsyncComponent);

export default AsyncComponent;
