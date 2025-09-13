import { ASSET_PATH } from "../../entity/asset.js";

export class MainHeaderMyProfileButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const profileImg = this.getAttribute("profile-img") || "#";
    const altText = this.getAttribute("alt") || "시용자 프로필";

    this.innerHTML = `
      <button class="header-icon-my-profile" type="button">
        <img src="${profileImg}" alt="${altText}" class="header-icon-my-profile-img"/>
        <img src="${ASSET_PATH.ARROW.DOWN}" alt="메뉴 펼치기" class="header-icon-my-profile-arow" />
      </button>
    `;
  }
}
