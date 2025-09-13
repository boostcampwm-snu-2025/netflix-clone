document.addEventListener('DOMContentLoaded', () => {
	const profile = document.querySelector('.profile');
	if (!profile) return;

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
});
