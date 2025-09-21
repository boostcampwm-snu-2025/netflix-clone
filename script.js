(function () {
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
    // Prefer the DOM pager count if present; fallback to data-driven
    if (pagerDots.length > 0) return pagerDots.length;
    const nReal = realCards().length;
    return Math.max(1, Math.ceil(nReal / CARDS_PER_VIEW));
  }

  function normalizeMod(i, m){
    // always positive modulo
    return ((i % m) + m) % m;
  }

  function currentRealPage(){
    const s = slotSize();
    const nReal = realCards().length;
    if (nReal === 0 || s === 0) return 0;

    const leftBoundary = s * CLONES;
    // index of the leftmost visible card within the virtual (cloned) list
    const virtualIdxFloat = (track.scrollLeft - leftBoundary) / s;
    // bring it to [0, nReal)
    const realCardIdx = normalizeMod(Math.round(virtualIdxFloat), nReal);
    // map to page
    const page = Math.floor(realCardIdx / CARDS_PER_VIEW);
    return normalizeMod(page, realPageCount());
  }

  function renderPager(activeIdx){
    if (!pager || pagerDots.length === 0) return;
    for (let i=0;i<pagerDots.length;i++){
      const dot = pagerDots[i];
      // reset both classes then set the one we want
      dot.classList.remove('pager__box_on','pager__box_off');
      dot.classList.add(i === activeIdx ? 'pager__box_on' : 'pager__box_off');
    }
  }

  function updatePager(){
    renderPager(currentRealPage());
  }

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
  prev.addEventListener('click', () => snapTo(-1));
  next.addEventListener('click', () => snapTo( 1));

  track.addEventListener('scroll', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      jumpIfNeeded();     // handles teleport + pager update
      updatePager();      // also update during normal scrolling
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

  // Optional: clicking a pager dot jumps to that page (nice UX)
  if (pager && pagerDots.length){
    pagerDots.forEach((dot, i) => {
      dot.style.cursor = 'pointer';
      dot.addEventListener('click', () => {
        const s = slotSize();
        // jump to the start of that real page from the leftBoundary
        const leftBoundary = s * CLONES;
        track.scrollTo({ left: leftBoundary + i * CARDS_PER_VIEW * s, behavior: 'smooth' });
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => jumpIfNeeded(), 300);
      });
    });
  }

  // init
  next.disabled = false;
  prev.disabled = false;
  initInfinite();
})();