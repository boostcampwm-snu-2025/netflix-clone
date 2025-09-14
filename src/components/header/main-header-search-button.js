import { ASSET_PATH } from "../../entity/asset.js";

export class MainHeaderSearchButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <button class="header-icon-button" type="button">
        <img src="${ASSET_PATH.SEARCH}" alt="검색 아이콘" />
      </button>
    `;
  }
}
