import { isLiked } from '../animation/likedState.js';

export async function mainRender() {
  const container = document.getElementById('main-content-container');
  if (!container) return;

  const response = await fetch('./data/mainData.json');
  const mainData = await response.json();

  mainData.forEach(sectionData => {
      const sectionEl = document.createElement('section');
      sectionEl.className = 'contents';
      
      const wrapperEl = document.createElement('div');
      wrapperEl.className = `carousel-wrapper ${sectionData.wrapperClass}`;
      
      const cardsHtml = sectionData.items.map(item => {
        // 좋아요 버튼과 사진
        const likedClass = isLiked(item.id) ? 'liked' : '';
        const cardContent = `
        <img src="${item.imgSrc}" class="card__image" alt="${item.alt}">
        <button class="like-button ${likedClass}" data-content-id="${item.id}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="white" stroke-width="2" fill="none"/>
            </svg>
        </button>
        `;
        // 카드
        if (sectionData.cardType === 'rank') {
        const isTen = item.rank === 10;
        return `
          <div class="card__top10 card" data-content-id="${item.id}">
              ${isTen ? `<span class="rank-card__num--cutting"><span class="rank-card__num">${item.rank}</span></span>` : `<span class="rank-card__num">${item.rank}</span>`}
              <div class="rank-card__image-wrapper">
                ${cardContent}
              </div>
          </div>`;
      } else {
        return `
          <div class="${item.cardClass} card" data-content-id="${item.id}">
            ${cardContent}
          </div>
        `;
      }
      }).join('');

    wrapperEl.innerHTML = cardsHtml;
    
    sectionEl.innerHTML = `
      <a href="#" class="contents__title">${sectionData.title}</a>
      <div class="page-indicator"></div>
      <div class="carousel-container ${sectionData.containerClass}">
          ${wrapperEl.outerHTML}
          <button class="carousel__btn carousel__btn--prev"></button>
          <button class="carousel__btn carousel__btn--next"></button>
      </div>
    `;
    container.appendChild(sectionEl);
    
  });
}