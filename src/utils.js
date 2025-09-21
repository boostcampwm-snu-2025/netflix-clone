/**
 * @param {string} type
 * @param {string[]} classList
 * @returns {HTMLElement}
 */
export const createStyledElement = (type, classList = []) => {
  const elem = document.createElement(type);
  if (type == "a") elem.href = "#";
  if (type == "button") elem.onclick = () => { };
  elem.classList = classList;
  return elem;
};
