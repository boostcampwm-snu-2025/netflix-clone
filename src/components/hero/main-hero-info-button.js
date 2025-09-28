import { ASSET_PATH } from "../../entity/asset.js";

export class MainHeroInfoButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = this._render();
  }

  _render() {
    return `
        <button class="hero-more-button">
          <img src="${ASSET_PATH.INFO}" />상세 정보
        </button>
        `;
  }
}
