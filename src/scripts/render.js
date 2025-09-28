// Rendering helpers extracted from main.js

export function renderHero(hero) {
  if (!hero) return;
  const container = document.querySelector('.hero-container');
  if (!container) return;
  container.innerHTML = '';

  const bgImg = document.createElement('img');
  bgImg.className = 'hero-image';
  if (hero.image) {
    bgImg.src = hero.image.src || '';
    bgImg.alt = hero.image.alt || 'Hero Image';
  }

  const content = document.createElement('div');
  content.className = 'hero-content';

  const titleImg = document.createElement('img');
  titleImg.className = 'hero-title';
  if (hero.titleImage) {
    titleImg.src = hero.titleImage.src || '';
    titleImg.alt = hero.titleImage.alt || 'Hero Title';
  }

  const desc = document.createElement('p');
  desc.className = 'hero-description';
  if (hero.description) desc.textContent = hero.description;

  const actions = document.createElement('div');
  actions.className = 'hero-actions';

  const btns = document.createElement('div');
  btns.className = 'hero-buttons';
  if (Array.isArray(hero.buttons)) {
    hero.buttons.forEach(b => {
      const btn = document.createElement('button');
      btn.className = b.type === 'info' ? 'info-button' : 'play-button';
      if (b.disabled) btn.disabled = true;
      const icon = document.createElement('i');
      icon.className = b.icon || '';
      btn.appendChild(icon);
      btn.appendChild(document.createTextNode(' ' + (b.label || '')));
      btns.appendChild(btn);
    });
  }

  const controls = document.createElement('div');
  controls.className = 'hero-controls';
  const muteBtn = document.createElement('button');
  muteBtn.className = 'mute-btn';
  muteBtn.setAttribute('aria-label', '음소거');
  if (typeof hero.controls?.muted === 'boolean') {
    muteBtn.setAttribute('data-initial-muted', hero.controls.muted ? 'true' : 'false');
  }
  const muteIcon = document.createElement('i');
  muteIcon.className = 'fa-solid fa-volume-xmark';
  muteBtn.appendChild(muteIcon);

  const age = document.createElement('span');
  age.className = 'age-badge';
  if (hero.controls?.ageBadge) age.textContent = hero.controls.ageBadge;

  controls.appendChild(muteBtn);
  controls.appendChild(age);

  actions.appendChild(btns);
  actions.appendChild(controls);

  content.appendChild(titleImg);
  content.appendChild(desc);
  content.appendChild(actions);

  container.appendChild(bgImg);
  container.appendChild(content);
}

export function renderRecommendations(recommendations) {
  const container = document.querySelector('.recommendation-container');
  if (!container || !Array.isArray(recommendations)) return;
  container.innerHTML = '';

  recommendations.forEach((rec) => {
    const wrapper = document.createElement('div');

    const title = document.createElement('p');
    title.className = 'section-title with-indicator';
    title.textContent = rec.title || '';
    const indicator = document.createElement('span');
    indicator.className = 'page-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    const track = document.createElement('span');
    track.className = 'pi-track';
    indicator.appendChild(track);
    title.appendChild(indicator);

    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    if (rec.carousel?.infinite) carousel.setAttribute('data-infinite', 'true');

    const prev = document.createElement('span');
    prev.className = 'handle handlePrev';
    prev.setAttribute('aria-hidden', 'true');
    const prevIcon = document.createElement('b');
    prevIcon.className = 'handle-icon fa-solid fa-chevron-left';
    prev.appendChild(prevIcon);

    const list = document.createElement('div');
    list.className = 'recommendation-list';

    const next = document.createElement('span');
    next.className = 'handle handleNext';
    next.setAttribute('aria-hidden', 'true');
    const nextIcon = document.createElement('b');
    nextIcon.className = 'handle-icon fa-solid fa-chevron-right';
    next.appendChild(nextIcon);

    carousel.appendChild(prev);
    carousel.appendChild(list);
    carousel.appendChild(next);

    rec.items?.forEach((item, i) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'recommendation-item';
      itemEl.setAttribute('data-index', String(i + 1));
      const img = document.createElement('img');
      img.src = item.image?.src || '';
      img.alt = item.image?.alt || `Recommendation ${i + 1}`;
      itemEl.appendChild(img);
      list.appendChild(itemEl);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(carousel);
    container.appendChild(wrapper);
  });
}

export function renderNotifications(notifications) {
  const menu = document.querySelector('.notification .notification-menu');
  if (!menu || !Array.isArray(notifications)) return;
  menu.innerHTML = '';
  notifications.forEach((n) => {
    const item = document.createElement('div');
    item.className = 'notification-item';
    const img = document.createElement('img');
    img.src = n.image?.src || '';
    img.alt = n.image?.alt || 'Notification';
    const text = document.createElement('div');
    text.className = 'notification-text';
    const title = document.createElement('p');
    title.className = 'notification-title';
    title.innerHTML = (n.title || '').replace(/\n/g, '<br>');
    const time = document.createElement('p');
    time.className = 'notification-time';
    time.textContent = n.time || '';
    text.appendChild(title);
    text.appendChild(time);
    item.appendChild(img);
    item.appendChild(text);
    menu.appendChild(item);
  });
}
