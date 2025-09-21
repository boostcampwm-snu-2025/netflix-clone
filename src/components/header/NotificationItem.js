/**
 * @typedef {Object} Item
 * @property {number} order
 * @property {string} title
 * @property {string} description
 * @property {string} age
 */

/**
 * @function NotificationItem
 *
 * @param {RankItem} item
 *
 * @returns {string}
 */
export function NotificationItem(item) {
  return `
    <li class="notification-item">
      <a href="#">
        <img src="assets/header/notifications/${item.order}.png" alt="${item.title}" />
      </a>
      <a href="#">
        <div>${item.title}</div>
        <div>${item.description}</div>
        <div>${item.age}</div>
      </a>
    </li>
  `;
}