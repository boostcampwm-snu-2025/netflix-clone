export class MainRecommendationNewVideo extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = this._render();
  }

  _render() {
    return `
        <div class="recommendation-new">
            <span>최신 등록</span>
        </div>
          `;
  }
}
