(() => {
  const menus = document.querySelectorAll('.menu');

  const setExpanded = (menu, open) => {
    const trigger = menu.querySelector('.menu__trigger');
    if (!trigger) return;
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  menus.forEach(menu => {
    const trigger = menu.querySelector('.menu__trigger');
    if (!trigger) return;

    menu.addEventListener('mouseenter', () => setExpanded(menu, true));
    menu.addEventListener('mouseleave', () => setExpanded(menu, false));

    menu.addEventListener('focusin', () => setExpanded(menu, true));
    menu.addEventListener('focusout', (e) => {
      if (!menu.contains(e.relatedTarget)) setExpanded(menu, false);
    });
  });
})();

// ===== Carousel (Infinite, per-section config, pager) =====
(() => {
  const carousels = document.querySelectorAll('.carousel');

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  carousels.forEach((root) => {
    const track = root.querySelector('.carousel__track');
    if (!track) return;

    // config
    const perView = parseInt(root.dataset.perView || '6', 10);
    const step     = parseInt(root.dataset.step || String(perView), 10);

    // collect items
    const items = Array.from(track.children); // .card 들
    const N = items.length;
    if (N === 0) return;

    // === Infinite loop: 앞뒤로 클론 추가 ===
    // 클론은 '한 화면'만큼 양쪽에 생성 (perView 만큼)
    const headClones = items.slice(0, perView).map(n => n.cloneNode(true));
    const tailClones = items.slice(-perView).map(n => n.cloneNode(true));

    headClones.forEach(n => track.appendChild(n));
    tailClones.forEach(n => track.insertBefore(n, track.firstChild));

    const allSlides = Array.from(track.children);
    let index = perView;               // 실제 첫 슬라이드 위치(클론 뒤)
    let slideW = 0;                    // JS에서 계산해서 고정
    let isAnimating = false;

    // === Pager 생성 ===
    const pagerEl = root.querySelector('.carousel__pager');
    const pages = Math.ceil(N / step);
    const makePager = () => {
      if (!pagerEl) return;
      pagerEl.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const d = document.createElement('div');
        d.className = 'dot' + (i === 0 ? ' is-active' : '');
        pagerEl.appendChild(d);
      }
    };
    makePager();

    const setActivePager = () => {
      if (!pagerEl) return;
      const pageIdx = Math.floor(((index - perView) % N + N) % N / step);
      const dots = pagerEl.querySelectorAll('.dot');
      dots.forEach((el, i) => el.classList.toggle('is-active', i === pageIdx));
    };

    // === 사이즈 계산 & 너비 지정 ===
    const applySizes = () => {
      const viewport = root.querySelector('.carousel__viewport');
      const vw = viewport.clientWidth;
      slideW = (vw - (getGap() * (perView - 1))) / perView; // gap 감안

      allSlides.forEach(el => {
        el.style.width = `${slideW}px`;
      });

      // 시작 위치로 이동
      jumpTo(index);
      setActivePager();
    };

    // CSS gap 값을 계산 (track의 gap)
    const getGap = () => {
      const s = getComputedStyle(track);
      const g = parseFloat(s.columnGap || s.gap || '0');
      return isNaN(g) ? 0 : g;
    };

    const translateToIndex = (i, animate = true) => {
      const offset = i * (slideW + getGap());
      if (!animate) track.style.transition = 'none';
      requestAnimationFrame(() => {
        track.style.transform = `translate3d(${-(offset)}px,0,0)`;
        if (!animate) {
          // 다음 프레임에 transition 복구
          requestAnimationFrame(() => (track.style.transition = ''));
        }
      });
    };

    const jumpTo = (i) => translateToIndex(i, false);

    const go = (dir) => {
      if (isAnimating) return;
      isAnimating = true;

      index += (dir === 'next' ? step : -step);
      translateToIndex(index, true);
    };

    // transition 끝나면(클론 구간 진입시) 실제로 점프
    track.addEventListener('transitionend', () => {
      // 왼쪽 끝(클론)으로 넘어간 경우
      if (index < perView) {
        index = perView + ((index - perView) % N + N) % N; // 실제 영역으로 보정
        jumpTo(index);
      }
      // 오른쪽 끝(클론)으로 넘어간 경우
      const maxIndex = perView + N - 1;
      if (index > maxIndex) {
        index = perView + ((index - perView) % N + N) % N;
        jumpTo(index);
      }
      setActivePager();
      isAnimating = false;
    });

    // 버튼
    const prevBtn = root.querySelector('.carousel__btn--prev');
    const nextBtn = root.querySelector('.carousel__btn--next');
    prevBtn?.addEventListener('click', () => go('prev'));
    nextBtn?.addEventListener('click', () => go('next'));

    // 리사이즈 대응
    const ro = new ResizeObserver(applySizes);
    ro.observe(root.querySelector('.carousel__viewport'));

    // 초기화
    applySizes();
    setActivePager();
  });
})();
