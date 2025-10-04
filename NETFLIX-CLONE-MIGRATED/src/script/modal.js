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

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Search button clicked');
      
      // 다른 드롭다운 닫기 (검색창 열 때)
      document.querySelectorAll('.dropdown.open').forEach(wrap => {
        wrap.classList.remove('open');
        const btn = wrap.querySelector('button');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      const open = searchTab.classList.toggle('open');
      
      if (open) {
        searchInput.focus(); // 열리면 입력 필드에 포커스
      } else {
        searchInput.blur();
      }
    });

    // 검색창 내부 클릭 시 닫히지 않도록
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
  });
});
