// 유한 캐러셀
export function initializeFiniteCarousel(containerSelector, options) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const wrapper = container.querySelector('.carousel-wrapper');
    const prevBtn = container.querySelector('.carousel__btn--prev');
    const nextBtn = container.querySelector('.carousel__btn--next');
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
    const prevBtn = container.querySelector('.carousel__btn--prev');
    const nextBtn = container.querySelector('.carousel__btn--next');
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



export function initializeCarousel(containerSelector, options) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const wrapper = container.querySelector('.carousel-wrapper');
    const prevBtn = container.querySelector('.carousel__btn--prev');
    const nextBtn = container.querySelector('.carousel__btn--next');
    const originalCards = Array.from(wrapper.querySelectorAll('.card'));
    const indicator = container.previousElementSibling;

    const SLIDES_TO_MOVE = options?.move || 4;
    const VISIBLE_SLIDES = options?.visible || 4;
    const TOTAL_ORIGINAL_CARDS = originalCards.length;

    if (TOTAL_ORIGINAL_CARDS <= VISIBLE_SLIDES) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }
    
    // 양방향 루프 애니메이션을 위한 복제
    const CLONE_COUNT = VISIBLE_SLIDES;
    for (let i = 0; i < CLONE_COUNT; i++) {
        const cloneEnd = originalCards[TOTAL_ORIGINAL_CARDS - 1 - i].cloneNode(true);
        wrapper.prepend(cloneEnd);
        const cloneStart = originalCards[i].cloneNode(true);
        wrapper.appendChild(cloneStart);
    }

    // 인덱스 기준 재설정
    const START_INDEX = CLONE_COUNT; // 실제 콘텐츠 시작 인덱스
    const MAX_INDEX = CLONE_COUNT + TOTAL_ORIGINAL_CARDS - VISIBLE_SLIDES; // 실제 콘텐츠 마지막 페이지 인덱스
    
    let currentIndex = START_INDEX;
    let isMoving = false;
    let slideWidth = 0;

    const applyTransform = () => {
        wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    };

    const moveSlider = () => {
        wrapper.style.transition = 'transform 0.5s ease-out';
        applyTransform();
    };

    // 1. '다음' 버튼 로직: 경계에서 멈추는 기능 추가
    nextBtn.addEventListener('click', () => {
        if (isMoving) return;
        isMoving = true;

        if (currentIndex < MAX_INDEX) { // Case 1: 아직 끝이 아니면 정상 이동
            currentIndex = Math.min(currentIndex + SLIDES_TO_MOVE, MAX_INDEX);
        } else { // Case 2: 이미 끝에 도달했다면, 루프 애니메이션 시작
            currentIndex += VISIBLE_SLIDES;
        }
        moveSlider();
    });

    // 2. '이전' 버튼 로직: 경계에서 멈추는 기능 추가
    prevBtn.addEventListener('click', () => {
        if (isMoving) return;
        isMoving = true;

        if (currentIndex > START_INDEX) { // Case 1: 아직 처음이 아니면 정상 이동
            currentIndex = Math.max(currentIndex - SLIDES_TO_MOVE, START_INDEX);
        } else { // Case 2: 이미 처음에 도달했다면, 루프 애니메이션 시작
            currentIndex -= VISIBLE_SLIDES;
        }
        moveSlider();
    });

    // 3. '순간이동' 로직: 루프 애니메이션 후 위치 리셋
    wrapper.addEventListener('transitionend', () => {
        isMoving = false;

        // 오른쪽 끝 복제본 영역으로 넘어갔을 때
        if (currentIndex >= TOTAL_ORIGINAL_CARDS + CLONE_COUNT) {
            wrapper.style.transition = 'none';
            currentIndex = START_INDEX; // 원본 시작 위치로 순간이동
            applyTransform();
        }

        // 왼쪽 끝 복제본 영역으로 넘어갔을 때
        if (currentIndex < START_INDEX) {
            wrapper.style.transition = 'none';
            currentIndex = MAX_INDEX; // 원본 마지막 위치로 순간이동
            applyTransform();
        }

        updateIndicator();

    });

    // --- 인디케이터 및 초기 설정 로직 ---
    const TOTAL_PAGES = Math.ceil(TOTAL_ORIGINAL_CARDS / SLIDES_TO_MOVE);
    let indicatorDots = null;
    if (indicator) {
        indicator.innerHTML = '';
        for (let i = 0; i < TOTAL_PAGES; i++) {
            const dot = document.createElement('span');
            dot.classList.add('indicator-dot');
            indicator.appendChild(dot);
        }
        indicatorDots = indicator.querySelectorAll('.indicator-dot');
    }

    const updateIndicator = () => {
        if (!indicatorDots) return;

        let currentPage;
        
        // 1. 오른쪽으로 루프하는 애니메이션 중일 때 -> 첫 페이지(0)를 가리킴
        if (currentIndex >= TOTAL_ORIGINAL_CARDS + CLONE_COUNT) {
            currentPage = 0;
        } 
        // 2. 왼쪽으로 루프하는 애니메이션 중일 때 -> 마지막 페이지를 가리킴
        else if (currentIndex < START_INDEX) {
            currentPage = TOTAL_PAGES - 1;
        } 
        // 3. 캐러셀이 정확히 마지막 페이지에 멈춰있을 때
        else if (currentIndex === MAX_INDEX) {
            currentPage = TOTAL_PAGES - 1;
        }
        // 4. 그 외 모든 일반적인 경우
        else {
            const realIndex = currentIndex - CLONE_COUNT;
            currentPage = Math.floor(realIndex / SLIDES_TO_MOVE);
        }

        indicatorDots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === currentPage);
        });
    };

    const runSetup = () => {
        const firstCard = wrapper.querySelector('.card');
        if (!firstCard) return;
        slideWidth = firstCard.offsetWidth + 8;

        if (slideWidth === 0) {
            requestAnimationFrame(runSetup);
            return;
        }
        
        wrapper.style.transition = 'none';
        applyTransform();
        updateIndicator();
    };
    
    requestAnimationFrame(runSetup);
}