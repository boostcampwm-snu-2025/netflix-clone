// Rendering helpers extracted from main.js

export function renderHero(hero) {
  if (!hero) return;
  const heroContainer = document.querySelector('.hero-container');
  if (!heroContainer) return;

  const img = heroContainer.querySelector('.hero-image');
  const titleImg = heroContainer.querySelector('.hero-title');
  const desc = heroContainer.querySelector('.hero-description');
  const ageBadge = heroContainer.querySelector('.age-badge');

  if (img && hero.image) {
    img.src = hero.image.src;
    if (hero.image.alt) img.alt = hero.image.alt;
  }
  if (titleImg && hero.titleImage) {
    titleImg.src = hero.titleImage.src;
    if (hero.titleImage.alt) titleImg.alt = hero.titleImage.alt;
  }
  if (desc && hero.description) desc.textContent = hero.description;
  if (ageBadge && hero.controls?.ageBadge) ageBadge.textContent = hero.controls.ageBadge;

  const muteBtn = heroContainer.querySelector('.mute-btn');
  if (muteBtn && typeof hero.controls?.muted === 'boolean') {
    muteBtn.setAttribute('data-initial-muted', hero.controls.muted ? 'true' : 'false');
  }
}

export function renderRecommendations(recommendations) {
  const sections = document.querySelectorAll('.recommendation-container > div');
  if (!sections.length || !Array.isArray(recommendations)) return;

  recommendations.slice(0, sections.length).forEach((rec, idx) => {
    const section = sections[idx];
    const titleEl = section.querySelector('.section-title');
    const list = section.querySelector('.recommendation-list');
    if (titleEl && rec.title) titleEl.firstChild.nodeValue = rec.title + '\n';
    if (!list) return;

    list.innerHTML = '';
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
