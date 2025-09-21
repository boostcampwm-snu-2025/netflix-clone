import { loadTemplate, loadStyle } from '../utils.js';

class LanguageSelect extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const template = await loadTemplate('./template.html', import.meta.url);
    const style = await loadStyle('./style.css', import.meta.url);
    document.head.appendChild(style);

    this.appendChild(template.content.cloneNode(true));

    const selectWrapper = this.querySelector('.language-select');
    const select = this.querySelector('.language-select__dropdown');

    selectWrapper.addEventListener('click', () => {
      select.focus();
    });

    select.addEventListener('blur', () => {
      selectWrapper.classList.remove('focus-within');
    });
  }
}

customElements.define('language-select', LanguageSelect);
