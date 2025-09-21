const slideStates = new WeakMap();

/**
 * @param {HTMLElement} slider
 */
export function handleSlider(slider) {
  if (!slider) {
    return;
  }

  const list = slider.querySelector("ol, ul");
  const items = Array.from(list.querySelectorAll("li"));
  const leftButton = slider.querySelector("button.left");
  const rightButton = slider.querySelector("button.right");
  const pageIndicator = slider.parentElement.querySelector(".page-indicator");

  const itemsPerScreen = 5;
  const totalItems = items.length;
  let currentItem = 0;

  slideStates.set(slider, { currentItem: 0 });

  function updatePageIndicator() {
    const indicators = Array.from(pageIndicator.querySelectorAll("span"));
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentItem);
    });
  }

  function slide() {
    const offset = currentItem * (items[0].offsetWidth + 10);
    list.style.transform = `translateX(-${offset}px)`;
  }

  leftButton.addEventListener("click", () => {
    if (currentItem > 0) {
      currentItem--;
    } else {
      currentItem = totalItems - itemsPerScreen;
    }
    slide();
    updatePageIndicator();
  });

  rightButton.addEventListener("click", () => {
    if (currentItem < totalItems - itemsPerScreen) {
      currentItem++;
    } else {
      currentItem = 0;
    }
    slide();
    updatePageIndicator();
  });

  // Initialize
  updatePageIndicator();
}