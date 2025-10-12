const likeState = new Map();

function getCardId(cardElem) {
  // 카드의 고유 식별자: img src + title(있으면)
  const img = cardElem.querySelector('img');
  const title = cardElem.querySelector('h3')?.textContent || '';
  return img ? img.src + title : '';
}

function updateLikeUI(cardElem, liked) {
  const btn = cardElem.querySelector('.like-btn');
  if (!btn) return;
  btn.textContent = liked ? '♥' : '♡';
  btn.classList.toggle('liked', liked);
}

function handleLikeClick(e) {
  const cardElem = e.currentTarget.closest('li');
  const cardId = getCardId(cardElem);
  const liked = !likeState.get(cardId);
  likeState.set(cardId, liked);
  updateLikeUI(cardElem, liked);
}

export function initLikeButtons() {
  // 모든 카드에 좋아요 버튼 추가 및 이벤트 연결
  document.querySelectorAll('.movie_card1, .movie_card2').forEach(cardElem => {
    let btn = cardElem.querySelector('.like-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'like-btn';
      btn.textContent = '♡';
      btn.style.marginLeft = '8px';
      btn.addEventListener('click', handleLikeClick);
      // 카드 제목 옆 또는 카드 하단에 버튼 추가
      const h3 = cardElem.querySelector('h3');
      if (h3) {
        h3.after(btn);
      } else {
        cardElem.appendChild(btn);
      }
    }
  });
}