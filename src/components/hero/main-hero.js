export class MainHero extends HTMLElement {
  constructor() {
    super();
    this.apiData = null;
  }

  async connectedCallback() {
    try {
      this.innerHTML = this._renderLoading();

      const response = await fetch("/src/entity/main-hero-data.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.apiData = await response.json();

      this.innerHTML = this._render(this.apiData);
    } catch (error) {
      this.innerHTML = this._renderError();
    }
  }

  _render(apiValue) {
    return `
      <section class="hero-container">
        <img src="${apiValue.thumbnail_image}" class="hero-image" />
        <div class="hero-overlay-wrapper">
          <img src="${apiValue.title_image}" alt="폭군의 셰프" />
          ${
            apiValue.rank <= 10 &&
            `<main-hero-top-ten-info rank=${apiValue.rank}></main-hero-top-ten-info>`
          }
          <p class="hero-contents-description">${apiValue.description}</p>
          <div class="hero-button-inner">
            <main-hero-play-button></main-hero-play-button>
            <main-hero-info-button></main-hero-info-button>
          </div>
        </div>
      </section>
    `;
  }

  _renderLoading() {
    return `
      <section class="hero-container loading">
        <img class="hero-image" />
          <p>로딩 중...</p>
        </div>
      </section>
    `;
  }

  _renderError() {
    return `
      <section class="hero-container error">
        <div class="error-message">
          <p>콘텐츠를 불러올 수 없습니다.</p>
          <button onclick="location.reload()">다시 시도</button>
        </div>
      </section>
    `;
  }
}
