export class TopTenBadge extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = this._render();
  }

  _render() {
    return `
        <div class="hero-top-ten-inner">
            <span>TOP</span>
            <span>10</span>
        </div>
    `;
  }
}
