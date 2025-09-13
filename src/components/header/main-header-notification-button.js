import { ASSET_PATH } from "../../entity/asset.js";
import { formatBadgeNumber } from "../../feature/header/format-badge-number.js";

export class MainHeaderNotificationButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const notificationNumber = this.getAttribute("notification-number") || 0;
    const badgeCount = formatBadgeNumber(notificationNumber);
    const showBadge = badgeCount > 0;

    this.innerHTML = `
      <button class="header-icon-notification" 
              type="button">
        <img src="${ASSET_PATH.NOTIFICATON}" alt="알림"  />
        ${
          showBadge
            ? `
          <span class="header-icon-notification-badge">
            ${badgeCount}
          </span>
        `
            : ""
        }
      </button>
    `;
  }
}
