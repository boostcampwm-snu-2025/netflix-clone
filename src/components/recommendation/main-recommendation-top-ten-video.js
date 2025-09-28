export class MainRecommendationTopTenVideo extends HTMLElement {
  constructor() {
    super();
    this._video = null;
  }

  set video(value) {
    this._video = typeof value === "object" ? value : null;
    if (this.isConnected) {
      this._render();
    }
  }

  get video() {
    return this._video;
  }

  connectedCallback() {
    this.innerHTML = this._render();
  }

  _render() {
    if (this._video === null) {
      return;
    }

    const { rank, title, thumbnail_image } = this._video;
    this.innerHTML = `
        <div class="topten-contents-inner">
          <span>${rank}</span>
          <img src="${thumbnail_image}" alt="${title}" class="topten-thumbnail" />
        </div>
     `;
  }
}
