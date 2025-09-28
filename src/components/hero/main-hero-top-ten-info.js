export class MainHeroTopTenInfo extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["rank"];
  }

  connectedCallback() {
    const rank = this.getAttribute("rank");
    this.innerHTML = this._render(rank);
  }

  _render(rank) {
    return `
        <div class="hero-contents-inner">
            <top-ten-badge></top-ten-badge>
            <span class="hero-top-ten">오늘 시리즈 순위 ${rank}위</span>
        </div>
      `;
  }

  attributeChangedCallback(name, newValue) {
    if (name === "visible") {
      this.innerHTML = this._render(newValue);
    }
  }
}
