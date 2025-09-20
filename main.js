const modalProfile = document.querySelector('.profile-wrapper');
const transTriangle = document.querySelector('.triangle');

// 'addEventListener'로 수정
modalProfile.addEventListener("mouseover", function(){
    transTriangle.classList.add('on');
});

// 'addEventListener'로 수정
modalProfile.addEventListener("mouseout", function(){
    transTriangle.classList.remove('on');
});


// 페이지 로드 완료 후 모든 캐러셀 실행
window.addEventListener('load', setupAllCarousels);

// 페이지의 모든 캐러셀을 설정하는 메인 함수
function setupAllCarousels() {
    // '회원님 추천 콘텐츠' 캐러셀에는 '유한' 캐러셀 함수를 적용
    initializeFiniteCarousel('.for_user-carousel', { visible: 6, move: 5 });

    // Top 10, New_content 캐러셀에는 '무한' 캐러셀 함수를 적용
    initializeInfiniteCarousel('.top10-carousel', { move: 5 });
    initializeInfiniteCarousel('.new-carousel', { move: 5 });
}


// ───────────────────────────────────────────────────────────────────
// ## 유한 캐러셀 (Finite Carousel: 양 끝에서 멈추는 방식)
// ───────────────────────────────────────────────────────────────────
function initializeFiniteCarousel(containerSelector, options) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const wrapper = container.querySelector('.carousel-wrapper');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');
    const cards = wrapper.querySelectorAll('.card');
    const indicator = container.previousElementSibling;

    const SLIDES_TO_MOVE = options?.move || 5;
    const VISIBLE_SLIDES = options?.visible || 6;
    const TOTAL_CARDS = cards.length;

    if (TOTAL_CARDS <= VISIBLE_SLIDES) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // --- 페이지네이션 로직 추가 ---
    const TOTAL_PAGES = Math.ceil(TOTAL_CARDS / SLIDES_TO_MOVE);
    if (indicator) {
        for (let i = 0; i < TOTAL_PAGES; i++) {
            const dot = document.createElement('span');
            dot.classList.add('indicator-dot');
            indicator.appendChild(dot);
        }
    }
    const indicatorDots = indicator?.querySelectorAll('.indicator-dot');
    
    const updateIndicator = () => {
        if (!indicatorDots) return;
        const currentPage = Math.floor(currentIndex / SLIDES_TO_MOVE);
        indicatorDots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === currentPage);
        });
    };
    // ---------------------------------

    const MAX_INDEX = TOTAL_CARDS - VISIBLE_SLIDES;
    let currentIndex = 0;
    let isMoving = false;
    const slideWidth = cards.length > 1 ? cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left : 0;

    wrapper.style.transform = `translateX(0px)`;
    updateButtonStates();
    updateIndicator(); // 초기 인디케이터 활성화

    nextBtn.addEventListener('click', () => {
        if (isMoving) return;
        isMoving = true;
        currentIndex = Math.min(currentIndex + SLIDES_TO_MOVE, MAX_INDEX);
        wrapper.style.transition = 'transform 0.5s ease-out';
        wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateIndicator(); // 이동 시 인디케이터 업데이트
    });

    prevBtn.addEventListener('click', () => {
        if (isMoving) return;
        isMoving = true;
        currentIndex = Math.max(currentIndex - SLIDES_TO_MOVE, 0);
        wrapper.style.transition = 'transform 0.5s ease-out';
        wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateIndicator(); // 이동 시 인디케이터 업데이트
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



/**
 * 페이지네이션이 포함된 무한 캐러셀을 초기화하는 최종 함수
 * @param {string} containerSelector - 캐러셀 컨테이너의 CSS 선택자
 * @param {object} options - 옵션 객체 { move: 한번에 이동할 카드 수 }
 */
function initializeInfiniteCarousel(containerSelector, options) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const wrapper = container.querySelector('.carousel-wrapper');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');
    const originalCards = Array.from(wrapper.querySelectorAll('.card'));
    const indicator = container.previousElementSibling;

    const SLIDES_TO_MOVE = options?.move || 5;
    const TOTAL_ORIGINAL_CARDS = originalCards.length;

    if (TOTAL_ORIGINAL_CARDS === 0) return;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 2; i++) {
        originalCards.forEach(card => fragment.appendChild(card.cloneNode(true)));
    }
    wrapper.appendChild(fragment);

    const TOTAL_PAGES = Math.ceil(TOTAL_ORIGINAL_CARDS / SLIDES_TO_MOVE);
    if (indicator) {
        for (let i = 0; i < TOTAL_PAGES; i++) {
            const dot = document.createElement('span');
            dot.classList.add('indicator-dot');
            indicator.appendChild(dot);
        }
    }
    const indicatorDots = indicator?.querySelectorAll('.indicator-dot');
    
    let currentIndex = TOTAL_ORIGINAL_CARDS;
    let isMoving = false;
    let slideWidth = 0;

    // ================== ✨ 여기가 수정된 부분입니다 ✨ ==================
    const applyTransform = (animate = true) => {
        const offset = currentIndex * slideWidth;
        
        // 애니메이션이 없는 '순간이동'일 경우
        if (!animate) {
            wrapper.style.transition = 'none'; // 먼저 애니메이션을 비활성화
            // setTimeout으로 위치 변경을 아주 살짝 지연시켜 브라우저가
            // 'transition: none'을 확실히 적용할 시간을 줍니다.
            setTimeout(() => {
                wrapper.style.transform = `translateX(-${offset}px)`;
            }, 0);
        } else {
            // 애니메이션이 있는 일반적인 이동일 경우
            wrapper.style.transition = 'transform 0.5s ease-out';
            wrapper.style.transform = `translateX(-${offset}px)`;
        }
    };
    // =================================================================

    const updateIndicator = () => {
        if (!indicatorDots) return;
        const baseIndex = currentIndex % TOTAL_ORIGINAL_CARDS;
        const currentPage = Math.floor(baseIndex / SLIDES_TO_MOVE);
        indicatorDots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === currentPage);
        });
    };

    const normalizeIndex = () => {
        if (currentIndex >= TOTAL_ORIGINAL_CARDS * 2) {
            currentIndex -= TOTAL_ORIGINAL_CARDS;
            applyTransform(false);
        }
        if (currentIndex < TOTAL_ORIGINAL_CARDS) {
            currentIndex += TOTAL_ORIGINAL_CARDS;
            applyTransform(false);
        }
    };

    nextBtn.addEventListener('click', () => {
        if (isMoving) return;
        isMoving = true;
        currentIndex += SLIDES_TO_MOVE;
        applyTransform(true);
        updateIndicator();
    });

    prevBtn.addEventListener('click', () => {
        if (isMoving) return;
        isMoving = true;
        currentIndex -= SLIDES_TO_MOVE;
        applyTransform(true);
        updateIndicator();
    });

    wrapper.addEventListener('transitionend', () => {
        isMoving = false; // 위치를 먼저 풀어주고
        normalizeIndex(); // 인덱스 정규화를 수행합니다.
        updateIndicator();
    });

    const runSetup = () => {
        const firstCard = wrapper.querySelector('.card');
        if (!firstCard) return;
        slideWidth = firstCard.offsetWidth + 8;

        if (slideWidth === 0) {
            requestAnimationFrame(runSetup);
            return;
        }
        
        applyTransform(false);
        updateIndicator();
    };
    
    requestAnimationFrame(runSetup);
}