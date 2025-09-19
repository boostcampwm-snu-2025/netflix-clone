document.addEventListener('DOMContentLoaded', () => {

	const lists = document.querySelectorAll('.recommendation-list');
	lists.forEach(list => {
		let isDragging = false;
		let startX = 0;
		let scrollStart = 0;
		let moved = false;

		const onPointerDown = (e) => {
			if (e.button !== undefined && e.button !== 0) return;
			isDragging = true;
			moved = false;
			startX = e.clientX;
			scrollStart = list.scrollLeft;
			list.setPointerCapture(e.pointerId);
			list.classList.add('dragging');
		};

		const onPointerMove = (e) => {
			if (!isDragging) return;
			const dx = e.clientX - startX;
			if (Math.abs(dx) > 5) moved = true;
			list.scrollLeft = scrollStart - dx;
		};

		const onPointerUp = (e) => {
			if (!isDragging) return;
			isDragging = false;
			list.classList.remove('dragging');
			list.releasePointerCapture(e.pointerId);
		};

		list.addEventListener('pointerdown', onPointerDown);
		list.addEventListener('pointermove', onPointerMove);
		list.addEventListener('pointerup', onPointerUp);
		list.addEventListener('pointercancel', onPointerUp);
		list.addEventListener('pointerleave', (e) => {
			if (isDragging) onPointerUp(e);
		});
	});


	const muteBtn = document.querySelector('.mute-btn');
	if (muteBtn) {
		const icon = muteBtn.querySelector('i');
		let muted = true; // 초기 상태: 음소거 (volume-xmark 아이콘 가정)
		muteBtn.addEventListener('click', () => {
			muted = !muted;
			if (icon) {
				// Font Awesome 아이콘 클래스 교체
				icon.className = muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
			}
			// 접근성용 상태 속성 (screen reader)
			muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
			muteBtn.setAttribute('aria-label', muted ? '음소거 해제' : '음소거');
		});
	}
});

