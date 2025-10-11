import { initInfiniteCarousels } from './components/infiniteCarousel.js';

// Backward-compatible initializer for recommendation carousels.
// Delegates to the reusable InfiniteCarousel component with the selectors
// used by the current recommendation markup.
export function initCarousels(options = {}) {
  const {
    selector = '.carousel',
    visible = 5,
    transition = 'transform 0.5s ease',
    gap = 15,
  } = options;

  return initInfiniteCarousels({
    selector,
    trackSelector: '.recommendation-list',
    itemSelector: '.recommendation-item',
    prevSelector: '.handlePrev',
    nextSelector: '.handleNext',
    visible,
    gap,
    transition,
    infinite: true,
    indicator: {
      trackSelector: '.page-indicator .pi-track',
      dotClass: 'pi-dot',
      activeClass: 'is-active',
      createDots: true,
    },
  });
}
