export function initSearchToggle() {
  const search = document.querySelector('.header .user-menu .search');
  if (!search) return;

  const pop = search.querySelector('.search-pop');
  const input = search.querySelector('.search-input');
  const icon = search.querySelector('.search-icon');
  if (!pop || !input || !icon) return;

  const open = () => {
    search.classList.add('is-open');
    requestAnimationFrame(() => {
      input.focus();
      const val = input.value;
      input.value = '';
      input.value = val;
    });
  };

  const close = () => {
    search.classList.remove('is-open');
  };

  const toggle = () => {
    if (search.classList.contains('is-open')) close();
    else open();
  };

  const onActivatorClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  icon.addEventListener('click', onActivatorClick);
  search.addEventListener('click', onActivatorClick);

  pop.addEventListener('click', (e) => e.stopPropagation());

  document.addEventListener('click', () => {
    if (search.classList.contains('is-open')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = input.value.trim();
      if (query) {
        window.location.href = `#/search?query=${encodeURIComponent(query)}`;
      }
    }
  });
}
