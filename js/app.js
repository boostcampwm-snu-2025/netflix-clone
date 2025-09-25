import { mainRender } from './render/mainRender.js';
import { heroRender } from './render/heroRender.js';
import { headerRender } from './render/headerRender.js';
import { footerRender } from './render/footerRender.js';
import { initializeFiniteCarousel, initializeInfiniteCarousel } from './carousel.js';
import { initializeHeaderInteraction } from './header.js';


// 3. 페이지 로드 시 실행될 메인 함수
function init() {
    // 3-1. 각 섹션의 HTML을 페이지에 렌더링
    headerRender();
    heroRender();
    mainRender();
    footerRender();

    // 3-2. 렌더링된 HTML 요소에 기능(이벤트 리스너 등) 추가
    setupAllCarousels();
    initializeHeaderInteraction();
}

// 페이지의 모든 캐러셀을 설정하는 메인 함수
function setupAllCarousels() {
    // '회원님 추천 콘텐츠' 캐러셀에는 '유한' 캐러셀 함수를 적용
    initializeFiniteCarousel('.carousel-container__for-user', { visible: 6, move: 5 });

    // Top 10, New_content 캐러셀에는 '무한' 캐러셀 함수를 적용, to-do: 캐러셀 개선 필요
    initializeFiniteCarousel('.carousel-container__top10', { move: 5 });
    initializeInfiniteCarousel('.carousel-container__new', { move: 5 });
}

document.addEventListener('DOMContentLoaded', init);