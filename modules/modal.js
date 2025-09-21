export function initModal() {
  const notifIcon = document.getElementById("notif-icon");
  const profileIcon = document.getElementById("profile-icon");
  const notifModal = document.getElementById("notif-modal");
  const profileModal = document.getElementById("profile-modal");

  function hideAll() {
    notifModal.style.display = "none";
    profileModal.style.display = "none";
  }

  // 알림
  notifIcon.addEventListener("mouseenter", () => {
    hideAll();
    notifModal.style.display = "block";
  });
  notifIcon.addEventListener("mouseleave", () => {
    notifModal.style.display = "none";
  });
  notifModal.addEventListener("mouseenter", () => {
    notifModal.style.display = "block";
  });
  notifModal.addEventListener("mouseleave", () => {
    notifModal.style.display = "none";
  });

  // 프로필
  profileIcon.addEventListener("mouseenter", () => {
    hideAll();
    profileModal.style.display = "block";
  });
  profileIcon.addEventListener("mouseleave", () => {
    profileModal.style.display = "none";
  });
  profileModal.addEventListener("mouseenter", () => {
    profileModal.style.display = "block";
  });
  profileModal.addEventListener("mouseleave", () => {
    profileModal.style.display = "none";
  });
}
