export function initCarousels(options = {}) {
  const {
    selector = '.carousel',
    visible = 5,
    transition = 'transform 0.5s ease',
    gap = 15
  } = options;

  const carousels = document.querySelectorAll(selector);
  carousels.forEach(wrapper => {
    const track = wrapper.querySelector('.recommendation-list');
    if (!track) return;
    const prevBtn = wrapper.querySelector('.handlePrev');
    const nextBtn = wrapper.querySelector('.handleNext');

    const originalSlides = Array.from(track.querySelectorAll('.recommendation-item'));
    const N = originalSlides.length;
    if (N === 0) return;

    // Triple track original + clone + clone
    if (track.querySelectorAll('.recommendation-item').length === N) {
      const frag = document.createDocumentFragment();
      for (let r = 0; r < 2; r++) {
        originalSlides.forEach(slide => frag.appendChild(slide.cloneNode(true)));
      }
      track.appendChild(frag);
    }

    let index = N; // start in middle block
    const pages = Math.ceil(N / visible);

    const indicatorTrack = wrapper.parentElement?.querySelector('.page-indicator .pi-track');
    if (indicatorTrack) {
      indicatorTrack.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('span');
        dot.className = 'pi-dot' + (i === 0 ? ' is-active' : '');
        indicatorTrack.appendChild(dot);
      }
    }

    const updateIndicator = () => {
      if (!indicatorTrack) return;
      const baseIndex = ((index % N) + N) % N;
      const currentPage = Math.floor(baseIndex / visible);
      indicatorTrack.querySelectorAll('.pi-dot').forEach((d, i) => {
        if (i === currentPage) d.classList.add('is-active'); else d.classList.remove('is-active');
      });
    };

    const slidesAll = () => track.querySelectorAll('.recommendation-item');
    const getWidth = () => slidesAll()[0]?.offsetWidth || 0;

    const applyTransform = (animate = true) => {
      track.style.transition = animate ? transition : 'none';
      const w = getWidth();
      const offset = index * (w + gap);
      track.style.transform = `translateX(-${offset}px)`;
    };

    requestAnimationFrame(() => applyTransform(false));

    const normalizeIndex = () => {
      if (index >= 2 * N) {
        index -= N;
        applyTransform(false);
      } else if (index < N) {
        index += N;
        applyTransform(false);
      }
    };

    let locking = false;
    const step = dir => {
      if (locking) return;
      locking = true;
      const stepSize = Math.min(visible, N);
      index += dir === 'next' ? stepSize : -stepSize;
      applyTransform(true);
      updateIndicator();
    };

    nextBtn?.addEventListener('click', () => step('next'));
    prevBtn?.addEventListener('click', () => step('prev'));

    track.addEventListener('transitionend', e => {
      if (e.propertyName !== 'transform') return;
      normalizeIndex();
      updateIndicator();
      requestAnimationFrame(() => { locking = false; });
    });

    updateIndicator();
  });
}
