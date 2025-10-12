export function initSliders() {
	// One carousel functionality for each slide section
	document.querySelectorAll('.slide_wrapper').forEach(wrapper => {
		const slidesContainer = wrapper.querySelector('.slides'); 
		const prevButton = wrapper.querySelector('.prev');
		const nextButton = wrapper.querySelector('.next');
		const pagination = wrapper.querySelector('.pagination');

		// copy original slide items to an array (NodeList is dynamic)
		const originalItems = Array.from(slidesContainer.children);
		const originalItemCount = originalItems.length;

		// If there are no items, do nothing
		if (originalItemCount === 0) return;

		// Design Choice: static for now, should change to dynamic for each slide later
		const visibleCount = parseInt(wrapper.dataset.visibleCount, 10) || 6; // default 6
		const TRANSITION_DURATION = 500; // animation duration in ms

		// 페이지네이션 계산
		const totalPages = Math.ceil(originalItemCount / visibleCount);
		let currentPage = 1;

		// 페이지네이션 UI 업데이트 함수
		function updatePagination() {
			if (!pagination) return;
			pagination.innerHTML = '';
			for (let i = 1; i <= totalPages; i++) {
				const dot = document.createElement('span');
				dot.className = 'dot' + (i === currentPage ? ' active' : '');
				dot.textContent = '●';
				dot.style.cursor = 'pointer';
				dot.addEventListener('click', () => goToPage(i));
				pagination.appendChild(dot);
			}
			
		}

		// 페이지 이동 함수
		function goToPage(page) {
			if (isMoving || page < 1 || page > totalPages) return;
			currentPage = page;
			currentIndex = visibleCount + (currentPage - 1) * visibleCount;
			slidesContainer.style.transition = `transform ${TRANSITION_DURATION}ms ease-out`;
			slidesContainer.style.transform = `translateX(-${moveDistance * currentIndex}px)`;
			updatePagination();
		}

		// Calculate distance of one slide
		const itemWidth = originalItems[0].offsetWidth;
		const itemMarginRight = parseInt(window.getComputedStyle(originalItems[0]).marginRight);
		const moveDistance = itemWidth + itemMarginRight;

		let currentIndex = visibleCount;
		let isMoving = false; 

		// 기존 moveSlides 함수 수정 (페이지네이션 연동)
		const moveSlides = (direction) => {
			if (isMoving) return;
			isMoving = true;

			currentIndex += direction * visibleCount;
			currentPage += direction;
			if (currentPage < 1) currentPage = totalPages;
			if (currentPage > totalPages) currentPage = 1;

			slidesContainer.style.transition = `transform ${TRANSITION_DURATION}ms ease-out`;
			slidesContainer.style.transform = `translateX(-${moveDistance * currentIndex}px)`;
			updatePagination();
		};

		// transitionend에서 페이지네이션도 갱신
		slidesContainer.addEventListener('transitionend', () => {
			if (currentIndex >= originalItemCount + visibleCount) {
				slidesContainer.style.transition = 'none'; 
				currentIndex -= originalItemCount; 
				slidesContainer.style.transform = `translateX(-${moveDistance * currentIndex}px)`;
			}
			if (currentIndex < visibleCount) {
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
		const setupCarousel = () => {
			const lastGroupClones = originalItems.slice(-visibleCount).map(item => item.cloneNode(true));
			slidesContainer.prepend(...lastGroupClones.reverse());

			const firstGroupClones = originalItems.slice(0, visibleCount).map(item => item.cloneNode(true));
			slidesContainer.append(...firstGroupClones);

			slidesContainer.style.transition = 'none';
			slidesContainer.style.transform = `translateX(-${moveDistance * currentIndex}px)`;
			updatePagination();
		};
		setupCarousel();
	});
}