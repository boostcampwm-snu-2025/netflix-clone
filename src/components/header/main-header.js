import { ASSET_PATH } from "../../entity/asset.js";
import { HEADER_DATA } from "../../entity/main-header-data.js";
import { HEADER_NOTIFICATION } from "../../entity/main-header-data.js";

const notificationNumber = HEADER_NOTIFICATION.filter((n) => n.unread).length;
const API_VALUE = {
  NOTIFICATION_NUMBER: notificationNumber,
  PROFILE_IMG: ASSET_PATH.MY_PROFILE,
  ALT: "김연우의 프로필 사진",
};

export class MainHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = this._render(API_VALUE);
    this._setupEventListeners();
  }

  _render(apiValue) {
    const navMenus = this._renderMenus();
    const navIcons = this._renderIcons(apiValue);
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
          <main-header-notification-modal></main-header-notification-modal />
        </div>
      </header>
    `;
  }

  _renderMenus() {
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

  _renderIcons(apiValue) {
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

  _setupEventListeners() {
    const headerRightWrapper = this.querySelector(".header-right-wrapper");
    headerRightWrapper.addEventListener("notification-click", (e) => {
      const { totalCount } = e.detail;
      console.log(e.detail);
      this._updateBadgeCount(totalCount);
    });
  }

  _updateBadgeCount(count) {
    const notificationButton = this.querySelector(
      "main-header-notification-button"
    );
    if (notificationButton) {
      notificationButton.setAttribute("notification-number", count);
    }
  }
}
