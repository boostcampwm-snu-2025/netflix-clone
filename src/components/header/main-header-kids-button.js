export class MainHeaderKidsButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<button class="header-icon-kids">키즈</button>`;
  }
}
