// src/script.js
// 무한 슬라이더 구현
// - HTML 구조: .slider > .slider-content > (.prev-button, .next-button, .slider-container > .slider-item*)
(function () {
  const CARDS_PER_STEP = 3;     // ✅ 정확히 3장씩
  const SCROLL_SETTLE_MS = 200; // 스크롤 안정화 대기

  function debounce(fn, ms=120){ let t; return (...a)=>{clearTimeout(t); t=setTimeout(()=>fn(...a),ms);} }

  function initInfiniteSlider(sliderEl) {
    const container = sliderEl.querySelector('.slider-container');
    const prevBtn   = sliderEl.querySelector('.prev-button');
    const nextBtn   = sliderEl.querySelector('.next-button');
    if (!container || !prevBtn || !nextBtn) return;

    // 이미 초기화된 슬라이더는 패스
    if (container.dataset.infinite === 'on') return;
    container.dataset.infinite = 'on';

    // 1) 초기 목록과 클론 구성
    let items = Array.from(container.querySelectorAll('.slider-item'));
    const style = getComputedStyle(container);
    const gapPx = parseFloat(style.columnGap || style.gap || '8') || 8;

    // 화면에 보이는 카드 수 추정(N) → 앞뒤로 N개씩 클론
    const N = estimateVisibleCount(container, items[0], gapPx);
    const headClones = items.slice(-N).map(cloneItem);
    const tailClones = items.slice(0,  N).map(cloneItem);
    headClones.forEach(c => container.insertBefore(c, container.firstChild));
    tailClones.forEach(c => container.appendChild(c));

    items = Array.from(container.querySelectorAll('.slider-item')); // 클론 포함 전체
    const total = items.length;
    const ORIGINAL_LEN = total - 2*N;

    // 2) 시작 위치: 클론 뒤 첫 원본으로
    function jumpToIndex(i, smooth = false) {
      const t = items[i];
      if (!t) return;

      if (smooth) {
        container.style.scrollBehavior = 'smooth';
        container.scrollTo({ left: t.offsetLeft, behavior: 'smooth' });
        return;
      }

      const prevSnap = container.style.scrollSnapType;
      const prevBehv = container.style.scrollBehavior;

      container.style.scrollSnapType = 'none';
      container.style.setProperty('scroll-behavior', 'auto', 'important');

      container.scrollLeft = t.offsetLeft;
      container.offsetHeight; // force reflow

      requestAnimationFrame(() => {
        container.style.scrollSnapType = prevSnap || '';
        container.style.scrollBehavior = prevBehv || 'smooth';
      });
    }
    jumpToIndex(N, false);

    // 3) index 기반으로 "정확히 3장씩" 이동
    let isAnimating = false; // ✅ 스무스 중엔 보정 금지
    function nearestIndex() {
      // offsetLeft가 scrollLeft에 가장 가까운 index (스냅 덕분에 거의 일치)
      let lo=0, hi=items.length-1, best=0, bestDiff=1e9, x0=container.scrollLeft;
      while (lo<=hi){ const mid=(lo+hi)>>1, x=items[mid].offsetLeft, d=Math.abs(x-x0);
        if(d<bestDiff){bestDiff=d; best=mid;}
        x<x0? lo=mid+1: hi=mid-1;
      }
      return best;
    }

    function moveByCards(dir) {
      const cur = nearestIndex();
      let target = cur + dir * CARDS_PER_STEP;
      // 범위를 벗어나도 일단 부드럽게 스크롤 → 끝나면 보정 로직이 처리
      target = Math.max(0, Math.min(items.length - 1, target));
      isAnimating = true;                    // ✅ 애니메이션 시작
      jumpToIndex(target, true);
    }

    prevBtn.addEventListener('click', () => moveByCards(-1));
    nextBtn.addEventListener('click', () => moveByCards( 1));

    // 4) 스크롤 안정화 후에만 클론 보정
    const onScrollSettled = debounce(() => {
      if (isAnimating) {                     // 스무스가 끝났을 타이밍
        isAnimating = false;
      }
      const i = nearestIndex();

      // 왼쪽 클론(0 ~ N-1) → 동일 카드의 오른쪽 원본으로 점프
      if (i < N) {
        const originalI = i + ORIGINAL_LEN;  // 같은 카드의 원본 인덱스
        jumpToIndex(originalI, false);       // 순간 이동(스냅 유지)
        return;
      }
      // 오른쪽 클론(total-N ~ total-1) → 동일 카드의 왼쪽 원본으로 점프
      if (i >= total - N) {
        const originalI = i - ORIGINAL_LEN;
        jumpToIndex(originalI, false);
        return;
      }
    }, SCROLL_SETTLE_MS);

    container.addEventListener('scroll', onScrollSettled, { passive: true });

    // --- helpers ---
    function cloneItem(node) { const c = node.cloneNode(true); c.dataset.clone='true'; return c; }
    function estimateVisibleCount(container, firstItem, gapPx){
      if(!firstItem) return 1;
      const w = firstItem.getBoundingClientRect().width;
      const cw = container.clientWidth;
      return Math.max(1, Math.floor((cw + gapPx) / (w + gapPx)));
    }
  }

  document.querySelectorAll('.slider').forEach(initInfiniteSlider);
})();