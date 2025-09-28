export function initCarousel() {
  const carousels = document.querySelectorAll(".carousel-container");

  carousels.forEach((container) => {
    const track = container.querySelector(".carousel-track");
    const prevBtn = container.querySelector(".prev");
    const nextBtn = container.querySelector(".next");
    const paginationContainer =
      container.parentElement.querySelector(".pagination");
    const cards = Array.from(track.children);
    const visible = parseInt(container.dataset.visible); // 한 화면에 보이는 카드 개수
    const total = cards.length;

    let pageIndex = 0;

    // 총 페이지 수
    const totalPages = Math.ceil(total / visible);

    // 페이지네이션(dot) 생성
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      paginationContainer.appendChild(dot);
    }
    const dots = paginationContainer.querySelectorAll("span");

    // 위치 업데이트
    function updateCarousel() {
      const cardWidth = cards[0].offsetWidth + 16; // 카드 너비 + gap
      const offset = -(pageIndex * visible * cardWidth);
      track.style.transform = `translateX(${offset}px)`;
      //여기에, 만약에 보이는 페이지가 visible 변수보다 작으면 처음 페이지의 카드들을 바로 가져다 붙이는 작업이 필요할 것 같은데(당연히 가져다 붙인 카드들은 두 번째 페이지에선 제외되어야겠지..!), 어떻게 구현을 하면 좋을까?

      dots.forEach((dot) => dot.classList.remove("active"));
      dots[pageIndex % totalPages].classList.add("active");
    }

    // 버튼 이벤트 (페이지 단위로 이동)
    prevBtn.addEventListener("click", () => {
      pageIndex = (pageIndex - 1 + totalPages) % totalPages;
      updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
      pageIndex = (pageIndex + 1) % totalPages;
      updateCarousel();
    });
  });
}
