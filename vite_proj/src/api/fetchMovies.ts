const items_per_page = 6;

export interface Movie {
  title: string;
  image: string;
}

export async function fetch_movies_for_row(
  slider_content: HTMLElement,
  num_img: number = items_per_page
): Promise<Movie[]> {
  try {
    const res = await fetch(`http://localhost:3000/api/data?num_img=${num_img}`);
    if (!res.ok) throw new Error("http error " + res.status);

    const movies: Movie[] = await res.json();
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

    // make sure DOM is updated before init
    await new Promise(requestAnimationFrame);

    return movies;
  } catch (err: any) {
    slider_content.innerHTML = `<p>❌ error: ${err.message}</p>`;
    return [];
  }
}


export async function get_search_results(query: string, num_img: number = 20): Promise<Movie[]> {
  try {
    console.log(`🔎 Searching for: ${query}`);
    const res = await fetch(`http://localhost:3000/api/search_test?query=${encodeURIComponent(query)}&num_img=${num_img}`);

    if (!res.ok) throw new Error("http error " + res.status);

    const data = await res.json();
    const movies: Movie[] = data.results || [];

    // normalize image URLs so they work from vite (5173)
    movies.forEach(movie => {
      if (!movie.image.startsWith("http")) {
        movie.image = `http://localhost:3000${movie.image}`;
      }
    });

    console.log(`✅ Found ${movies.length} results`);
    return movies;

  } catch (err: any) {
    console.error("❌ search error:", err.message);
    return [];
  }
}
