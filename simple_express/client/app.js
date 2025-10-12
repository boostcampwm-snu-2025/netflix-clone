const form = document.getElementById('searchForm');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('q').value;

    // API 호출
    const response = await fetch(`http://localhost:3001/api/search?q=${query}`);
    const data = await response.json();

    // 결과 화면에 표시
    resultsDiv.innerHTML = data.items.map(movie => `
                <img src="${movie.image}" alt="${movie.name}" title="${movie.name}">
            `).join('');
});