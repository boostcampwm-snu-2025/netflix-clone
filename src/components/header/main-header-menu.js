export class MainHeaderMenu extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const contents = this.getAttribute("contents") || "";
    const href = this.getAttribute("href") || "#";
    const active = this.hasAttribute("active");

    this.innerHTML = `
      <li class="nav-item">
        <a href="${href}" ${active ? 'class="active"' : ""}>${contents}</a>
      </li>
    `;

    // 접근성 속성 추가
    if (active) {
      const link = this.querySelector("a");
      if (link) {
        link.setAttribute("aria-current", "page");
      }
    }
  }
}
