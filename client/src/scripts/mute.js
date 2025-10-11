export function initMuteButton(selector = '.mute-btn') {
  const muteBtn = document.querySelector(selector);
  if (!muteBtn) return;
  const icon = muteBtn.querySelector('i');
  const initialAttr = muteBtn.getAttribute('data-initial-muted');
  let muted = initialAttr ? initialAttr === 'true' : true;
  const update = () => {
    if (icon) icon.className = muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    muteBtn.setAttribute('aria-label', muted ? '음소거 해제' : '음소거');
  };
  muteBtn.addEventListener('click', () => {
    muted = !muted;
    update();
  });
  update();
}
