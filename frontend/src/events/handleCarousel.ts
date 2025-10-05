export default function handleCarousel(slider: Element) {
  const list = slider.querySelector("ol")!;
  const items = Array.from(list.querySelectorAll("li"));
  const totalItems = items.length;
  const firstClones = items.map(item => item.cloneNode(true));
  const lastClones = items.map(item => item.cloneNode(true));
  list.append(...firstClones);
  list.prepend(...lastClones);

  list.addEventListener("transitionend", () => {
    list.style.transition = "none";
    currentItem = currentItem % totalItems + totalItems;
    const offset = -currentItem * (items[0].offsetWidth);
    list.style.transform = `translateX(${offset}px)`;
    updateButtonState();
  });

  const itemsPerScreen = 5;
  let currentItem = 0;

  const pageIndicator = slider.parentElement!.querySelector(".page-indicator")!;
  function updatePageIndicator() {
    const indicators = Array.from(pageIndicator.querySelectorAll("span"));
    const currentPage = Math.ceil((currentItem % totalItems) / itemsPerScreen);
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentPage);
    });
  }
  updatePageIndicator();

  function slide() {
    const offset = -currentItem * (items[0].offsetWidth);
    list.style.transition = "transform 0.5s ease-in-out";
    list.style.transform = `translateX(${offset}px)`;
  }

  const leftButton = slider.querySelector<HTMLButtonElement>("button.left")!;
  leftButton.addEventListener("click", () => {
    if ((currentItem % totalItems) % itemsPerScreen === 0) {
      currentItem -= itemsPerScreen;
    } else {
      currentItem -= (currentItem % totalItems) % itemsPerScreen;
    }
    currentItem = Math.max(currentItem, 0);
    slide();
    updatePageIndicator();
  });

  const rightButton = slider.querySelector<HTMLButtonElement>("button.right")!;
  rightButton.addEventListener("click", () => {
    if ((currentItem % totalItems + itemsPerScreen) % totalItems === 0) {
      currentItem += itemsPerScreen;
    } else {
      currentItem += totalItems % itemsPerScreen;
    }
    currentItem = Math.min(currentItem, totalItems * 3 - itemsPerScreen);
    slide();
    updatePageIndicator();
  });

  function updateButtonState() {
    if (currentItem === 0) {
      leftButton.style.visibility = "hidden";
    } else {
      leftButton.style.visibility = "visible";
    }
  }
  updateButtonState();
}