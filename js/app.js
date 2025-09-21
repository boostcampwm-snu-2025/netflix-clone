import { initializeFiniteCarousel, initializeInfiniteCarousel } from './carousel.js';
import { initializeHeaderInteraction } from './header.js';

// 페이지 로드 완료 후 모든 기능 실행
window.addEventListener('load', () => {
    setupAllCarousels();
    initializeHeaderInteraction();
});

// 페이지의 모든 캐러셀을 설정하는 메인 함수
function setupAllCarousels() {
    // '회원님 추천 콘텐츠' 캐러셀에는 '유한' 캐러셀 함수를 적용
    initializeFiniteCarousel('.for_user-carousel', { visible: 6, move: 5 });

    // Top 10, New_content 캐러셀에는 '무한' 캐러셀 함수를 적용
    initializeInfiniteCarousel('.top10-carousel', { move: 5 });
    initializeInfiniteCarousel('.new-carousel', { move: 5 });
}