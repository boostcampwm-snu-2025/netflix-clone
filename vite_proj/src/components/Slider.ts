import { fetch_movies_for_row } from "../api/fetchMovies";

const items_per_page = 6;

/**
 * Initialize a slider on a wrapper element.
 */
export async function initSlider(wrapper: HTMLElement, perPage: number = items_per_page) {
  const sliderContent = wrapper.querySelector(".sliderContent") as HTMLElement;
  const sliderMask = wrapper.querySelector(".sliderMask") as HTMLElement;
  const prevBtn = wrapper.querySelector(".prev") as HTMLButtonElement;
  const nextBtn = wrapper.querySelector(".next") as HTMLButtonElement;

  // Fetch movie images first
  await fetch_movies_for_row(sliderContent, perPage * 3);

  // Internal state
  let currentIndex = perPage + 1;
  const clones = perPage + 1;
  let isAnimating = false;
  let hasClicked = false;

  // === Setup DOM ===
  setup(sliderContent, sliderMask, perPage, clones);
  updateTransform(sliderContent, perPage, currentIndex);

  // === Listeners ===
  nextBtn.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;
    hasClicked = true;
    prevBtn.classList.remove("hidden");
    currentIndex += perPage;
    slide(sliderContent, sliderMask, perPage, clones, currentIndex, "next", () => {
      if (currentIndex >= sliderContent.children.length - clones) {
        currentIndex = clones;
        updateTransform(sliderContent, perPage, currentIndex);
      }
      isAnimating = false;
    });
  });

  prevBtn.addEventListener("click", () => {
    if (!hasClicked || isAnimating) return;
    isAnimating = true;
    currentIndex -= perPage;
    slide(sliderContent, sliderMask, perPage, clones, currentIndex, "prev", () => {
      if (currentIndex < clones) {
        currentIndex = sliderContent.children.length - clones - perPage;
        updateTransform(sliderContent, perPage, currentIndex);
      }
      isAnimating = false;
    });
  });
}

// === Helper functions ===

function setup(content: HTMLElement, mask: HTMLElement, perPage: number, clones: number) {
  const items = Array.from(content.querySelectorAll(".slider-item"));
  const count = items.length;

  content.innerHTML = "";

  // clones before
  const start = Math.max(0, count - clones);
  for (let i = start; i < count; i++) content.appendChild(items[i].cloneNode(true));

  // originals
  items.forEach((item) => content.appendChild(item));

  // clones after
  for (let i = 0; i < Math.min(clones, count); i++)
    content.appendChild(items[i].cloneNode(true));

  const cardSize = 100 / perPage;
  const peek = cardSize * 0.2;
  mask.style.padding = `0 ${peek}%`;

  content.querySelectorAll<HTMLElement>(".slider-item").forEach((item) => {
    item.style.flex = `0 0 ${cardSize}%`;
  });
}

function updateTransform(content: HTMLElement, perPage: number, index: number, animate = false) {
  content.style.transition = animate ? "transform 0.6s ease" : "none";
  content.style.transform = `translateX(-${index * (100 / perPage)}%)`;
}

function slide(
  content: HTMLElement,
  mask: HTMLElement,
  perPage: number,
  clones: number,
  index: number,
  direction: "next" | "prev",
  onDone: () => void
) {
  updateTransform(content, perPage, index, true);
  content.addEventListener("transitionend", onDone, { once: true });
}
