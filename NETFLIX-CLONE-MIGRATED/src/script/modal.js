document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.dropdown > .icon-btn').forEach(btn => {
    const wrap   = btn.closest('.dropdown');
    const panel  = wrap.querySelector('.dropdown-panel');

    // 클릭 토글 (모바일/키보드)
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // 패널 내부 클릭은 유지
    panel.addEventListener('click', e => e.stopPropagation());
  });

    // --- 검색창 토글 로직 추가 ---
  const searchTab = document.querySelector('.search-tab');
  const searchBtn = document.querySelector('.search-icon');
  const searchInput = document.getElementById('search-input');

  if (searchBtn && searchTab && searchInput) {
    searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // 1. 다른 드롭다운 닫기
      document.querySelectorAll('.dropdown.open').forEach(wrap => {
        wrap.classList.remove('open');
        const btn = wrap.querySelector('button');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // 2. 검색창 토글
      const isCurrentlyOpen = searchTab.classList.contains('open');
      
      if (!isCurrentlyOpen) {
        // 검색창 확장 시
        searchTab.classList.add('open');
        searchInput.focus(); // ⭐ 자동 포커스 ⭐
      } else {
        // 검색창 축소 시
        // 입력 필드에 내용이 없으면 닫기
        if (searchInput.value.trim() === '') {
          searchTab.classList.remove('open');
          searchInput.blur(); // 포커스 제거
        }
        // 내용이 있으면 버튼을 눌러도 닫지 않고 검색 행위로 간주 (넷플릭스 UX)
      }
    });

    // 검색창 입력 필드에서 Enter 키를 누르면 검색 로직 수행 (선택 사항)
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            console.log(`[Search] Searching for: ${searchInput.value}`);
            // TODO: 실제 검색 결과 표시 로직
        }
    });


    // 3. 검색창 내부 클릭 시 닫히지 않도록
    searchTab.addEventListener('click', e => e.stopPropagation());
  }
  // --- 검색창 토글 로직 끝 ---

  // 바깥 클릭 시 닫기
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.open').forEach(wrap => {
      wrap.classList.remove('open');
      const btn = wrap.querySelector('.icon-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });

  });

  // ESC 닫기
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown.open').forEach(wrap => {
        wrap.classList.remove('open');
        const btn = wrap.querySelector('.icon-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }

    if (searchTab && searchTab.classList.contains('open') && e.key === 'Escape') {
      searchTab.classList.remove('open');
      searchInput.blur();
    }
  });
});
