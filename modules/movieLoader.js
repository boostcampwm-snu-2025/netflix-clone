export async function loadMovies() {
  const res = await fetch("/mocks/movies.json");
  const data = await res.json();
  //

  const main = document.querySelector(".main");

  data.categories.forEach((category) => {
    const section = document.createElement("section");
    section.className = "category";

    section.innerHTML = `
      <h3 id="${category.id}" class="category__title">
        ${category.title}
        <div class="pagination"></div>
      </h3>
      <div class="carousel-container" data-visible="5">
        <button class="prev">〈</button>
        <ul class="carousel-track row"></ul>
        <button class="next">〉</button>
      </div>
    `;

    const track = section.querySelector(".carousel-track");

    category.movies.forEach((movie) => {
      const li = document.createElement("li");
      li.className = "card";
      li.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}" />
        <p class="movie-title">${movie.title}</p>
        <p class="movie-desc">${movie.description}</p>
        <button class="like-btn">🤍</button>
        <button class="bookmark-btn">찜하기</button>
      `;
      track.appendChild(li);
    });

    main.appendChild(section);
  });
}
