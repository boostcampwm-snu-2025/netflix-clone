// src/menus.ts

export function initHeaderMenus(): void {
  const menus = document.querySelectorAll<HTMLElement>('.menu');

  const setExpanded = (menu: HTMLElement, open: boolean) => {
    const trigger = menu.querySelector<HTMLElement>('.menu__trigger');
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  menus.forEach((menu) => {
    const trigger = menu.querySelector<HTMLElement>('.menu__trigger');
    if (!trigger) return;

    menu.addEventListener('mouseenter', () => setExpanded(menu, true));
    menu.addEventListener('mouseleave', () => setExpanded(menu, false));

    menu.addEventListener('focusin', () => setExpanded(menu, true));
    menu.addEventListener('focusout', (e: FocusEvent) => {
      const next = e.relatedTarget as HTMLElement | null;
      if (!next || !menu.contains(next)) setExpanded(menu, false);
    });
  });
}
