document.addEventListener('DOMContentLoaded', () => {
	const carousels = document.querySelectorAll('.carousel');

	carousels.forEach(wrapper => {
		const track = wrapper.querySelector('.recommendation-list');
		if (!track) return;
		const prevBtn = wrapper.querySelector('.handlePrev');
		const nextBtn = wrapper.querySelector('.handleNext');

		const originalSlides = track.querySelectorAll('.recommendation-item');
		const N = originalSlides.length;
		if (N === 0) return;
		if (track.querySelectorAll('.recommendation-item').length === N) {
			const frag = document.createDocumentFragment();
			originalSlides.forEach(slide => frag.appendChild(slide.cloneNode(true)));
			track.appendChild(frag);
		}

		let index = 0;
		const VISIBLE = 5;
		const pages = Math.ceil(N / VISIBLE);

		const indicatorTrack = wrapper.parentElement?.querySelector('.page-indicator .pi-track');
		if (indicatorTrack) {
			indicatorTrack.innerHTML = '';
			for (let i = 0; i < pages; i++) {
				const dot = document.createElement('span');
				dot.className = 'pi-dot' + (i === 0 ? ' is-active' : '');
				indicatorTrack.appendChild(dot);
			}
		}
		const updateIndicator = () => {
			if (!indicatorTrack) return;
			const baseIndex = ((index % N) + N) % N; // 0..N-1
			const currentPage = Math.floor(baseIndex / VISIBLE);
			const dots = indicatorTrack.querySelectorAll('.pi-dot');
			dots.forEach((d, i) => {
				if (i === currentPage) d.classList.add('is-active'); else d.classList.remove('is-active');
			});
		};
		const transitionCSS = 'transform 0.5s ease';
		const slidesAll = () => track.querySelectorAll('.recommendation-item');
		const gap = 15;
		const getWidth = () => slidesAll()[0].offsetWidth;
		const applyTransform = (animate = true) => {
			track.style.transition = animate ? transitionCSS : 'none';
			const w = getWidth();
			const offset = index * (w + gap);
			track.style.transform = `translateX(-${offset}px)`;
		};

		requestAnimationFrame(() => applyTransform(false));

		const normalizeIndex = () => {
			if (index >= N) {
				index -= N;
				applyTransform(false);
			} else if (index < 0) {
				index += N;
				applyTransform(false);
			}
		};

		let locking = false;
		const step = (dir) => {
			if (locking) return;
			if (dir === 'prev' && index === 0) {
				locking = true;
				index += N;
				applyTransform(false);
				index -= Math.min(VISIBLE, N);
				requestAnimationFrame(() => {
					applyTransform(true);
					updateIndicator();
				});
				return;
			}
			locking = true;
			const stepSize = Math.min(VISIBLE, N);
			index += dir === 'next' ? stepSize : -stepSize;
			applyTransform(true);
			updateIndicator();
		};

		nextBtn?.addEventListener('click', () => step('next'));
		prevBtn?.addEventListener('click', () => step('prev'));

		track.addEventListener('transitionend', e => {
			if (e.propertyName !== 'transform') return;
			normalizeIndex();
			updateIndicator();
			requestAnimationFrame(() => { locking = false; });
		});

		updateIndicator();

		const muteBtn = document.querySelector('.mute-btn');
		if (muteBtn) {
			const icon = muteBtn.querySelector('i');
			let muted = true;
			muteBtn.addEventListener('click', () => {
				muted = !muted;
				if (icon) {
					icon.className = muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
				}
				muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
				muteBtn.setAttribute('aria-label', muted ? '음소거 해제' : '음소거');
			});
		}
	});
});
