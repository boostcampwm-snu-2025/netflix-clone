// src/carousel.ts

// ===== Types =====
type Direction = 'prev' | 'next';
type RafHandle = number;

// ===== rAF / cAF / debounce =====
export const raf = (cb: FrameRequestCallback): RafHandle => {
  const rAF =
    typeof window.requestAnimationFrame === 'function'
      ? window.requestAnimationFrame.bind(window)
      : null;

  if (rAF) return rAF(cb);

  // 폴백: setTimeout으로 DOMHighResTimeStamp과 동일한 number 전달
  const id = window.setTimeout(
    () => cb(performance.now() as unknown as DOMHighResTimeStamp),
    16
  );
  return id as RafHandle;
};

export const caf = (h: RafHandle): void => {
  if (typeof window.cancelAnimationFrame === 'function') {
    window.cancelAnimationFrame(h);
  } else {
    window.clearTimeout(h);
  }
};

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  wait = 100
) {
  let t: number | undefined;
  return (...args: Parameters<T>) => {
    if (t !== undefined) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), wait);
  };
}

// ===== Main =====
export function initCarousels(): void {
  const carousels = document.querySelectorAll<HTMLElement>('.carousel');

  carousels.forEach((root) => {
    const track = root.querySelector<HTMLElement>('.carousel__track');
    const viewport = root.querySelector<HTMLElement>('.carousel__viewport');
    if (!track || !viewport) return;

    // 섹션별 설정 (최소 1 보정)
    const rawPerView = Number.parseInt(root.dataset.perView ?? '6', 10);
    const perView = Number.isFinite(rawPerView) && rawPerView > 0 ? rawPerView : 1;

    const rawStep = Number.parseInt(root.dataset.step ?? String(perView), 10);
    const step = Number.isFinite(rawStep) && rawStep > 0 ? rawStep : perView;

    // 아이템 수집
    const items = Array.from(track.children) as HTMLElement[];
    const N = items.length;
    if (N === 0) return;

    // === Infinite: 양쪽에 한 화면 분량 클론 ===
    const headClones = items
      .slice(0, perView)
      .map((n) => n.cloneNode(true) as HTMLElement);
    const tailClones = items
      .slice(-perView)
      .map((n) => n.cloneNode(true) as HTMLElement);
    headClones.forEach((n) => track.appendChild(n));
    tailClones.forEach((n) => track.insertBefore(n, track.firstChild));

    const allSlides = Array.from(track.children) as HTMLElement[];
    let index = perView; // 실제 시작 지점(클론 뒤)
    let slideW = 0;
    let isAnimating = false;

    // === Pager ===
    const pagerEl = root.querySelector<HTMLElement>('.carousel__pager');
    const pages = Math.max(1, Math.ceil(N / step));

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
      const cursor = ((index - perView) % N + N) % N; // 0..N-1
      const pageIdx = Math.floor(cursor / step);
      pagerEl.querySelectorAll<HTMLElement>('.dot').forEach((el, i) => {
        el.classList.toggle('is-active', i === pageIdx);
      });
    };

    // === helpers ===
    const getGap = () => {
      const s = getComputedStyle(track);
      // column-gap 우선 사용, 없으면 gap 사용
      const gRaw = (s as any).columnGap ?? s.gap ?? '0';
      const g = Number.parseFloat(String(gRaw));
      return Number.isFinite(g) ? g : 0;
    };

    const translateToIndex = (i: number, animate = true) => {
      const offset = i * (slideW + getGap());
      if (!animate) track.style.transition = 'none';
      raf(() => {
        track.style.transform = `translate3d(${-offset}px,0,0)`;
        if (!animate)
          raf(() => {
            track.style.transition = '';
          });
      });
    };

    const jumpTo = (i: number) => translateToIndex(i, false);

    const go = (dir: Direction) => {
      if (isAnimating) return;
      isAnimating = true;
      index += dir === 'next' ? step : -step;
      translateToIndex(index, true);
    };

    // === 크기 계산/적용 ===
    const applySizes = () => {
      const vw = viewport.clientWidth;
      const gap = getGap();
      slideW = (vw - gap * (perView - 1)) / perView; // gap 고려
      allSlides.forEach((el) => {
        el.style.width = `${slideW}px`;
      });
      jumpTo(index);
      setActivePager();
    };

    // === 버튼 ===
    const prevBtn = root.querySelector<HTMLButtonElement>('.carousel__btn--prev');
    const nextBtn = root.querySelector<HTMLButtonElement>('.carousel__btn--next');
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
    const onResize = debounce(applySizes, 50); // () => void

    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => onResize());
      ro.observe(viewport);
    } else {
      addEventListener('resize', () => onResize());
    }

    // === 초기화 ===
    applySizes();
    setActivePager();
  });
}
