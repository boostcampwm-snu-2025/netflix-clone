// /js/menus.js
export function initHeaderMenus() {
    const menus = document.querySelectorAll('.menu');
  
    const setExpanded = (menu, open) => {
      const trigger = menu.querySelector('.menu__trigger');
      if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
  
    menus.forEach((menu) => {
      const trigger = menu.querySelector('.menu__trigger');
      if (!trigger) return;

      menu.addEventListener('mouseenter', () => setExpanded(menu, true));
      menu.addEventListener('mouseleave', () => setExpanded(menu, false));

      menu.addEventListener('focusin',  () => setExpanded(menu, true));
      menu.addEventListener('focusout', (e) => {
        if (!menu.contains(e.relatedTarget)) setExpanded(menu, false);
      });
    });
  }
  