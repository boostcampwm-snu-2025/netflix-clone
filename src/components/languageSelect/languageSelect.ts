import { loadTemplate } from '../utils.ts';
import './style.css';

class LanguageSelect extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback(): Promise<void> {
    const template = await loadTemplate('./template.html', import.meta.url);
    this.appendChild(template.content.cloneNode(true));

    const selectWrapper = this.querySelector('.language-select') as HTMLElement;
    const select = this.querySelector(
      '.language-select__dropdown'
    ) as HTMLSelectElement;

    selectWrapper?.addEventListener('click', () => {
      select?.focus();
    });

    select?.addEventListener('blur', () => {
      selectWrapper?.classList.remove('focus-within');
    });
  }
}

customElements.define('language-select', LanguageSelect);

export default LanguageSelect;
