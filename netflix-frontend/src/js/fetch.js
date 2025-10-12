export async function fetchCardsData() {
  const res = await fetch('/data/cards.json');
  return await res.json();
}

function createCardHTML(card, type) {
  if (type === 'top10') {
    return `
      <li class="movie_card2">
        <span class="rank">${card.rank}</span>
        <img src="${card.img}" alt="${card.title}">
      </li>
    `;
  }
  return `
    <li class="movie_card1">
      <img src="${card.img}" alt="${card.title}">
      <h3>${card.title}</h3>
    </li>
  `;
}

export function renderCards(listSelector, cards, type) {
  const ul = document.querySelector(listSelector);
  if (!ul) return;
  ul.innerHTML = cards.map(card => createCardHTML(card, type)).join('');
}