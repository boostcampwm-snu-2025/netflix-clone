import { fetch_movies_for_row } from '../api/fetchMovies';

const items_per_page = 6;

export class Slider {
  private wrapper: HTMLElement;
  private slider_content: HTMLElement;
  private slider_mask: HTMLElement;
  private prev_btn: HTMLButtonElement;
  private next_btn: HTMLButtonElement;

  private items_per_page: number;
  private clones: number;
  private current_index: number;
  private is_animating: boolean;
  private has_clicked: boolean;

  constructor(wrapper: HTMLElement, items_per_page: number = 6) {
    this.wrapper = wrapper;
    this.slider_content = wrapper.querySelector(".sliderContent") as HTMLElement;
    this.slider_mask = wrapper.querySelector(".sliderMask") as HTMLElement;
    this.prev_btn = wrapper.querySelector(".prev") as HTMLButtonElement;
    this.next_btn = wrapper.querySelector(".next") as HTMLButtonElement;

    this.items_per_page = items_per_page;
    this.clones = items_per_page + 1;
    this.current_index = this.clones;
    this.is_animating = false;
    this.has_clicked = false;

    this.setup();
    this.add_listeners();
  }

  private setup(): void {
    const items = Array.from(this.slider_content.querySelectorAll(".slider-item"));
    const original_count = items.length;

    // clear then rebuild with clones
    this.slider_content.innerHTML = "";

    // last clones at front
    const start_index = Math.max(0, original_count - this.clones);
    for (let i = start_index; i < original_count; i++) {
      this.slider_content.appendChild(items[i].cloneNode(true));
    }
    // originals
    items.forEach(item => this.slider_content.appendChild(item));
    // first clones at end
    for (let i = 0; i < Math.min(this.clones, original_count); i++) {
      this.slider_content.appendChild(items[i].cloneNode(true));
    }

    // dynamic peek padding
    const card_size = 100 / this.items_per_page;
    const peek_padding = card_size * 0.2;
    this.slider_mask.style.padding = `0 ${peek_padding}%`;

    // apply card size to items
    this.wrapper.querySelectorAll<HTMLElement>(".slider-item").forEach(item => {
      item.style.flex = `0 0 ${card_size}%`;
    });

    this.update_transform();
  }

  private update_transform(animate: boolean = false): void {
    this.slider_content.style.transition = animate ? "transform 0.6s ease" : "none";
    this.slider_content.style.transform =
      `translateX(-${this.current_index * (100 / this.items_per_page)}%)`;
  }

  private slide_next(): void {
    if (this.is_animating) return;
    this.is_animating = true;
    this.has_clicked = true;
    this.prev_btn.classList.remove("hidden");

    this.current_index += this.items_per_page;
    this.update_transform(true);

    this.slider_content.addEventListener("transitionend", () => {
      if (this.current_index >= this.slider_content.children.length - this.clones) {
        this.current_index = this.clones;
        this.update_transform(false);
      }
      this.is_animating = false;
    }, { once: true });
  }

  private slide_prev(): void {
    if (!this.has_clicked) return;
    if (this.is_animating) return;
    this.is_animating = true;

    this.current_index -= this.items_per_page;
    this.update_transform(true);

    this.slider_content.addEventListener("transitionend", () => {
      if (this.current_index < this.clones) {
        this.current_index = this.slider_content.children.length - this.clones - this.items_per_page;
        this.update_transform(false);
      }
      this.is_animating = false;
    }, { once: true });
  }

  private add_listeners(): void {
    this.next_btn.addEventListener("click", () => this.slide_next());
    this.prev_btn.addEventListener("click", () => this.slide_prev());
  }
}
