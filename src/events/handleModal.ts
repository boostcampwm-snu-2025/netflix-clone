export default function handleModal(modal: Element) {
  const menu = modal.querySelector(".menu")!;
  modal.addEventListener("pointerenter", () => {
    menu.classList.add("active");
  });

  modal.addEventListener("pointerleave", () => {
    menu.classList.remove("active");
  });
}