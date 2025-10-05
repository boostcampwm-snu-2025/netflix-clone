export default function handleModal(modalContainer: Element) {
  const menu = modalContainer.querySelector(".menu")!;
  modalContainer.addEventListener("pointerenter", () => {
    menu.classList.add("active");
  });

  modalContainer.addEventListener("pointerleave", () => {
    menu.classList.remove("active");
  });
}