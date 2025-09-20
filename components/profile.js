import { showModal, hideModal } from "./modal.js";

export function initProfileModal() {
  const icon = document.getElementById("profile-icon");
  const modal = document.getElementById("profile-modal");

  icon.addEventListener("mouseenter", () => showModal(modal));
  icon.addEventListener("mouseleave", () => hideModal(modal));
  modal.addEventListener("mouseleave", () => showModal(modal));
}
