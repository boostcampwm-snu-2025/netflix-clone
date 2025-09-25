import { heroData } from '../data/heroData.js';

export function heroRender() {
  const container = document.getElementById('hero-container');
  if (!container) return;

  container.innerHTML = `
    <a href="#"><img src="${heroData.background.src}" class="hero__background" alt="${heroData.background.alt}"></a>
    <div class="hero__content">
        <img src="${heroData.titleImg.src}" class="hero__title-img" alt="${heroData.titleImg.alt}">
        <div class="hero__ranking">
            <img src="${heroData.ranking.badge.src}" class="hero__ranking-badge" alt="${heroData.ranking.badge.alt}">
            <span class="hero__ranking-text">${heroData.ranking.text}</span>
        </div>
        <div class="hero__description">${heroData.description}</div>
        <div class="hero__actions">
            <div class="hero__actions--button">
                <button class="button button--play">
                    <img src="${heroData.buttons.play.icon}" class="button--play--img" alt="play_sign">    
                    <span>${heroData.buttons.play.text}</span>
                </button>
                <button class="button button--info">
                    <img src="${heroData.buttons.info.icon}" class="button--info--img" alt="info_sign">    
                    <span class="button--info--text">${heroData.buttons.info.text}</span>
                </button>
            </div>
            <div class="hero__actions--meta">
                <img src="${heroData.meta.soundIcon.src}" class="hero__sound-icon" alt="${heroData.meta.soundIcon.alt}">
                <span class="hero__age-rating">${heroData.meta.ageRating}</span>
            </div>
        </div>
    </div>
  `;
}