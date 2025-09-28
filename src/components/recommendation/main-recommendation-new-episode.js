export class MainRecommendationNewEpisode extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = this._render();
  }

  _render() {
    return `
        <div class="recommendation-new-episode">
            <span>새로운 에피소드</span>
            <span>지금 시청하기</span>
        </div>
      `;
  }
}
