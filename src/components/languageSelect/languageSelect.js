import { loadTemplate, loadStyle } from '../utils.js';

class LanguageSelect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const template = await loadTemplate('./template.html', import.meta.url);
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const style = await loadStyle('./style.css', import.meta.url);
    this.shadowRoot.appendChild(style);

    const selectWrapper = this.shadowRoot.querySelector('.select-wrapper');
    const select = this.shadowRoot.querySelector('.select-wrapper select');

    selectWrapper.addEventListener('click', () => {
      select.focus();
    });

    select.addEventListener('blur', () => {
      selectWrapper.classList.remove('focus-within');
    });
  }
}

customElements.define('language-select', LanguageSelect);
