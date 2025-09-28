const bookmarkedMovies = new Set();

export function initBookmarkButtons() {
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("bookmark-btn")) {
      const btn = e.target;
      const title = btn
        .closest(".card")
        .querySelector(".movie-title").textContent;

      if (bookmarkedMovies.has(title)) {
        bookmarkedMovies.delete(title);
        btn.textContent = "찜하기";
      } else {
        bookmarkedMovies.add(title);
        btn.textContent = "찜함";
      }

      console.log("현재 찜하기 목록:", Array.from(bookmarkedMovies));
    }
  });
}
