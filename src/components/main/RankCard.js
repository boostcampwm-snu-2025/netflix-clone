/**
 * @typedef {Object} RankItem
 * @property {number} rank
 * @property {string} title
 */

/**
 * @function RankCard
 *
 * @param {RankItem} item
 * @param {string} type
 *
 * @returns {string}
 */
export function RankCard(item, type) {
  return `
<li class="card">
  <a href="#">
    <img class="rank" src="assets/main/rank/${item.rank}.svg" alt="rank ${item.rank}">
    <img class="item" src="assets/main/${type}/${item.rank}.png" alt="${item.title}">
  </a>
</li>
`.trim();
}
