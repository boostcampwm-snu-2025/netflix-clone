import { loadTemplate, loadStyle } from '../utils.js';

class FaqAccordion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const template = await loadTemplate('./template.html', import.meta.url);
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const style = await loadStyle('./style.css', import.meta.url);
    this.shadowRoot.appendChild(style);

    this.setupEventListeners();
  }

  setupEventListeners() {
    const button = this.shadowRoot.querySelector('button');
    const answer = this.shadowRoot.querySelector('.answer');
    const icon = this.shadowRoot.querySelector('img');

    button.addEventListener('click', () => {
      const isOpen = answer.style.display === 'block';

      if (isOpen) {
        answer.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
        button.setAttribute('aria-expanded', 'false');
      } else {
        answer.style.display = 'block';
        icon.style.transform = 'rotate(45deg)';
        button.setAttribute('aria-expanded', 'true');
      }
    });
  }
}

customElements.define('faq-accordion', FaqAccordion);
