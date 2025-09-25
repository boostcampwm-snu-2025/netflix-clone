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
        if (sectionData.cardType === 'rank') {
          const isTen = item.rank === 10;
          return `
            <div class="card__top10 card">
                ${isTen ? `<span class="rank-card__num--cutting"><span class="rank-card__num">${item.rank}</span></span>` : `<span class="rank-card__num">${item.rank}</span>`}
                <img src="${item.imgSrc}" class="rank-card__img" alt="${item.alt}">
            </div>`;
        } else {
          return `<img src="${item.imgSrc}" class="${item.cardClass} card" alt="${item.alt}">`;
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