import { loadTemplate, loadStyle, processNamedSlots } from '../utils.ts';

class FaqAccordion extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback(): Promise<void> {
    const template = await loadTemplate('./template.html', import.meta.url);
    const style = await loadStyle('./style.css', import.meta.url);
    document.head.appendChild(style);

    this.appendChild(template.content.cloneNode(true));
    processNamedSlots(this);

    this.setupEventListeners();
  }

  setupEventListeners(): void {
    const button = this.querySelector('button') as HTMLButtonElement;
    const answer = this.querySelector('.answer') as HTMLElement;

    button?.addEventListener('click', () => {
      const isOpen = answer.style.display === 'block';

      if (isOpen) {
        this.close();
      } else {
        this.dispatchEvent(new CustomEvent('faq-open', { bubbles: true }));
        this.open();
      }
    });
  }

  open(): void {
    const answer = this.querySelector('.answer') as HTMLElement;
    const icon = this.querySelector('img') as HTMLImageElement;
    const button = this.querySelector('button') as HTMLButtonElement;

    if (answer) answer.style.display = 'block';
    if (icon) icon.style.transform = 'rotate(45deg)';
    if (button) button.setAttribute('aria-expanded', 'true');
  }

  close(): void {
    const answer = this.querySelector('.answer') as HTMLElement;
    const icon = this.querySelector('img') as HTMLImageElement;
    const button = this.querySelector('button') as HTMLButtonElement;

    if (answer) answer.style.display = 'none';
    if (icon) icon.style.transform = 'rotate(0deg)';
    if (button) button.setAttribute('aria-expanded', 'false');
  }
}

customElements.define('faq-accordion', FaqAccordion);

export default FaqAccordion;
