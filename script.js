/* ============================
   Dynamic images + Slider + Likes (full script.js)
   ============================ */

// const { takeCoverage } = require("v8");

/* ---------- 1) Server images → render cards ---------- */
async function fetchServerImages() {
  const res = await fetch('/api/images');
  if (!res.ok) throw new Error('Failed to fetch /api/images');
  console.log(res)
  return res.json(); // [{ url, alt }, ...]
}

function renderCardsIntoTrack(files) {
  const track = document.querySelector('[data-track]');
  if (!track) return;

  const cardHTML = files.map(f => `
    <li class="card">
      <a href="#" class="card__link">
        <button class="card__like-btn" aria-label="좋아요">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.1 21.35l-1.1-.99C5.14 15.28 2 12.36 2 8.98 2 6.42 4.06 4.5 6.6 4.5c1.54 0 3.04.73 4 1.87a5.09 5.09 0 0 1 4-1.87c2.54 0 4.6 1.92 4.6 4.48 0 3.38-3.14 6.3-8.9 11.38l-1.2 1z"/>
          </svg>
        </button>
        <img class="card__img" src="${f.url}" alt="${f.alt || ''}" />
        <span class="card__title"></span>
      </a>
    </li>
  `).join('');

  track.innerHTML = cardHTML;
}

// Load images, render, hydrate likes, then signal "ready" for the slider
async function loadServerImagesAndHydrate() {
  try {
    const files = await fetchServerImages();
    renderCardsIntoTrack(files);      // ⬅️ add this line
    hydrateLikedStates();
    document.dispatchEvent(new Event('images:ready'));
  } catch (e) {
    console.error(e);
    // Fallback: if API fails, keep whatever static HTML exists (may be empty)
    hydrateLikedStates();
    document.dispatchEvent(new Event('images:ready'));
  }
}

/* ---------- 2) Infinite slider (init AFTER images) ---------- */
function initSlider() {
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;

  const track = slider.querySelector('[data-track]');
  const prev  = slider.querySelector('.slider__btn--prev');
  const next  = slider.querySelector('.slider__btn--next');
  const pager = slider.closest('.category')?.querySelector('.pager');
  const pagerDots = pager ? Array.from(pager.children) : [];

  // === CONFIG ===
  const CARDS_PER_VIEW = 6;          // page size
  const CLONES = CARDS_PER_VIEW;     // clones on each side
  const EPS = 2;

  let resizeRAF = 0;
  let debounceTimer = 0;

  function isClone(el){ return el.hasAttribute('data-clone'); }
  function realCards(){ return Array.from(track.children).filter(li => li.classList.contains('card') && !isClone(li)); }

  function slotSize(){
    const first = track.querySelector('.card');
    if(!first) return track.clientWidth;
    const w = first.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap || 0);
    return w + gap;
  }

  function killClones(){
    Array.from(track.children).forEach(el => { if (isClone(el)) el.remove(); });
  }

  function makeClones(){
    const cards = realCards();
    if (cards.length === 0) return;
    const head = cards.slice(0, CLONES).map(node => cloneCard(node));
    const tail = cards.slice(-CLONES).map(node => cloneCard(node));
    tail.forEach(c => track.insertBefore(c, track.firstChild));
    head.forEach(c => track.appendChild(c));
  }

  function cloneCard(card){
    const copy = card.cloneNode(true);
    copy.setAttribute('data-clone','');
    copy.setAttribute('aria-hidden','true');
    copy.querySelectorAll('a,button').forEach(el=>{
      el.setAttribute('tabindex','-1');
      el.setAttribute('aria-hidden','true');
    });
    return copy;
  }

  function setScrollInstant(left){
    const prevBehavior = track.style.scrollBehavior;
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = left;
    void track.offsetWidth;
    track.style.scrollBehavior = prevBehavior || 'smooth';
  }

  // --- PAGER helpers ---
  function realPageCount(){
    if (pagerDots.length > 0) return pagerDots.length;
    const nReal = realCards().length;
    return Math.max(1, Math.ceil(nReal / CARDS_PER_VIEW));
  }

  function normalizeMod(i, m){ return ((i % m) + m) % m; }

  function currentRealPage(){
    const s = slotSize();
    const nReal = realCards().length;
    if (nReal === 0 || s === 0) return 0;

    const leftBoundary = s * CLONES;
    const virtualIdxFloat = (track.scrollLeft - leftBoundary) / s;
    const realCardIdx = normalizeMod(Math.round(virtualIdxFloat), nReal);
    const page = Math.floor(realCardIdx / CARDS_PER_VIEW);
    return normalizeMod(page, realPageCount());
  }

  function renderPager(activeIdx){
    if (!pager || pagerDots.length === 0) return;
    for (let i=0;i<pagerDots.length;i++){
      const dot = pagerDots[i];
      dot.classList.remove('pager__box_on','pager__box_off');
      dot.classList.add(i === activeIdx ? 'pager__box_on' : 'pager__box_off');
    }
  }

  function updatePager(){ renderPager(currentRealPage()); }

  function jumpIfNeeded(){
    const s = slotSize();
    const nReal = realCards().length;
    if (nReal === 0) return;

    const leftBoundary  = s * CLONES;
    const rightBoundary = s * (CLONES + nReal) - track.clientWidth;

    if (track.scrollLeft < leftBoundary - EPS){
      setScrollInstant(track.scrollLeft + nReal * s);
    } else if (track.scrollLeft > rightBoundary + EPS){
      setScrollInstant(track.scrollLeft - nReal * s);
    }
    updatePager();
  }

  function snapTo(direction){
    const s = slotSize();
    const step = s * CARDS_PER_VIEW;
    track.scrollTo({ left: track.scrollLeft + direction * step, behavior: 'smooth' });
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => jumpIfNeeded(), 280);
  }

  function initInfinite(){
    killClones();
    makeClones();
    const s = slotSize();
    setScrollInstant(s * CLONES);
    updatePager();
  }

  // === Listeners ===
  prev?.addEventListener('click', () => snapTo(-1));
  next?.addEventListener('click', () => snapTo( 1));

  track.addEventListener('scroll', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      jumpIfNeeded();
      updatePager();
    }, 120);
  }, { passive: true });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRAF);
    resizeRAF = requestAnimationFrame(() => {
      const approxIdx = Math.round(track.scrollLeft / Math.max(1, slotSize()));
      initInfinite();
      const s = slotSize();
      setScrollInstant(s * Math.max(CLONES, approxIdx));
      updatePager();
    });
  });

  // Optional: pager dot click → jump to page
  if (pager && pagerDots.length){
    pagerDots.forEach((dot, i) => {
      dot.style.cursor = 'pointer';
      dot.addEventListener('click', () => {
        const s = slotSize();
        const leftBoundary = s * CLONES;
        track.scrollTo({ left: leftBoundary + i * CARDS_PER_VIEW * s, behavior: 'smooth' });
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => jumpIfNeeded(), 300);
      });
    });
  }

  // init
  if (next) next.disabled = false;
  if (prev) prev.disabled = false;
  initInfinite();
}

