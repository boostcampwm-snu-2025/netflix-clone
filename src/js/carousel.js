// /js/carousel.js
const raf = (cb) => (window.requestAnimationFrame || setTimeout)(cb, 16);
const debounce = (fn, wait = 100) => {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
};

export function initCarousels() {
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach((root) => {
    const track    = root.querySelector('.carousel__track');
    const viewport = root.querySelector('.carousel__viewport');
    if (!track || !viewport) return;

    // 섹션별 설정
    const perView = parseInt(root.dataset.perView || '6', 10);
    const step    = parseInt(root.dataset.step     || String(perView), 10);

    // 아이템 수집
    const items = Array.from(track.children);
    const N = items.length;
    if (N === 0) return;

    // === Infinite: 양쪽에 한 화면 분량 클론 ===
    const headClones = items.slice(0,  perView).map((n) => n.cloneNode(true));
    const tailClones = items.slice(-perView).map((n) => n.cloneNode(true));
    headClones.forEach((n) => track.appendChild(n));
    tailClones.forEach((n) => track.insertBefore(n, track.firstChild));

    const allSlides = Array.from(track.children);
    let index = perView;   // 실제 시작 지점(클론 뒤)
    let slideW = 0;
    let isAnimating = false;

    // === Pager ===
    const pagerEl = root.querySelector('.carousel__pager');
    const pages   = Math.ceil(N / step);

    const buildPager = () => {
      if (!pagerEl) return;
      pagerEl.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' is-active' : '');
        pagerEl.appendChild(dot);
      }
    };
    buildPager();

    const setActivePager = () => {
      if (!pagerEl) return;
      const cursor  = ((index - perView) % N + N) % N; // 0..N-1
      const pageIdx = Math.floor(cursor / step);
      pagerEl.querySelectorAll('.dot').forEach((el, i) => {
        el.classList.toggle('is-active', i === pageIdx);
      });
    };

    // === helpers ===
    const getGap = () => {
      const s = getComputedStyle(track);
      const g = parseFloat(s.columnGap || s.gap || '0');
      return Number.isFinite(g) ? g : 0;
    };

    const translateToIndex = (i, animate = true) => {
      const offset = i * (slideW + getGap());
      if (!animate) track.style.transition = 'none';
      raf(() => {
        track.style.transform = `translate3d(${-offset}px,0,0)`;
        if (!animate) raf(() => { track.style.transition = ''; });
      });
    };

    const jumpTo = (i) => translateToIndex(i, false);

    const go = (dir) => {
      if (isAnimating) return;
      isAnimating = true;
      index += (dir === 'next' ? step : -step);
      translateToIndex(index, true);
    };

    // === 크기 계산/적용 ===
    const applySizes = () => {
      const vw = viewport.clientWidth;
      slideW = (vw - (getGap() * (perView - 1))) / perView; // gap 고려
      allSlides.forEach((el) => { el.style.width = `${slideW}px`; });
      jumpTo(index);
      setActivePager();
    };

    // === 버튼 ===
    const prevBtn = root.querySelector('.carousel__btn--prev');
    const nextBtn = root.querySelector('.carousel__btn--next');
    if (prevBtn) prevBtn.addEventListener('click', () => go('prev'));
    if (nextBtn) nextBtn.addEventListener('click', () => go('next'));

    // === transition 끝나면 클론 보정 ===
    track.addEventListener('transitionend', () => {
      const maxIndex = perView + N - 1;
      if (index < perView) {
        index = perView + ((index - perView) % N + N) % N;
        jumpTo(index);
      } else if (index > maxIndex) {
        index = perView + ((index - perView) % N + N) % N;
        jumpTo(index);
      }
      setActivePager();
      isAnimating = false;
    });

    // === 리사이즈 대응(RO + 폴백) ===
    const onResize = debounce(applySizes, 50);
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(onResize);
      ro.observe(viewport);
    } else {
      window.addEventListener('resize', onResize);
    }

    // === 초기화 ===
    applySizes();
    setActivePager();
  });
}
