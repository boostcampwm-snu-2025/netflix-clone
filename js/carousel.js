// 유한 캐러셀
export function initializeFiniteCarousel(containerSelector, options) {
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
        let currentPage;
        
        if (currentIndex === MAX_INDEX) {
            currentPage = TOTAL_PAGES - 1; 
        } else {
            currentPage = Math.floor(currentIndex / SLIDES_TO_MOVE);
        }
        
        indicatorDots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === currentPage);
        });
    };

    const MAX_INDEX = TOTAL_CARDS - VISIBLE_SLIDES;
    let currentIndex = 0;
    let isMoving = false;
    const slideWidth = cards.length > 1 ? cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left : 0;

    wrapper.style.transform = `translateX(0px)`;
    updateButtonStates();
    updateIndicator();

    nextBtn.addEventListener('click', () => {
        if (isMoving) return;
        isMoving = true;
        currentIndex = Math.min(currentIndex + SLIDES_TO_MOVE, MAX_INDEX);
        wrapper.style.transition = 'transform 0.5s ease-out';
        wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateIndicator(); 
    });

    prevBtn.addEventListener('click', () => {
        if (isMoving) return;
        isMoving = true;

        if (currentIndex === MAX_INDEX) {
            currentIndex = Math.floor((currentIndex - 1) / SLIDES_TO_MOVE) * SLIDES_TO_MOVE;
        } else {
            currentIndex = Math.max(currentIndex - SLIDES_TO_MOVE, 0);
        }
        
        wrapper.style.transition = 'transform 0.5s ease-out';
        wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateIndicator();
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
무한 캐러셀
 * @param {string} containerSelector - 캐러셀 컨테이너의 CSS 선택자
 * @param {object} options - 옵션 객체 { move: 한번에 이동할 카드 수 }
 */
export function initializeInfiniteCarousel(containerSelector, options) {
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

    const applyTransform = (animate = true) => {
        const offset = currentIndex * slideWidth;
        
        if (!animate) {
            wrapper.style.transition = 'none';
            setTimeout(() => {
                wrapper.style.transform = `translateX(-${offset}px)`;
            }, 0);
        } else {
            // 애니메이션이 있는 일반적인 이동일 경우
            wrapper.style.transition = 'transform 0.5s ease-out';
            wrapper.style.transform = `translateX(-${offset}px)`;
        }
    };

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
        normalizeIndex(); // 인덱스 정규화를 수행
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