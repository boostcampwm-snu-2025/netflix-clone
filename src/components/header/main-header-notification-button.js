import { ASSET_PATH } from "../../entity/asset.js";
import { formatBadgeNumber } from "../../feature/header/format-badge-number.js";

export class MainHeaderNotificationButton extends HTMLElement {
  constructor() {
    super();
    this.modal = null;
  }

  static get observedAttributes() {
    return ["notification-number"];
  }

  connectedCallback() {
    const notificationNumber = this.getAttribute("notification-number") || 0;
    const badgeCount = formatBadgeNumber(notificationNumber);
    const showBadge = badgeCount > 0;

    this._render(showBadge, badgeCount);
    this._setupModal();
    this._setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const showBadge = newValue > 0;
    this._updateBadge(showBadge, newValue);
  }

  disconnectedCallback() {
    if (this.modal) {
      this.modal.remove();
    }

    document.removeEventListener("click", this.handleOutsideClick);
  }

  _render(showBadge, badgeCount) {
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

  _updateBadge(showBadge, count) {
    const badge = this.querySelector(".header-icon-notification-badge");
    if (badge) {
      badge.textContent = count || "0";
      badge.style.display = showBadge ? "block" : "none";
    }
  }

  _setupModal() {
    const modal = document.querySelector("main-header-notification-modal");
    this.modal = modal;
    this.modal.addEventListener("modal-mouse-leave", () => {
      this._hideModal();
    });
  }

  _setupEventListeners() {
    const button = this.querySelector(".header-icon-notification");
    button.addEventListener("mouseover", (e) => {
      e.preventDefault();
      this._showModal();
    });
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target) && !this.modal.contains(e.target)) {
        this._hideModal();
      }
    });
  }

  _showModal() {
    if (this.modal !== null) {
      this.modal.show();
    }
  }

  _hideModal() {
    if (this.modal !== null) {
      this.modal.hide();
    }
  }
}
