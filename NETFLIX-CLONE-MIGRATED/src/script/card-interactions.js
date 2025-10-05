// src/script/card-interactions.js
document.addEventListener('contentLoaded', () => {
  const sliders = document.querySelectorAll('.slider');

  sliders.forEach(slider => {
    slider.addEventListener('click', (e) => {
      const target = e.target.closest('.icon-btn');
      if (!target) return;

      const item = e.target.closest('.slider-item');
      if (!item) return;

      const itemId = item.dataset.id;
      const action = target.classList[1]; // btn-play, btn-like, btn-info

      switch (action) {
        case 'btn-play':
          console.log(`[Card Interaction] Playing item: ${itemId}`);
          // TODO: 실제 영상 재생 로직
          break;
        case 'btn-like':
          console.log(`[Card Interaction] Toggled like for item: ${itemId}`);
          // TODO: 좋아요 상태 토글 로직
          // 예: target.classList.toggle('liked');
          break;
        case 'btn-info':
          console.log(`[Card Interaction] Showing info for item: ${itemId}`);
          // TODO: 모달 또는 상세 페이지 이동 로직
          break;
        default:
          break;
      }
    });
  });

  console.log('카드 상호작용 초기화 완료');
});