// Very small hash router to keep header/footer persistent while swapping main content

export function initRouter(routes) {
  const parseHash = () => {
    const rawHash = window.location.hash || '#/';
    // Ensure leading '#/'
    let h = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
    if (!h.startsWith('/')) h = '/' + h;
    const [pathname, search = ''] = h.split('?');
    const routeKey = '#' + pathname; // e.g., '#/search'
    const query = Object.fromEntries(new URLSearchParams(search));
    return { routeKey, pathname, query, rawHash: rawHash };
  };

  const render = () => {
    const ctx = parseHash();
    const handler = routes[ctx.routeKey] || routes['#/404'] || (() => {});
    handler(ctx);
  };

  window.addEventListener('hashchange', render);
  render();

  return { navigateTo };
}

export function navigateTo(path) {
  if (!path.startsWith('#/')) path = '#/' + path.replace(/^#?\/?/, '');
  if (window.location.hash === path) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = path;
  }
}
