import { HEADER_NOTIFICATION } from "../../entity/main-header-data.js";

export class MainHeaderNotificationModal extends HTMLElement {
  constructor() {
    super();
    this.notifications = HEADER_NOTIFICATION;
  }

  static get observedAttributes() {
    return ["visible"];
  }

  _render() {
    this.innerHTML = `
        <div class="notification-modal-overlay">
          <div class="notification-modal-container">
            <div class="notification-modal-header">
              <h3>알림</h3>
            </div>
            <div class="notification-modal-content">
              ${this._renderNotifications()}
            </div>
            <div class="notification-modal-footer">
              <button class="notification-view-all">모든 알림 보기</button>
            </div>
          </div>
        </div>
      `;
  }

  _renderNotifications() {
    if (this.notifications.length === 0) {
      return `
        <div>
            <span>알림이 없습니다.</span>
        <div>`;
    }

    return this.notifications
      .map(
        (notification) => `
        <div class="notification-item" data-id="${notification.id || ""}">
          <div class="notification-icon">${notification.icon || "🔔"}</div>
          <div class="notification-text">
            <p class="notification-title">${notification.title}</p>
            <p class="notification-time">${notification.time}</p>
          </div>
          ${
            notification.unread
              ? '<div class="notification-unread-dot"></div>'
              : ""
          }
        </div>
      `
      )
      .join("");
  }

  connectedCallback() {
    this._render();
    this._setupEventListeners();
  }

  attributeChangedCallback(name, newValue) {
    if (name === "visible") {
      if (newValue === "true") {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  _setupEventListeners() {
    this.addEventListener("mouseleave", this._handleMouseLeave.bind(this));

    this.addEventListener("click", (e) => {
      const notificationItem = e.target.closest(".notification-item");
      if (notificationItem) {
        this._handleNotificationClick(notificationItem);
      }

      if (e.target.classList.contains("notification-view-all")) {
        this._handleViewAllClick();
      }
    });
  }

  _handleMouseLeave() {
    this.dispatchEvent(new CustomEvent("modal-mouse-leave"));
  }

  _handleNotificationClick(item) {
    const notificationId = item.dataset.id;
    this.notifications.map((item) => {
      if (item.id === notificationId) {
        item.unread = false;
      }
      return item;
    });
    const notificationNumber = this.notifications.filter(
      (n) => n.unread
    ).length;

    this.dispatchEvent(
      new CustomEvent("notification-click", {
        detail: { totalCount: notificationNumber },
        bubbles: true,
      })
    );

    const unreadDot = item.querySelector(".notification-unread-dot");
    if (unreadDot) {
      unreadDot.remove();
    }
  }

  show() {
    this.classList.add("show");
  }

  hide() {
    this.classList.remove("show");
  }
}
