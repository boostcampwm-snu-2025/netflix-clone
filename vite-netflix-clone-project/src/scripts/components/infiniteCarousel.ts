export class InfiniteCarousel {
	private root: HTMLElement;
	private viewport: HTMLElement;
	private track: HTMLElement;
	private prevBtn: HTMLButtonElement;
	private nextBtn: HTMLButtonElement;

	private originalSlides: HTMLElement[];
	private allSlides: HTMLElement[] = [];
	private n: number;

	private gap: number;
	private cardWidth: number;
	private step: number;

	private pagi: HTMLDivElement;
	private pagiBars: HTMLElement[] = [];

	private itemsPerView = 1;
	private pageStarts: number[] = [0];
	private totalPages = 1;

	private current = 0; // 확장(클론 포함) 인덱스
	private pageIndex: number | undefined;
	private isAnimating = false;

	// 바인딩된 핸들러
	private onNext = () => this._movePage(+1);
	private onPrev = () => this._movePage(-1);
	private onEnd = () => this._onTransitionEndSync();
	private onMouseDown?: (e: MouseEvent) => void;
	private onMouseUp?: (e: MouseEvent) => void;
	private onTouchStart?: (e: TouchEvent) => void;
	private onTouchEnd?: (e: TouchEvent) => void;
	private onResize = () => this._recalc();

	constructor(root: HTMLElement) {
		this.root = root;

		const viewport = root.querySelector<HTMLElement>(".cr-viewport");
		const track = root.querySelector<HTMLElement>(".cr-track");
		const prevBtn = root.querySelector<HTMLButtonElement>(".cr-btn.prev");
		const nextBtn = root.querySelector<HTMLButtonElement>(".cr-btn.next");

		if (!viewport || !track || !prevBtn || !nextBtn) {
			throw new Error("[InfiniteCarousel] 필수 요소가 없습니다.");
		}

		this.viewport = viewport;
		this.track = track;
		this.prevBtn = prevBtn;
		this.nextBtn = nextBtn;

		this.originalSlides = Array.from(this.track.children) as HTMLElement[];
		this.n = this.originalSlides.length;

		if (this.n === 0) {
			throw new Error("[InfiniteCarousel] 슬라이드가 없습니다.");
		}

		this.gap = this._readGap();
		this.cardWidth = this._slideWidth();
		this.step = this.cardWidth + this.gap;

		// pagination dom
		this.pagi = document.createElement("div");
		this.pagi.className = "cr-pagination";
		this.root.appendChild(this.pagi);

		// 3n 구성
		this._cloneHeadAndTail();
		this.current = this.n; // 중앙 시작
		this._jump(this.current);

		// 레이아웃 계산 → 페이지네이션 생성 → 활성 표시
		this._computeLayout();
		this._buildPagination();
		this._updatePaginationActive();

		// 이벤트 바인딩
		this._bind();
		window.addEventListener("resize", this.onResize);
	}

	/* ---------- utilities ---------- */
	private _readGap(): number {
		const gapStr = getComputedStyle(this.track).gap || "16";
		const parsed = parseFloat(gapStr);
		return Number.isFinite(parsed) ? parsed : 16;
	}

	private _slideWidth(): number {
		const first = this.track.querySelector<HTMLElement>(".cr-card");
		if (!first) return 0;
		return first.getBoundingClientRect().width;
	}

	private _cloneHeadAndTail(): void {
		const head = this.originalSlides.map(
			(n) => n.cloneNode(true) as HTMLElement
		);
		const tail = this.originalSlides.map(
			(n) => n.cloneNode(true) as HTMLElement
		);
		for (let i = this.n - 1; i >= 0; i--) this.track.prepend(head[i]);
		tail.forEach((n) => this.track.appendChild(n));
		this.allSlides = Array.from(this.track.children) as HTMLElement[];
	}

	private _translate(i: number, animated = true): void {
		if (animated) this.isAnimating = true;
		else this.track.style.transition = "none";

		this.track.style.transform = `translateX(${-(i * this.step)}px)`;
		if (!animated) {
			// reflow
			void this.track.offsetHeight;
			this.track.style.transition = "";
		}
	}

	private _jump(i: number): void {
		this._translate(i, false);
	}

	/* ---------- pagination ---------- */
	private _buildPageStarts(): void {
		const k = this.itemsPerView;
		const n = this.n;
		const starts: number[] = [];

		for (let s = 0; s + k <= n; s += k) starts.push(s);
		if (n % k !== 0) starts.push(n - k);

		this.pageStarts = starts;
		this.totalPages = starts.length;
	}

	private _computeLayout(): void {
		const vw = this.viewport.clientWidth;
		const unit = this.cardWidth + this.gap;
		this.itemsPerView = Math.max(1, Math.floor((vw + this.gap) / unit));
		this._buildPageStarts();
	}

	private _buildPagination(): void {
		if (!this.pagi) return;
		this.pagi.replaceChildren();
		for (let i = 0; i < this.totalPages; i++) {
			const b = document.createElement("span");
			b.className = "bar";
			this.pagi.appendChild(b);
		}
		this.pagiBars = Array.from(this.pagi.children) as HTMLElement[];
	}

	private _logicalIndex(): number {
		const raw = this.current - this.n;
		return ((raw % this.n) + this.n) % this.n;
	}

	private _currentPageIndex(): number {
		const li = this._logicalIndex();
		const starts = this.pageStarts || [0];
		let idx = 0;
		for (let i = 0; i < starts.length; i++) {
			const s = starts[i];
			const e = i < starts.length - 1 ? starts[i + 1] : this.n;
			if (li >= s && li < e) {
				idx = i;
				break;
			}
		}
		return idx;
	}

	private _updatePaginationActive(): void {
		if (!this.pagiBars || !this.pagiBars.length) return;
		const idx =
			this.isAnimating && typeof this.pageIndex === "number"
				? this.pageIndex
				: this._currentPageIndex();
		this.pagiBars.forEach((el, i) => el.classList.toggle("active", i === idx));
	}

	private _goToPageIndex(targetIdx: number, dir: -1 | 0 | 1 = 0): void {
		const starts = this.pageStarts || [0];
		const curLogical = this._logicalIndex();

		let targetLogical = starts[targetIdx];

		// 진행 방향에 맞춰 래핑 보정
		if (dir > 0 && targetLogical < curLogical) targetLogical += this.n;
		if (dir < 0 && targetLogical > curLogical) targetLogical -= this.n;

		const deltaCards = targetLogical - curLogical;
		this.current += deltaCards;
		this._translate(this.current, true);

		this.pageIndex = targetIdx;
		this._updatePaginationActive();
	}

	private _movePage(dir: -1 | 1): void {
		const total = this.totalPages || 1;
		const curIdx = this._currentPageIndex();
		const nextIdx = (curIdx + dir + total) % total;
		this._goToPageIndex(nextIdx, dir);
	}

	private _onTransitionEndSync(): void {
		this._handleEdges();
		this.isAnimating = false;
		this.pageIndex = this._currentPageIndex();
		this._updatePaginationActive();
	}

	/* ---------- interactions ---------- */
	private _bind(): void {
		this.nextBtn.addEventListener("click", this.onNext);
		this.prevBtn.addEventListener("click", this.onPrev);
		this.track.addEventListener("transitionend", this.onEnd);

		// drag
		let mStartX = 0;
		let dragging = false;

		this.onMouseDown = (e: MouseEvent) => {
			dragging = true;
			mStartX = e.clientX;
		};
		this.onMouseUp = (e: MouseEvent) => {
			if (!dragging) return;
			dragging = false;
			const dx = e.clientX - mStartX;
			if (dx < -30) this._movePage(+1);
			else if (dx > 30) this._movePage(-1);
		};

		this.viewport.addEventListener("mousedown", this.onMouseDown);
		window.addEventListener("mouseup", this.onMouseUp);

		// touch
		let tStartX = 0;

		this.onTouchStart = (e: TouchEvent) => {
			tStartX = e.touches[0]?.clientX ?? 0;
		};
		this.onTouchEnd = (e: TouchEvent) => {
			const x = e.changedTouches[0]?.clientX ?? 0;
			const dx = x - tStartX;
			if (dx < -30) this._movePage(+1);
			else if (dx > 30) this._movePage(-1);
		};

		this.viewport.addEventListener("touchstart", this.onTouchStart, {
			passive: true,
		});
		this.viewport.addEventListener("touchend", this.onTouchEnd, {
			passive: true,
		});
	}

	private _handleEdges(): void {
		if (this.current >= 2 * this.n) {
			this.current -= this.n;
			this._jump(this.current);
		} else if (this.current < this.n) {
			this.current += this.n;
			this._jump(this.current);
		}
	}

	private _recalc(): void {
		const w = this._slideWidth();
		const g = this._readGap();
		if (w !== this.cardWidth || g !== this.gap) {
			this.cardWidth = w;
			this.gap = g;
			this.step = w + g;
		}

		this._computeLayout();
		this._buildPagination();
		this._jump(this.current);
		this._updatePaginationActive();
	}

	/* 해제(선택): SPA 라우팅에서 필요할 때 호출 */
	public destroy(): void {
		this.nextBtn.removeEventListener("click", this.onNext);
		this.prevBtn.removeEventListener("click", this.onPrev);
		this.track.removeEventListener("transitionend", this.onEnd);
		if (this.onMouseDown)
			this.viewport.removeEventListener("mousedown", this.onMouseDown);
		if (this.onMouseUp) window.removeEventListener("mouseup", this.onMouseUp);
		if (this.onTouchStart)
			this.viewport.removeEventListener("touchstart", this.onTouchStart);
		if (this.onTouchEnd)
			this.viewport.removeEventListener("touchend", this.onTouchEnd);
		window.removeEventListener("resize", this.onResize);
	}
}

/* 헬퍼: 페이지 내 모든 캐러셀 마운트 */
export function mountCarousels(
	root: ParentNode = document
): InfiniteCarousel[] {
	const nodes = Array.from(
		root.querySelectorAll<HTMLElement>("[data-carousel]")
	);
	return nodes.map((el) => new InfiniteCarousel(el));
}
