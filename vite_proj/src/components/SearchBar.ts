export class SearchBar {
  private button: HTMLButtonElement;
  private input: HTMLInputElement;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.button = container.querySelector(".navbar-search") as HTMLButtonElement;

    // Create the input dynamically
    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.className = "navbar-search-input";
    this.input.placeholder = "제목, 사람, 장르";

    // Append input after the button
    this.container.appendChild(this.input);

    this.addListeners();
  }

  private addListeners() {
    this.button.addEventListener("click", () => {
      this.container.classList.toggle("active");
      if (this.container.classList.contains("active")) {
        this.input.focus();
      } else {
        this.input.blur();
      }
    });

    this.input.addEventListener("blur", () => {
      this.container.classList.remove("active");
    });
  }
}
