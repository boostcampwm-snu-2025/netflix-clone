import { ASSET_PATH } from "../../entity/asset.js";

export class MainHeroPlayButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = this._render();
  }

  _render() {
    return `
        <button class="hero-play-button">
            <img src="${ASSET_PATH.PLAY}" />재생
        </button>
      `;
  }
}
