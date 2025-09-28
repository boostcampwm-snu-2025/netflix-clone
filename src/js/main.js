import { initSliders } from './slider.js';

import { fetchCardsData, renderCards } from './fetch.js';

// document.addEventListener('DOMContentLoaded', () => {
//     initSliders();
// });

document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchCardsData();
  renderCards('.custom_list .slides', data.wish, 'wish');
  renderCards('.watching_list .slides', data.watching, 'watching');
  renderCards('.recommends .slides', data.recommend, 'recommend');
  renderCards('.top10_list_section .slides', data.top10, 'top10');
  initSliders();
});