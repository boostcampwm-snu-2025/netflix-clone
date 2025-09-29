// app.js

const itemsPerPage = 6;
const clones = itemsPerPage + 1;

// fetch movies and fill sliderContent
async function fetchMoviesForRow(sliderContent, minNum = itemsPerPage) {
  try {
    const res = await fetch(`http://localhost:3000/api/data?min_num=${minNum}`);
    if (!res.ok) throw new Error("HTTP error " + res.status);

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
    sliderContent.innerHTML = html;

    // make sure DOM is updated before init
    await new Promise(requestAnimationFrame);

    return movies;
  } catch (err) {
    sliderContent.innerHTML = `<p>❌ Error: ${err.message}</p>`;
    return [];
  }
}

function initSlider(wrapper) {
  const sliderContent = wrapper.querySelector(".sliderContent");
  const sliderMask = wrapper.querySelector(".sliderMask");
  const prevBtn = wrapper.querySelector(".prev");
  const nextBtn = wrapper.querySelector(".next");

  let currentIndex = clones;
  let isAnimating = false;
  let hasClicked = false;

  const items = Array.from(sliderContent.querySelectorAll(".slider-item"));
  const originalCount = items.length;

  // clear then rebuild with clones
  sliderContent.innerHTML = "";

  // last clones at front
  for (let i = originalCount - clones; i < originalCount; i++) {
    sliderContent.appendChild(items[i].cloneNode(true));
  }
  // originals
  items.forEach(item => sliderContent.appendChild(item));
  // first clones at end
  for (let i = 0; i < clones; i++) {
    sliderContent.appendChild(items[i].cloneNode(true));
  }

  // set padding
  const cardSize = 100 / itemsPerPage;
  const peekPadding = cardSize * 0.2;
  sliderMask.style.padding = `0 ${peekPadding}%`;

  updateTransform();

  function updateTransform(animate = false) {
    sliderContent.style.transition = animate ? "transform 0.6s ease" : "none";
    sliderContent.style.transform = `translateX(-${currentIndex * (100 / itemsPerPage)}%)`;
  }

  function slideNext() {
    if (isAnimating) return;
    isAnimating = true;
    hasClicked = true;
    prevBtn.classList.remove("hidden");

    currentIndex += itemsPerPage;
    updateTransform(true);

    sliderContent.addEventListener("transitionend", function handler() {
      sliderContent.removeEventListener("transitionend", handler);
      if (currentIndex >= originalCount + clones) {
        currentIndex = clones;
        updateTransform(false);
      }
      isAnimating = false;
    });
  }

  function slidePrev() {
    if (!hasClicked) return;
    if (isAnimating) return;
    isAnimating = true;

    currentIndex -= itemsPerPage;
    updateTransform(true);

    sliderContent.addEventListener("transitionend", function handler() {
      sliderContent.removeEventListener("transitionend", handler);
      if (currentIndex < clones) {
        currentIndex = originalCount + clones - itemsPerPage;
        updateTransform(false);
      }
      isAnimating = false;
    });
  }

  nextBtn.addEventListener("click", slideNext);
  prevBtn.addEventListener("click", slidePrev);
}

// Initialize sliders after DOM ready
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".sliderWrapper").forEach(wrapper => {
    const sliderContent = wrapper.querySelector(".sliderContent");
    fetchMoviesForRow(sliderContent, itemsPerPage).then(() => {
      initSlider(wrapper);
    });
  });
});
