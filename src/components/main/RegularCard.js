/**
 * @typedef {Object} Item
 * @property {number} order
 * @property {string} title
 */

/**
 * @function RegularCard
 *
 * @param {Item} item
 *
 * @returns {string}
 */
export function RegularCard(item) {
  return `
<li class="card">
  <a href="#">
    <img class="item" src="assets/main/new/${item.order}.png" alt="${item.title}">
  </a>
</li>
`.trim();
}
