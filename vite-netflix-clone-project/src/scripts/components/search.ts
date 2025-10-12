import type { AppData, ContentItem } from "../../types/types";
import { renderCarousels, renderSearchResults } from "../render/render";

// normalization:
// make lower case + NFKD normalization + remove space
const norm = (s: string) =>
	s.toLowerCase().normalize("NFKD").replace(/\s+/g, " ").trim();

// if item matches
function matches(item: ContentItem, qn: string): boolean {
	if (!qn) return false;
	if (item.keywords) {
		return item.keywords.some((kw) => norm(kw).includes(qn));
	}
	return false;
}

// delete duplicates
function dedupe(items: ContentItem[]): ContentItem[] {
	const seen = new Set<string>();
	const out: ContentItem[] = [];
	for (const it of items) {
		const key = `${it.image}|${it.alt}`;
		if (!seen.has(key)) {
			seen.add(key);
			out.push(it);
		}
	}
	return out;
}

// Recent searches helper functions

const RECENT_KEY = "netflix-recent-searches";
const RECENT_MAX = 5;

function loadRecents(): string[] {
	try {
		const raw = localStorage.getItem(RECENT_KEY);
		if (!raw) return [];
		const arr = JSON.parse(raw);
		return Array.isArray(arr) ? arr.filter(Boolean) : [];
	} catch {
		return [];
	}
}

function saveRecents(list: string[]) {
	localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX)));
}

function addRecent(query: string) {
	const trimmed = query.trim(); // trim empty spaces from query
	if (!trimmed) /* empty string */ return;
	// 이미 현재 최근검색어에 동일한 query가 있는지 확인
	const current = loadRecents().filter((recent) => recent !== trimmed); // 현재 최근검색어 목록
	current.unshift(trimmed); // 가장 최근에 trim된 query 검색어가 저장되도록 마지막에 저장
	saveRecents(current);
}

function removeRecent(q: string) {
	saveRecents(loadRecents().filter((x) => x !== q));
}

function renderRecentLayer(root: HTMLElement, items: string[]) {
	root.setAttribute("data-open", "true");
	if (!items.length) {
		root.innerHTML = `<div class="recent-empty">최근 검색어가 없습니다</div>`;
		return;
	}
	root.innerHTML = `
		<ul class="recent-list">
		${
			items
				.slice(0, RECENT_MAX) // 앞 5개 검색어만 추출하자
				.map(
					(q) => `
					<li class="recent-item" data-q="${q}">
						<span class="recent-text">${q}</span>
						<button class="recent-remove" data-remove="${q}" aria-label="삭제">
							<span class="material-symbols-outlined">close</span>
						</button>
					</li>`
				)
				.join("") // map으로 traverse하며 HTML로 변환 후 다시 배열로
		} 
		</ul>`;
}

function hideRecentLayer(root: HTMLElement) {
	root.removeAttribute("data-open");
}

function commitQuery(input: HTMLInputElement, raw: string) {
	const query = raw.trim();
	if (!query) return;
	input.value = query;
	input.dispatchEvent(new Event("input", { bubbles: true }));
	addRecent(query);
}

export function initSearchToggle(appData?: AppData) {
	const wrap = document.querySelector<HTMLDivElement>(".search-wrap");
	const toggleBtn = document.querySelector<HTMLButtonElement>(".search-toggle");
	const input = document.querySelector<HTMLInputElement>(".search-input");

	const layer = document.querySelector<HTMLDivElement>(".recent-layer");

	if (!wrap || !toggleBtn || !input || !layer) return;

	const expand = () => {
		wrap.setAttribute("data-state", "expanded");
		toggleBtn.setAttribute("aria-expanded", "true");
		requestAnimationFrame(() => input.focus());
	};

	const collapse = () => {
		wrap.setAttribute("data-state", "collapsed");
		toggleBtn.setAttribute("aria-expanded", "false");
		input.blur();
	};

	toggleBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		const expanded = wrap.getAttribute("data-state") === "expanded";
		expanded ? collapse() : expand();
	});

	// use ESC key to exit
	input.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			collapse();
		}
	});

	document.addEventListener("click", (e) => {
		const isInside = (e.target as HTMLElement)?.closest(".search-wrap");
		const expanded = wrap.getAttribute("data-state") === "expanded";
		if (expanded && !isInside && input.value.trim() === "") {
			collapse();
		}
	});

	input.addEventListener("blur", () => {
		const expanded = wrap.getAttribute("data-state") === "expanded";
		if (expanded && input.value.trim() === "") {
			setTimeout(collapse, 0);
		}
	});

	input.addEventListener("focus", () => {
		renderRecentLayer(layer, loadRecents());
	});

	// When search string is entered
	input.addEventListener("input", () => {
		const q = input.value.trim();
		const recents = loadRecents();
		const filtered = q ? recents.filter((r) => r.includes(q)) : recents;
		renderRecentLayer(layer, filtered);

		if (!appData) return;
		const qn = norm(q);
		if (!qn) {
			renderCarousels(appData.carousels);
			return;
		}
		const all: ContentItem[] = [
			...appData.carousels.flatMap((c) => c.items),
			...appData.top10,
		];
		const matched = dedupe(all.filter((it) => matches(it, qn)));
		renderSearchResults(matched, q);
	});

	layer.addEventListener("mousedown", (e) => {
		const target = e.target as HTMLElement;
		const removeQ =
			target.closest<HTMLElement>(".recent-remove")?.dataset.remove;
		if (removeQ) {
			e.preventDefault();
			removeRecent(removeQ);
			renderRecentLayer(layer, loadRecents());
			return;
		}
		const item = target.closest<HTMLElement>(".recent-item");
		if (item?.dataset.q) {
			e.preventDefault();
			input.value = item.dataset.q;
			input.dispatchEvent(new Event("input", { bubbles: true }));
			// 저장은 엔터에서만 수행
		}
	});

	let activeIdx = -1;
	input.addEventListener("keydown", (e) => {
		const list = Array.from(
			layer.querySelectorAll<HTMLLIElement>(".recent-item")
		);
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			if (!list.length) return;
			activeIdx =
				(activeIdx + (e.key === "ArrowDown" ? 1 : -1) + list.length) %
				list.length;
			list.forEach((li, i) => li.classList.toggle("active", i === activeIdx));
		} else if (e.key === "Enter" && !e.isComposing) {
			// 선택된 항목이 있으면 그것으로, 없으면 현재 입력값으로 저장
			const selected = activeIdx >= 0 ? list[activeIdx].dataset.q : input.value;
			commitQuery(input, selected as string);

			hideRecentLayer(layer);
			// 포커스 유지 중이면 즉시 갱신된 목록 보여주기
			if (document.activeElement === input) {
				renderRecentLayer(layer, loadRecents());
			}
		} else if (e.key === "Escape") {
			hideRecentLayer(layer);
		}
	});

	document.addEventListener("click", (e) => {
		const inside = (e.target as HTMLElement)?.closest(".search-wrap");
		if (!inside) hideRecentLayer(layer);
	});
}
