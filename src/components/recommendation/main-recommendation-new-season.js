export class MainRecommendationNewSeason extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = this._render();
  }

  _render() {
    return `
        <div class="recommendation-new-season">
            <span>새로운 시즌</span>
        </div>
        `;
  }
}
