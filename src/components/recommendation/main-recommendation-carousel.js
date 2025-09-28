export class MainRecommendationCarousel extends HTMLElement {
  constructor() {
    super();
    this._videos = [];
  }

  static get observedAttributes() {
    return ["is-top-ten"];
  }

  set videos(value) {
    this._videos = Array.isArray(value) ? value : [];
    if (this.isConnected) {
      this._render();
    }
  }

  get videos() {
    return this._videos;
  }

  _render() {
    const isTopTen = this.getAttribute("is-top-ten") === "true";
    if (isTopTen) {
      this._videos = this._videos.sort((a, b) => a.rank - b.rank);
    }
    this.innerHTML = `
      <div class="carousel-wrapper">
        <button class="carousel-nav prev">‹</button>
        <button class="carousel-nav next">›</button>
        <div class="carousel-track">
          <div class="recommendation-contents-list-inner">
              ${this._videos
                .map(() =>
                  isTopTen
                    ? `<main-recommendation-top-ten-video></main-recommendation-top-ten-video>`
                    : `<main-recommendation-video></main-recommendation-video>`
                )
                .join("")}
          </div>
        </div>
      </div>
      `;
    this._setupVideoComponents();
  }

  _setupVideoComponents() {
    const isTopTen = this.getAttribute("is-top-ten");
    const query = isTopTen
      ? "main-recommendation-top-ten-video"
      : "main-recommendation-video";
    const videoElements = this.querySelectorAll(query);

    videoElements.forEach((videoElement, index) => {
      if (this._videos[index]) {
        videoElement.video = this._videos[index];
      }
    });
  }

  attributeChangedCallback(name) {
    if (name === "is-top-ten") {
      this._render();
    }
  }
}
