import { showModal, hideModal } from "./modal.js";

export function initNotifModal() {
  const icon = document.getElementById("notif-icon");
  const modal = document.getElementById("notif-modal");

  icon.addEventListener("mouseenter", () => showModal(modal));
  icon.addEventListener("mouseleave", () => hideModal(modal));
  modal.addEventListener("mouseleave", () => showModal(modal));
}
