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

  slideStates.set(slider, { currentItem: 0 });

  function updatePageIndicator() {
    const indicators = Array.from(pageIndicator.querySelectorAll("span"));
    const { currentItem = 0 } = slideStates.get(slider) || {};
    const currentPage = Math.ceil((currentItem % totalItems) / itemsPerScreen);
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentPage);
    });
  }

  function slide() {
    list.style.transition = "transform 0.5s ease-in-out";
    const { currentItem = 0 } = slideStates.get(slider) || {};
    const offset = currentItem * (items[0].offsetWidth);
    list.style.transform = `translateX(-${offset}px)`;
  }

  leftButton.addEventListener("click", () => {
    let { currentItem = 0 } = slideStates.get(slider) || {};
    if ((currentItem % totalItems) % itemsPerScreen === 0) {
      currentItem -= itemsPerScreen;
    } else {
      currentItem -= (currentItem % totalItems) % itemsPerScreen;
    }
    slideStates.set(slider, { currentItem });
    slide();
    updatePageIndicator();
  });

  rightButton.addEventListener("click", () => {
    let { currentItem = 0 } = slideStates.get(slider) || {};
    if ((currentItem % totalItems + itemsPerScreen) % totalItems === 0) {
      currentItem += itemsPerScreen;
    } else {
      currentItem += totalItems % itemsPerScreen;
      const clone = items.map((item) => item.cloneNode(true));
      list.append(...clone);
    }
    slideStates.set(slider, { currentItem });
    slide();
    updatePageIndicator();
  });

  // Initialize
  updatePageIndicator();
}
