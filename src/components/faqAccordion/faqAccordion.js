import { loadTemplate, loadStyle, processNamedSlots } from '../utils.js';

class FaqAccordion extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const template = await loadTemplate('./template.html', import.meta.url);
    const style = await loadStyle('./style.css', import.meta.url);
    document.head.appendChild(style);

    this.appendChild(template.content.cloneNode(true));
    processNamedSlots(this);

    this.setupEventListeners();
  }
  setupEventListeners() {
    const button = this.querySelector('button');
    const answer = this.querySelector('.answer');

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
    const answer = this.querySelector('.answer');
    const icon = this.querySelector('img');
    answer.style.display = 'block';
    icon.style.transform = 'rotate(45deg)';
    this.querySelector('button').setAttribute('aria-expanded', 'true');
  }

  close() {
    const answer = this.querySelector('.answer');
    const icon = this.querySelector('img');
    answer.style.display = 'none';
    icon.style.transform = 'rotate(0deg)';
    this.querySelector('button').setAttribute('aria-expanded', 'false');
  }
}

customElements.define('faq-accordion', FaqAccordion);
