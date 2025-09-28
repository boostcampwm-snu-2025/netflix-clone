import { headerRender } from './render/headerRender.js';
import { heroRender } from './render/heroRender.js';
import { toggleLike } from './animation/likedState.js';
import { mainRender } from './render/mainRender.js';
import { footerRender } from './render/footerRender.js';
import { initializeFiniteCarousel, initializeInfiniteCarousel, initializeCarousel } from './animation/carousel.js';
import { initializeHeaderInteraction } from './animation/modal.js';


async function init() {
    await headerRender();
    await heroRender();
    await mainRender();
    await footerRender();
    setupLikeButtonListener();
    setupAllCarousels();
    initializeHeaderInteraction();
}

// 이벤트 상속
function setupLikeButtonListener() {
    const contentContainer = document.getElementById('main-content-container');

    contentContainer.addEventListener('click', (event) => {
        // 클릭된 요소 또는 그 부모 중에서 .like-button을 찾음
        const button = event.target.closest('.like-button');
        if (!button) return;
        const { contentId } = button.dataset;
        // likeState의 상태를 변경하고, 변경된 상태(true/false)를 반환
        const isNowLiked = toggleLike(contentId);
        // 반환된 상태에 따라 .liked 클래스를 추가하거나 제거
        button.classList.toggle('liked', isNowLiked);
    });
}


function setupAllCarousels() {
    initializeFiniteCarousel('.carousel-container__for-user', { visible: 6, move: 5 });
    initializeInfiniteCarousel('.carousel-container__top10', { move: 5 });
    initializeCarousel('.carousel-container__new', { visible: 6, move: 5 });
}

document.addEventListener('DOMContentLoaded', init);