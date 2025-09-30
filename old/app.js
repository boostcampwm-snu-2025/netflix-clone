// app.js

const items_per_page = 6;
const clones = items_per_page + 1;

// fetch movies and fill slider content
async function fetch_movies_for_row(slider_content, num_img = items_per_page) {
  try {
    const res = await fetch(`http://localhost:3000/api/data?num_img=${num_img}`);
    if (!res.ok) throw new Error("http error " + res.status);

    const movies = await res.json();
    let html = "";
    movies.forEach(movie => {
      html += `
        <div class="slider-item">
          <div class="boxart-rounded">
            <img class="boxart-image"
                 src="http://localhost:3000${movie.image}"
                 alt="${movie.title}">
          </div>
        </div>`;
    });
    slider_content.innerHTML = html;

    // make sure dom is updated before init
    await new Promise(requestAnimationFrame);

    return movies;
  } catch (err) {
    slider_content.innerHTML = `<p>❌ error: ${err.message}</p>`;
    return [];
  }
}

class Slider {
  constructor(wrapper, items_per_page = 6) {
    this.wrapper = wrapper;
    this.slider_content = wrapper.querySelector(".sliderContent");
    this.slider_mask = wrapper.querySelector(".sliderMask");
    this.prev_btn = wrapper.querySelector(".prev");
    this.next_btn = wrapper.querySelector(".next");

    this.items_per_page = items_per_page;
    this.clones = items_per_page + 1;
    this.current_index = this.clones;
    this.is_animating = false;
    this.has_clicked = false;

    this.setup();
    this.add_listeners();
  }

  setup() {
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
    const peek_padding = card_size * 0.2; // 20% of a card
    this.slider_mask.style.padding = `0 ${peek_padding}%`;

    // apply card size to items
    this.wrapper.querySelectorAll(".slider-item").forEach(item => {
      item.style.flex = `0 0 ${card_size}%`;
    });

    this.update_transform();
  }

  update_transform(animate = false) {
    this.slider_content.style.transition = animate ? "transform 0.6s ease" : "none";
    this.slider_content.style.transform =
      `translateX(-${this.current_index * (100 / this.items_per_page)}%)`;
  }

  slide_next() {
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

  slide_prev() {
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

  add_listeners() {
    this.next_btn.addEventListener("click", () => this.slide_next());
    this.prev_btn.addEventListener("click", () => this.slide_prev());
  }
}

// initialize sliders after dom ready
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".sliderWrapper").forEach(wrapper => {
    const slider_content = wrapper.querySelector(".sliderContent");
    fetch_movies_for_row(slider_content, items_per_page * 3).then(() => {
      new Slider(wrapper, items_per_page);
    });
  });
});
