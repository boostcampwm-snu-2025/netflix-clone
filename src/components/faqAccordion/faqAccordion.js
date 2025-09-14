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
        this.close();
      } else {
        this.dispatchEvent(new CustomEvent('faq-open', { bubbles: true }));
        this.open();
      }
    });
  }

  open() {
    const answer = this.shadowRoot.querySelector('.answer');
    const icon = this.shadowRoot.querySelector('img');
    answer.style.display = 'block';
    icon.style.transform = 'rotate(45deg)';
    this.shadowRoot
      .querySelector('button')
      .setAttribute('aria-expanded', 'true');
  }

  close() {
    const answer = this.shadowRoot.querySelector('.answer');
    const icon = this.shadowRoot.querySelector('img');
    answer.style.display = 'none';
    icon.style.transform = 'rotate(0deg)';
    this.shadowRoot
      .querySelector('button')
      .setAttribute('aria-expanded', 'false');
  }
}

customElements.define('faq-accordion', FaqAccordion);
