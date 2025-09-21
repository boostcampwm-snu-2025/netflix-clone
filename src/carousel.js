class InfiniteCarousel {
  constructor(carouselId, paginationId) {
    this.carouselId = carouselId;
    this.paginationId = paginationId;
    this.track = document.getElementById(carouselId);
    this.paginationContainer = document.getElementById(paginationId);
    this.items = this.track.querySelector(
      ".recommendation-contents-list-inner"
    ).children;
    this.itemWidth = 308; // 300px width + 8px gap
    this.visibleItems = this.getVisibleItems();
    this.totalItems = this.items.length;
    this.currentIndex = 0;
    this.totalPages = Math.ceil(this.totalItems / this.visibleItems);

    this.init();
  }

  getVisibleItems() {
    const containerWidth = this.track.parentElement.clientWidth - 100; // minus nav buttons
    return Math.floor(containerWidth / this.itemWidth);
  }

  init() {
    this.cloneItems();
    this.createPagination();
    this.updateCarousel();

    window.addEventListener("resize", () => {
      this.visibleItems = this.getVisibleItems();
      this.totalPages = Math.ceil(this.totalItems / this.visibleItems);
      this.createPagination();
      this.updateCarousel();
    });
  }

  cloneItems() {
    const listInner = this.track.querySelector(
      ".recommendation-contents-list-inner"
    );

    // Clone items for infinite scroll
    for (let i = 0; i < this.totalItems; i++) {
      const clone = this.items[i].cloneNode(true);
      listInner.appendChild(clone);
    }

    // Clone again for seamless loop
    for (let i = 0; i < this.totalItems; i++) {
      const clone = this.items[i].cloneNode(true);
      listInner.appendChild(clone);
    }
  }

  createPagination() {
    this.paginationContainer.innerHTML = "";
    for (let i = 0; i < this.totalPages; i++) {
      const dot = document.createElement("div");
      dot.classList.add("pagination-dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => this.goToPage(i));
      this.paginationContainer.appendChild(dot);
    }
  }

  updateCarousel() {
    const offset = -(this.currentIndex * this.visibleItems * this.itemWidth);
    this.track.style.transform = `translateX(${offset}px)`;
    this.updatePagination();
  }

  updatePagination() {
    const dots = this.paginationContainer.querySelectorAll(".pagination-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex);
    });
  }

  slide(direction) {
    if (direction === 1) {
      // next
      this.currentIndex = (this.currentIndex + 1) % this.totalPages;
    } else {
      // prev
      this.currentIndex =
        this.currentIndex === 0 ? this.totalPages - 1 : this.currentIndex - 1;
    }

    this.updateCarousel();

    // Handle infinite loop
    setTimeout(() => {
      if (this.currentIndex === 0 && direction === -1) {
        this.track.style.transition = "none";
        const offset = -(
          (this.totalPages - 1) *
          this.visibleItems *
          this.itemWidth
        );
        this.track.style.transform = `translateX(${offset}px)`;
        setTimeout(() => {
          this.track.style.transition = "transform 0.5s ease";
        }, 50);
      }
    }, 500);
  }

  goToPage(pageIndex) {
    this.currentIndex = pageIndex;
    this.updateCarousel();
  }
}

// Initialize carousels
const carousel1 = new InfiniteCarousel("carousel1", "pagination1");
const carousel2 = new InfiniteCarousel("carousel2", "pagination2");

// Global slide function for buttons
function slideCarousel(carouselId, direction) {
  if (carouselId === "carousel1") {
    carousel1.slide(direction);
  } else if (carouselId === "carousel2") {
    carousel2.slide(direction);
  }
}
