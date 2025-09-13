import { ASSET_PATH } from "../../entity/asset.js";
import { HEADER_DATA } from "../../entity/main-header-data.js";

export class MainHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const API_VALUE = {
      NOTIFICATION_NUMBER: "10",
      PROFILE_IMG: ASSET_PATH.MY_PROFILE,
      ALT: "김연우의 프로필 사진",
    };

    this.innerHTML = this._generateHeader(API_VALUE);
  }

  _generateHeader(apiValue) {
    const navMenus = this._generateMenus();
    const navIcons = this._generateIcons(apiValue);
    return `
      <header class="header-container">
        <div class="header-left-wrapper">
          <a href="#" class="logo">
            <img src="${HEADER_DATA.logo.src}" alt="${HEADER_DATA.logo.alt}" />
          </a>
          <ul>
            ${navMenus}
          </ul>
        </div>
        <div class="header-right-wrapper">
          ${navIcons}
        </div>
      </header>
    `;
  }

  _generateMenus() {
    return HEADER_DATA.navItems
      .map(
        (item) => `
              <main-header-menu 
                  contents="${item.contents}" 
                  href="${item.href}"
                  ${item.active ? "active" : ""}
              ></main-header-menu>
          `
      )
      .join("");
  }

  _generateIcons(apiValue) {
    return `
      <div class="header-icons-container">
        <main-header-search-button></main-header-search-button>
        <main-header-kids-button></main-header-kids-button>
        <main-header-notification-button 
          notification-number="${apiValue.NOTIFICATION_NUMBER}">
        </main-header-notification-button>
        <main-header-my-profile-button 
          profile-img="${apiValue.PROFILE_IMG}" 
          alt="${apiValue.ALT}">
        </main-header-my-profile-button>
      </div>
    `;
  }
}
