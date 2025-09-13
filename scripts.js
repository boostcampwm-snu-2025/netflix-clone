document.addEventListener('DOMContentLoaded', () => {
	const profile = document.querySelector('.profile');
	if (profile) {
		const toggle = () => {
			const isOpen = profile.classList.toggle('open');
			profile.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
			if (isOpen) {
				setTimeout(() => {
					const first = profile.querySelector('.dropdown a');
					first && first.focus();
				}, 0);
			}
		};

		profile.addEventListener('click', (e) => {
			toggle();
			e.stopPropagation();
		});

		profile.querySelectorAll('.dropdown a').forEach(a => {
			a.addEventListener('click', () => {
				profile.classList.remove('open');
				profile.setAttribute('aria-expanded', 'false');
			});
		});

		document.addEventListener('click', (e) => {
			if (profile.classList.contains('open') && !profile.contains(e.target)) {
				profile.classList.remove('open');
				profile.setAttribute('aria-expanded', 'false');
			}
		});
	}

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
});

