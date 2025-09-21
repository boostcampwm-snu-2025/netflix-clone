// src/script.js
// 무한 슬라이더 구현
// - HTML 구조: .slider > .slider-content > (.prev-button, .next-button, .slider-container > .slider-item*)
(function () {
  const SLIDE_FRACTION = 0.9;  // 버튼 클릭 시 '한 번 이동' 비율(컨테이너의 90%)

  // 유틸: 디바운스(스크롤 끝 판별용)
  function debounce(fn, ms=120) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  // 가시 카드 수 추정: 컨테이너 폭 / 카드+갭 폭
  function estimateVisibleCount(container, gapPx) {
    const first = container.querySelector('.slider-item');
    if (!first) return 1;
    const itemWidth = first.getBoundingClientRect().width;
    const w = container.clientWidth;
    const approx = Math.max(1, Math.floor((w + gapPx) / (itemWidth + gapPx)));
    return approx;
  }

  function initInfiniteSlider(sliderEl) {
    const content   = sliderEl.querySelector('.slider-content');
    const container = sliderEl.querySelector('.slider-container');
    const prevBtn   = sliderEl.querySelector('.prev-button');
    const nextBtn   = sliderEl.querySelector('.next-button');

    if (!content || !container || !prevBtn || !nextBtn) return;

    // 현재 gap 읽기(없으면 8px 가정)
    const style = getComputedStyle(container);
    const gapPx = parseFloat(style.columnGap || style.gap || '8') || 8;

    // 1) 클론 준비
    let N = estimateVisibleCount(container, gapPx); // 앞뒤 클론 개수
    let items = Array.from(container.querySelectorAll('.slider-item'));
    if (items.length === 0) return;

    // 중복 초기화 방지
    if (container.dataset.infinite === 'on') return;
    container.dataset.infinite = 'on';

    // 앞뒤 클론 생성
    const headClones = items.slice(-N).map(cloneItem);
    const tailClones = items.slice(0, N).map(cloneItem);

    // DOM에 삽입
    headClones.forEach(cl => container.insertBefore(cl, container.firstChild));
    tailClones.forEach(cl => container.appendChild(cl));

    // 새 목록/길이 재계산
    items = Array.from(container.querySelectorAll('.slider-item'));
    const total = items.length;

    // 2) 시작 위치: 첫 원본(index N)으로 이동(스냅 유지)
    // 스냅 기준으로 안전하게 이동하기 위해 해당 카드의 offsetLeft로 점프
    function jumpToIndex(i, smooth=false) {
      const target = items[i];
      if (!target) return;
      const left = target.offsetLeft;
      container.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
    }
    jumpToIndex(N, false);

    // 3) 버튼 클릭 시 한 화면씩 이동
    function getStep() { return Math.max(1, Math.floor(container.clientWidth * SLIDE_FRACTION)); }
    function scrollByDir(dir) {
      container.scrollBy({ left: dir * getStep(), behavior: 'smooth' });
    }
    prevBtn.addEventListener('click', () => scrollByDir(-1));
    nextBtn.addEventListener('click', () => scrollByDir( 1));

    // 4) 무한 루프: 스크롤이 클론 영역에 들어가면 순간 이동
    const onScrollSettled = debounce(() => {
      const x = container.scrollLeft;
      const w = container.clientWidth;

      // 현재 가장 가까운 카드 index 추정(스냅 덕분에 start에 맞음)
      let i = findNearestIndex(items, x);

      // 왼쪽 클론 영역(0 ~ N-1)
      if (i < N) {
        // 같은 시각의 원본 인덱스: i + (원본 길이)
        const originalI = i + (total - 2*N);
        jumpToIndex(originalI, false); // 순간 이동(애니메이션 없음)
        return;
      }
      // 오른쪽 클론 영역(원본 뒤: total-N ~ total-1)
      if (i >= total - N) {
        const originalI = i - (total - 2*N);
        jumpToIndex(originalI, false);
        return;
      }
      // 그 외: 아무 것도 하지 않음(스냅 유지)
    }, 140);

    container.addEventListener('scroll', onScrollSettled, { passive: true });

    // 5) 접근성/키보드/드래그(선택)
    sliderEl.tabIndex = 0;
    sliderEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); scrollByDir(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollByDir( 1); }
    });

    // 반응형: 리사이즈 시 클론 개수 재산정하고 재초기화가 필요하다면,
    // 간단히 페이지 새로고침 없이 적용하려면 더 복잡해진다.
    // 우선은 버튼 step 재계산만.
    window.addEventListener('resize', () => {
      // 스크롤 스냅 자체는 반응하지만, 버튼 step은 컨테이너 폭에 의존하므로 자동 반영.
    });

    // --- 내부 유틸 ---
    function cloneItem(node) {
      const c = node.cloneNode(true);
      c.setAttribute('data-clone', 'true');
      return c;
    }

    function findNearestIndex(nodes, scrollLeft) {
      // nodes[i].offsetLeft와 가장 가까운 index
      // (스냅 덕분에 거의 딱 맞지만, 미세오차 대비)
      let lo = 0, hi = nodes.length - 1, best = 0, bestDiff = Infinity;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const x = nodes[mid].offsetLeft;
        const diff = Math.abs(x - scrollLeft);
        if (diff < bestDiff) { bestDiff = diff; best = mid; }
        if (x < scrollLeft) lo = mid + 1; else hi = mid - 1;
      }
      return best;
    }
  }

  // 모든 슬라이더에 적용
  document.querySelectorAll('.slider').forEach(initInfiniteSlider);
})();