/* ---------- 3) Likes: localStorage + (debounced) server sync ---------- */
const LIKES_KEY = 'likes_v1';

function getLikes() {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (e) {
    console.warn('Failed to read likes:', e);
    return new Set();
  }
}

function saveLikes(set) {
  try {
    localStorage.setItem(LIKES_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn('Failed to save likes:', e);
  }
}

function getCardImageSrcFromButton(btn) {
  const card = btn.closest('.card');
  if (!card) return null;
  const img = card.querySelector('.card__img');
  if (!img) return null;
  return img.getAttribute('src') || img.src || null;
}

function hydrateLikedStates() {
  const likes = getLikes();
  document.querySelectorAll('.card').forEach(card => {
    const btn = card.querySelector('.card__like-btn');
    const img = card.querySelector('.card__img');
    if (!btn || !img) return;
    const src = img.getAttribute('src') || img.src;
    btn.classList.toggle('is-liked', likes.has(src));
  });
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.card__like-btn');
  if (!btn) return;

  e.preventDefault();

  const src = getCardImageSrcFromButton(btn);
  if (!src) return;

  const likes = getLikes();

  // toggle UI first
  const nowLiked = !btn.classList.contains('is-liked');
  btn.classList.toggle('is-liked', nowLiked);

  if (nowLiked) likes.add(src);
  else likes.delete(src);

  // 1) persist locally
  saveLikes(likes);

  // 2) sync to server (debounced)
  scheduleServerSync();
});

/* Export / Import helpers (optional buttons in HTML) */
const exportBtn = document.getElementById('export-likes');
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    const likes = Array.from(getLikes());
    const blob = new Blob([JSON.stringify(likes, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'likes.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}

const importBtn = document.getElementById('import-likes');
const importFile = document.getElementById('import-file');

if (importBtn && importFile) {
  importBtn.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', async () => {
    const file = importFile.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const arr = JSON.parse(text);
      if (!Array.isArray(arr)) throw new Error('Invalid JSON');
      saveLikes(new Set(arr));
      hydrateLikedStates();
      alert('Likes imported ✅');
    } catch (e) {
      alert('Failed to import likes.json ❌');
      console.error(e);
    } finally {
      importFile.value = '';
    }
  });
}

/* Debounced server sync */
let syncTimer = 0;

async function pushLikesToServer(likesArray){
  try {
    const res = await fetch('/api/save-likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(likesArray),
    });
    if (!res.ok) throw new Error(await res.text());
    // success (silent)
  } catch (err) {
    console.error('Server sync failed:', err);
    // optionally enqueue retry here
  }
}

function scheduleServerSync() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    const likes = Array.from(getLikes()); // read latest
    pushLikesToServer(likes);
  }, 250);
}

/* ---------- 4) Boot sequence ---------- */
document.addEventListener('images:ready', initSlider);
document.addEventListener('DOMContentLoaded', () => {
  // Load images from server and hydrate likes, then init slider via event.
  loadServerImagesAndHydrate();
  // If someone removes the dynamic loader, still init with static HTML cards.
  if (document.querySelector('[data-track] .card')) {
    // Give the DOM a tick to layout, then init if images:ready never fires.
    setTimeout(() => {
      // If slider not yet initialized (no clones), go ahead.
      const hasClones = !!document.querySelector('[data-track] [data-clone]');
      if (!hasClones) initSlider();
    }, 200);
  }
});
