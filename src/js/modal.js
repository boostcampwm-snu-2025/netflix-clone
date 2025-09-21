/**
 * @param {HTMLElement} modal
 */
export function handleModal(modal) {
  modal.addEventListener("mouseenter", (e) => {
    const menu = modal.querySelector(".menu");
    menu.style.visibility = "visible";
  });

  modal.addEventListener("mouseleave", (e) => {
    const menu = modal.querySelector(".menu");
    menu.style.visibility = "hidden";
  });
}
