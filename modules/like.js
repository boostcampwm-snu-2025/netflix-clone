const likedMovies = new Set(); // 새로고침하면 초기화

export function initLikeButtons() {
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("like-btn")) {
      const btn = e.target;
      const title = btn
        .closest(".card")
        .querySelector(".movie-title").textContent;

      if (likedMovies.has(title)) {
        likedMovies.delete(title);
        btn.textContent = "🤍";
      } else {
        likedMovies.add(title);
        btn.textContent = "❤️";
      }

      console.log("현재 좋아요 목록:", Array.from(likedMovies));
    }
  });
}
