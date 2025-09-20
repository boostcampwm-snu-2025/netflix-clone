// 페이지 로드 완료 후 모든 캐러셀 실행
window.addEventListener('load', setupAllCarousels);

// 페이지의 모든 캐러셀을 설정하는 메인 함수
function setupAllCarousels() {
    // '회원님 추천 콘텐츠' 캐러셀에는 '유한' 캐러셀 함수를 적용
    initializeFiniteCarousel('.for_user-carousel', { visible: 6, move: 5 });
    // Top 10 캐러셀에는 '무한' 캐러셀 함수를 적용
    initializeInfiniteCarousel('.top10-carousel', { move: 5 });
}


// 1. 유한 캐러셀 (Finite Carousel: 양 끝에서 멈추는 방식)
function initializeFiniteCarousel(containerSelector, options) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const wrapper = container.querySelector('.carousel-wrapper');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');
    const cards = wrapper.querySelectorAll('.card');

    const SLIDES_TO_MOVE = options?.move || 5;
    const VISIBLE_SLIDES = options?.visible || 6;
    const TOTAL_CARDS = cards.length;

    if (TOTAL_CARDS <= VISIBLE_SLIDES) {
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
        return;
    }

    const MAX_INDEX = TOTAL_CARDS - VISIBLE_SLIDES;
    let currentIndex = 0;
    let isMoving = false;
    const slideWidth = cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;

    if (slideWidth === 0) {
        console.error("Finite Carousel: Card width is 0. Check CSS or timing.");
        return;
    }

    wrapper.style.transform = `translateX(0px)`;
    updateButtonStates();

    nextBtn.addEventListener('click', () => {
        if (isMoving) return;
        isMoving = true;
        currentIndex = Math.min(currentIndex + SLIDES_TO_MOVE, MAX_INDEX);
        wrapper.style.transition = 'transform 0.5s ease-out';
        wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    });

    prevBtn.addEventListener('click', () => {
        if (isMoving) return;
        isMoving = true;
        currentIndex = Math.max(currentIndex - SLIDES_TO_MOVE, 0);
        wrapper.style.transition = 'transform 0.5s ease-out';
        wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    });

    wrapper.addEventListener('transitionend', () => {
        isMoving = false;
        updateButtonStates();
    });

    function updateButtonStates() {
        if (prevBtn) prevBtn.disabled = (currentIndex === 0);
        if (nextBtn) nextBtn.disabled = (currentIndex === MAX_INDEX);
    }
}


// 2. 무한 캐러셀 (Infinite Carousel: 양 끝에서 순환하는 방식)
function initializeInfiniteCarousel(containerSelector, options) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const wrapper = container.querySelector('.carousel-wrapper');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');
    let originalCards = wrapper.querySelectorAll('.card');

    const SLIDES_TO_MOVE = options?.move || 5;

    if (originalCards.length <= SLIDES_TO_MOVE) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    const TOTAL_ORIGINAL_CARDS = originalCards.length;

    for (let i = 0; i < SLIDES_TO_MOVE; i++) {
        wrapper.appendChild(originalCards[i].cloneNode(true));
    }
    for (let i = TOTAL_ORIGINAL_CARDS - 1; i >= TOTAL_ORIGINAL_CARDS - SLIDES_TO_MOVE; i--) {
        wrapper.prepend(originalCards[i].cloneNode(true));
    }

    let allCards = wrapper.querySelectorAll('.card');
    
    const setupCarouselAfterRender = () => {
        const slideWidth = allCards[SLIDES_TO_MOVE + 1].getBoundingClientRect().left - allCards[SLIDES_TO_MOVE].getBoundingClientRect().left;

        if (slideWidth === 0) {
            requestAnimationFrame(setupCarouselAfterRender);
            return;
        }

        let currentIndex = SLIDES_TO_MOVE;
        let isMoving = false;

        wrapper.style.transition = 'none';
        wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        nextBtn.addEventListener('click', () => {
            if (isMoving) return;
            isMoving = true;
            currentIndex += SLIDES_TO_MOVE;
            wrapper.style.transition = 'transform 0.5s ease-out';
            wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        });

        prevBtn.addEventListener('click', () => {
            if (isMoving) return;
            isMoving = true;
            currentIndex -= SLIDES_TO_MOVE;
            wrapper.style.transition = 'transform 0.5s ease-out';
            wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        });

        wrapper.addEventListener('transitionend', () => {
            isMoving = false;
            if (currentIndex >= TOTAL_ORIGINAL_CARDS + SLIDES_TO_MOVE) {
                currentIndex = SLIDES_TO_MOVE;
                wrapper.style.transition = 'none';
                wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            }
            if (currentIndex <= 0) {
                currentIndex = TOTAL_ORIGINAL_CARDS;
                wrapper.style.transition = 'none';
                wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            }
        });
    };
    
    requestAnimationFrame(setupCarouselAfterRender);
}