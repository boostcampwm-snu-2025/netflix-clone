export function top10(): void {
	const sec = document.querySelector<HTMLElement>(".top10-section");
	if (!sec) return;

	const list = sec.querySelector<HTMLElement>(".top10-list");
	if (!list) return;

	// 캐러셀 스타일 재사용
	sec.classList.add("carousel-row");
	sec.style.position = "relative";

	// viewport 래퍼
	const viewport = document.createElement("div");
	viewport.style.position = "relative";
	viewport.style.overflow = "hidden";
	viewport.style.width = "100%";
	list.parentNode?.insertBefore(viewport, list);
	viewport.appendChild(list);

	list.style.display = "flex";
	list.style.flexWrap = "nowrap";
	list.style.height = "100%";
	const cs = getComputedStyle(list);
	if (
		(!cs.gap || cs.gap === "0px") &&
		(!cs.columnGap || cs.columnGap === "0px")
	) {
		list.style.gap = "16px";
	}

	list.style.willChange = "transform";
	list.style.transition = "transform 0.45s ease";

	const originalItems = Array.from(list.children) as HTMLElement[];
	const n = originalItems.length;
	const pageSize = 5;
	const totalPages = Math.max(1, Math.ceil(n / pageSize));

	// 컨트롤 & 페이징 생성
	const prev = document.createElement("button");
	prev.className = "cr-btn prev";
	prev.setAttribute("aria-label", "이전");
	prev.innerHTML = "&#10094;";

	const next = document.createElement("button");
	next.className = "cr-btn next";
	next.setAttribute("aria-label", "다음");
	next.innerHTML = "&#10095;";

	sec.appendChild(prev);
	sec.appendChild(next);

	const pagi = document.createElement("div");
	pagi.className = "cr-pagination";
	for (let i = 0; i < totalPages; i++) {
		const bar = document.createElement("span");
		bar.className = "bar";
		pagi.appendChild(bar);
	}
	sec.appendChild(pagi);
	const bars = Array.from(pagi.children) as HTMLElement[];

	// 무한루프용 클론: 마지막 페이지를 앞에, 첫 페이지를 뒤에
	const lastPageStart = Math.max(0, (totalPages - 1) * pageSize);
	const headClones = originalItems
		.slice(lastPageStart)
		.map((el) => el.cloneNode(true) as HTMLElement);
	headClones.forEach((node) => list.insertBefore(node, list.firstChild));
	const tailClones = originalItems
		.slice(0, pageSize)
		.map((el) => el.cloneNode(true) as HTMLElement);
	tailClones.forEach((node) => list.appendChild(node));

	let allItems = Array.from(list.children) as HTMLElement[];

	// 정확히 5장 보이도록 폭 강제
	function getGapPx(): number {
		const c = getComputedStyle(list as HTMLElement);
		const g = parseFloat(c.columnGap || c.gap || "0");
		return Number.isFinite(g) ? g : 0;
	}
	function applyItemLayout(): void {
		const gapPx = getGapPx();
		const basis = `calc((100% - ${gapPx * (pageSize - 1)}px) / ${pageSize})`;
		allItems.forEach((el) => {
			el.style.flex = `0 0 ${basis}`;
			el.style.maxWidth = basis;
		});
	}
	applyItemLayout();

	allItems.forEach((el) => {
		const img = el.querySelector("img") as HTMLImageElement | null;
		if (img) {
			img.style.width = "100%";
			img.style.height = "auto";
			img.style.display = "block";
		}
	});

	let baseX = allItems[0]?.offsetLeft || 0;

	// 확장 인덱스 경계값
	const STEP = pageSize;
	const MIN_EXT = 0;
	const FIRST_REAL_EXT = STEP * 1;
	const LAST_REAL_EXT = STEP * totalPages;
	const MAX_EXT = STEP * (totalPages + 1);

	let logicalPage = 0; // 0..totalPages-1
	let extIndex = FIRST_REAL_EXT;
	let isAnimating = false;

	function translateTo(start: number, animated = true) {
		if (!animated) (list as HTMLElement).style.transition = "none";
		const targetX = allItems[start]?.offsetLeft || 0;
		(list as HTMLElement).style.transform = `translateX(${-(
			targetX - baseX
		)}px)`;
		if (!animated) {
			void (list as HTMLElement).offsetHeight;
			(list as HTMLElement).style.transition = "transform 0.45s ease";
		}
	}

	function updatePagi() {
		bars.forEach((b, i) => b.classList.toggle("active", i === logicalPage));
	}

	function nextPage() {
		if (isAnimating || totalPages <= 1) return;
		isAnimating = true;
		logicalPage = (logicalPage + 1) % totalPages;
		extIndex += STEP;
		translateTo(extIndex, true);
	}

	function prevPage() {
		if (isAnimating || totalPages <= 1) return;
		isAnimating = true;
		logicalPage = (logicalPage - 1 + totalPages) % totalPages;
		extIndex -= STEP;
		translateTo(extIndex, true);
	}

	list.addEventListener("transitionend", () => {
		isAnimating = false;
		if (extIndex === MAX_EXT) {
			extIndex = FIRST_REAL_EXT;
			translateTo(extIndex, false);
		} else if (extIndex === MIN_EXT) {
			extIndex = LAST_REAL_EXT;
			translateTo(extIndex, false);
		}
		updatePagi();
	});

	prev.addEventListener("click", prevPage);
	next.addEventListener("click", nextPage);

	window.addEventListener("resize", () => {
		allItems = Array.from(list.children) as HTMLElement[];
		applyItemLayout();
		baseX = allItems[0]?.offsetLeft || 0;
		translateTo(extIndex, false);
	});

	if (totalPages <= 1) {
		prev.style.display = "none";
		next.style.display = "none";
		pagi.style.display = "none";
	}

	translateTo(extIndex, false);
	updatePagi();
}
