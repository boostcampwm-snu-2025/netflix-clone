/**
 * @function Pagination
 *
 * @param {number} length
 * @param {number} pageSize
 *
 * @returns {string}
 */
export function Pagination(length, pageSize) {
  return `
<div class="page-indicator">
  ${Array.from({ length: Math.ceil(length / pageSize) }, () => "<span></span>").join("")}
</div>
`.trim();
}
