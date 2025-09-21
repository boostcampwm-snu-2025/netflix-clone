// One carousel functionality for each slide section
document.querySelectorAll('.slide_wrapper').forEach(wrapper => {
    const slidesContainer = wrapper.querySelector('.slides'); 
    const prevButton = wrapper.querySelector('.prev');
    const nextButton = wrapper.querySelector('.next');

    // copy original slide items to an array (NodeList is dynamic)
    const originalItems = Array.from(slidesContainer.children);
    const originalItemCount = originalItems.length;

    // If there are no items, do nothing
    if (originalItemCount === 0) return;

    // Design Choice: static for now, should change to dynamic for each slide later
    const SLIDES_PER_PAGE = 6; // slides to show and move per page
    const TRANSITION_DURATION = 500; // animation duration in ms

    // Calculate distance of one slide
    const itemWidth = originalItems[0].offsetWidth;
    const itemMarginRight = parseInt(window.getComputedStyle(originalItems[0]).marginRight);
    const moveDistance = itemWidth + itemMarginRight;

    let currentIndex = SLIDES_PER_PAGE;
    let isMoving = false; 

    // initialize infinite carousel
    const setupCarousel = () => {
        const lastGroupClones = originalItems.slice(-SLIDES_PER_PAGE).map(item => item.cloneNode(true));
        slidesContainer.prepend(...lastGroupClones.reverse());

        const firstGroupClones = originalItems.slice(0, SLIDES_PER_PAGE).map(item => item.cloneNode(true));
        slidesContainer.append(...firstGroupClones);

        slidesContainer.style.transition = 'none';
        slidesContainer.style.transform = `translateX(-${moveDistance * currentIndex}px)`;
    };

    // Common slide move function
    const moveSlides = (direction) => {
        if (isMoving) return;
        isMoving = true;

        currentIndex += direction * SLIDES_PER_PAGE;

        slidesContainer.style.transition = `transform ${TRANSITION_DURATION}ms ease-out`;
        slidesContainer.style.transform = `translateX(-${moveDistance * currentIndex}px)`;
    };

    // Handle transition end to reset position if at cloned slides
    slidesContainer.addEventListener('transitionend', () => {
        // if last page (cloned first page) is passed
        if (currentIndex >= originalItemCount + SLIDES_PER_PAGE) {
            slidesContainer.style.transition = 'none'; 
            currentIndex -= originalItemCount; 
            slidesContainer.style.transform = `translateX(-${moveDistance * currentIndex}px)`;
        }
        
        // if first page (cloned last page) is passed
        if (currentIndex < SLIDES_PER_PAGE) {
            slidesContainer.style.transition = 'none';
            currentIndex += originalItemCount; 
            slidesContainer.style.transform = `translateX(-${moveDistance * currentIndex}px)`;
        }
        
        isMoving = false;
    });

    // Button click events
    nextButton.addEventListener('click', () => moveSlides(1));
    prevButton.addEventListener('click', () => moveSlides(-1));

    // Initialize carousel
    setupCarousel();
});