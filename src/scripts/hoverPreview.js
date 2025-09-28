// Floating hover preview for recommendation items

export function initHoverPreview() {
  const container = document.querySelector('.recommendation-container');
  if (!container) return;

  const preview = createPreviewCard();
  document.body.appendChild(preview);

  let hideTimer = null;
  let currentItem = null;

  const clearHide = () => { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } };
  const scheduleHide = () => { hideTimer = setTimeout(() => hidePreview(), 120); };

  function hidePreview() {
    preview.classList.remove('is-visible');
    preview.setAttribute('aria-hidden', 'true');
    container.classList.remove('has-preview-open');
    currentItem = null;
  }

  function positionForItem(item) {
    const rect = item.getBoundingClientRect();
    const card = preview;
    const scale = 1.35;
    const margin = 10;

    const viewportPad = 20;
    const baseWidth = Math.max(180, Math.min(rect.width, Math.min(480, window.innerWidth - viewportPad)));
    card.style.width = baseWidth + 'px';

    card.style.visibility = 'hidden';
    const fallbackHeight = baseWidth * 9 / 16 + 72;
    const baseHeight = card.offsetHeight || fallbackHeight;

    const sX = window.scrollX;
    const sY = window.scrollY;
    const centerX = rect.left + rect.width / 2 + sX;
    const centerY = rect.top + rect.height / 2 + sY;

    const scaledW = baseWidth * scale;
    const scaledH = baseHeight * scale;

    let baseLeft = centerX - baseWidth / 2;
    let baseTop = centerY - baseHeight / 2;
    card.style.transformOrigin = 'center center';

    const minLeft = sX + 10;
    const maxLeft = sX + window.innerWidth - scaledW - 10;
    const minTop = sY + 10;
    const maxTop = sY + window.innerHeight - scaledH - 10;
    let scaledLeft = centerX - scaledW / 2;
    let scaledTop = centerY - scaledH / 2;
    if (scaledLeft < minLeft) { baseLeft += (minLeft - scaledLeft); }
    if (scaledLeft > maxLeft) { baseLeft -= (scaledLeft - maxLeft); }
    if (scaledTop < minTop) { baseTop += (minTop - scaledTop); }
    if (scaledTop > maxTop) { baseTop -= (scaledTop - maxTop); }

    card.style.left = Math.round(baseLeft) + 'px';
    card.style.top = Math.round(baseTop) + 'px';

    card.style.setProperty('--preview-scale', String(scale));
    card.style.visibility = 'visible';
  }

  function showForItem(item) {
    const imgEl = item.querySelector('img');
    if (!imgEl) return;
    const src = imgEl.getAttribute('src');
    const alt = imgEl.getAttribute('alt') || 'Preview';
    const media = preview.querySelector('.preview-media img');
    media.src = src;
    media.alt = alt;
    positionForItem(item);
    preview.classList.add('is-visible');
    preview.setAttribute('aria-hidden', 'false');
    container.classList.add('has-preview-open');
    currentItem = item;
  }

  container.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.recommendation-item');
    if (!item || !container.contains(item)) return;
    clearHide();
    showForItem(item);
  });

  container.addEventListener('mouseleave', (e) => {
    const related = e.relatedTarget;
    if (preview.contains(related)) return;
    scheduleHide();
  });

  preview.addEventListener('mouseenter', clearHide);
  preview.addEventListener('mouseleave', scheduleHide);

  const onMove = () => {
    if (!currentItem) return;
    const rect = currentItem.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      hidePreview();
      return;
    }
    positionForItem(currentItem);
  };
  window.addEventListener('scroll', onMove, true);
  window.addEventListener('resize', onMove);

  const previewImg = preview.querySelector('.preview-media img');
  previewImg.addEventListener('load', () => { if (currentItem) positionForItem(currentItem); });
}

function createPreviewCard() {
  const card = document.createElement('div');
  card.className = 'preview-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-hidden', 'true');
  card.style.position = 'absolute';
  card.style.zIndex = '1000';

  card.innerHTML = `
    <div class="preview-inner">
      <div class="preview-media">
        <img src="" alt="Preview" />
        <button class="preview-mute" aria-label="음소거"><i class="fa-solid fa-volume-xmark"></i></button>
      </div>
      <div class="preview-actions">
        <div class="pa-left">
          <button class="btn btn-round btn-play" aria-label="재생"><i class="fa-solid fa-play"></i></button>
          <button class="btn btn-round btn-plus" aria-label="내 리스트에 추가"><i class="fa-solid fa-plus"></i></button>
          <div class="rate-group">
            <button class="btn btn-round btn-like" aria-label="평가"><i class="fa-regular fa-thumbs-up"></i></button>
            <div class="rate-menu" role="menu" aria-hidden="true">
              <button class="btn btn-round rate-option" aria-label="별로예요" title="맘에 안들어요"><i class="fa-regular fa-thumbs-down"></i></button>
              <button class="btn btn-round rate-option" aria-label="좋아요" title="좋아요"><i class="fa-regular fa-thumbs-up"></i></button>
              <button class="btn btn-round rate-option" aria-label="최고예요" title="최고예요"><i class="fa-solid fa-face-grin-stars"></i></button>
            </div>
          </div>
        </div>
        <div class="pa-right">
          <button class="btn btn-round btn-expand" aria-label="상세 보기"><i class="fa-solid fa-chevron-down"></i></button>
        </div>
      </div>
    </div>
  `;


  const rateGroup = card.querySelector('.rate-group');
  const rateMenu = card.querySelector('.rate-menu');
  const likeBtn = card.querySelector('.btn-like');
  let hoverTimer = null;

  const openMenu = () => { rateMenu.setAttribute('aria-hidden', 'false'); rateMenu.classList.add('is-open'); };
  const closeMenu = () => { rateMenu.setAttribute('aria-hidden', 'true'); rateMenu.classList.remove('is-open'); };

  likeBtn.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); openMenu(); });
  likeBtn.addEventListener('mouseleave', () => { hoverTimer = setTimeout(closeMenu, 120); });
  rateMenu.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); openMenu(); });
  rateMenu.addEventListener('mouseleave', () => { hoverTimer = setTimeout(closeMenu, 120); });

  return card;
}
