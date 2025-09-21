/**
 * @async
 * @function loadJsonData
 *
 * @param {string} url
 *
 * @returns {Promise<unknown>}
 */
export async function loadJsonData(url) {
  const response = await fetch(url);
  return await response.json();
}

/**
 * @async
 * @function loadSvgElement
 *
 * @param {string} url
 *
 * @returns {Promise<string>}
 */
export async function loadSvgElement(url) {
  const response = await fetch(url);
  return await response.text();
}
