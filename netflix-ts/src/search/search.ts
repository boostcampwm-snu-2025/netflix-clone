import { searchTitles, type SearchResponse } from "../api/search";
import { debounce } from "../lib/debounce";

type InitOptions = {
  mount?: string;
  dropdown?: boolean;
  toggleSelector?: string;
};

const RECENTS_KEY = "search_recents_v1";

function getRecents(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]"); }
  catch { return []; }
}
function setRecents(list: string[]) {
  localStorage.setItem(RECENTS_KEY, JSON.stringify(list));
}
function removeRecent(q: string) {
  setRecents(getRecents().filter(x => x !== q));
}
function saveRecent(q: string) {
  const t = q.trim();
  if (!t) return;
  const now = getRecents().filter(x => x !== t);
  now.unshift(t);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(now.slice(0, 10)));
}


function h(tag: string, attrs: Record<string, any> = {}, html = ""): HTMLElement {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === false || v == null) return;
    if (k === "class") el.className = v;
    else if (k.startsWith("aria-") || k === "role") el.setAttribute(k, String(v));
    else (el as any)[k] = v;
  });
  if (html) el.innerHTML = html;
  return el;
}

function emit<T>(name: string, detail: T) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

export function initSearch(opts: InitOptions = {}) {
  const enableDropdown = opts.dropdown ?? false;
  const mountSel = opts.mount ?? "#search-root";
  let mount = document.querySelector<HTMLElement>(mountSel);
  if (!mount) {
    mount = h("div", { id: "search-root" });
    document.body.prepend(mount);
  }

  // 검색 버튼(토글)
  const toggleSel = opts.toggleSelector ?? '.actions .icon-btn[aria-label="검색"]';
  const toggleBtn = document.querySelector<HTMLButtonElement>(toggleSel) || undefined;
  if (toggleBtn) toggleBtn.removeAttribute("disabled");

  const idPrefix = "opt-" + Math.random().toString(36).slice(2, 7);

  // UI
  mount.innerHTML = `
    <div class="searchbox" role="combobox" aria-haspopup="listbox" aria-owns="${idPrefix}-list" aria-expanded="false">
      <span id="${idPrefix}-icon" class="searchbox__icon" aria-hidden="true"></span>
      <input id="${idPrefix}-input" type="search" placeholder="제목, 사람, 장르" autocomplete="off"
             aria-controls="${idPrefix}-list" aria-autocomplete="list" />
      <button id="${idPrefix}-clear" aria-label="검색 닫기">×</button>
      <div id="${idPrefix}-status" class="search-status" aria-live="polite"></div>

      <!-- (옵션) 자동완성 드롭다운: 기본 비활성 -->
      <ul id="${idPrefix}-list" class="search-results" role="listbox" tabindex="-1" ${enableDropdown ? "" : 'style="display:none"'}></ul>

      <!-- 최근 검색어 레이어 -->
      <div id="${idPrefix}-recent" class="recent-layer" role="listbox" aria-label="최근 검색어" hidden>
        <ul id="${idPrefix}-recent-list" class="recent-list"></ul>
      </div>
    </div>
  `;

  const box = mount.querySelector<HTMLElement>(".searchbox")!;
  const iconEl = mount.querySelector<HTMLElement>(`#${idPrefix}-icon`)!;
  const input = mount.querySelector<HTMLInputElement>(`#${idPrefix}-input`)!;
  const clearBtn = mount.querySelector<HTMLButtonElement>(`#${idPrefix}-clear`)!;
  const statusEl = mount.querySelector<HTMLElement>(`#${idPrefix}-status`)!;
  const listEl = mount.querySelector<HTMLUListElement>(`#${idPrefix}-list`)!;

  const recentLayer = mount.querySelector<HTMLDivElement>(`#${idPrefix}-recent`)!;
  const recentList  = mount.querySelector<HTMLUListElement>(`#${idPrefix}-recent-list`)!;

  // 헤더 버튼 SVG 복사
  const defaultIcon = `
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5 1.49-1.49-5-5zM9.5 14A4.5 4.5 0 119.5 5a4.5 4.5 0 010 9z" fill="currentColor"/>
    </svg>`;
  iconEl.innerHTML = (toggleBtn?.innerHTML || defaultIcon);
  iconEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen) {
      close();
    }
  });
  
  let controller: AbortController | null = null;
  const cache = new Map<string, SearchResponse>();
  let isOpen = false;
  let allowAutoRecents = false;

  let recentItems: string[] = [];
  let recentIndex = -1;

  const setExpanded = (exp: boolean) => box.setAttribute("aria-expanded", String(exp));
  const open = () => {
    if (isOpen) return;
    isOpen = true;
    box.classList.add("is-open");
    toggleBtn?.classList.add("is-hidden");
    setExpanded(enableDropdown);
    input.focus();
    hideRecents();
    allowAutoRecents = false;
  };
  
  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    box.classList.remove("is-open");
    toggleBtn?.classList.remove("is-hidden");
    hideResults();
    hideRecents();
    setExpanded(false);
    input.value = "";
    statusEl.textContent = "";
    emit("search:clear", {});
    allowAutoRecents = false;
  };
  

  // 최근 검색어
  function renderRecents() {
    const all = getRecents();
    recentItems = all.slice(0, 5);   // 최신순 5개만 노출
    recentIndex = -1;
  
    recentList.innerHTML = recentItems
      .map((q, i) => `
        <li class="recent-item${i === recentIndex ? " active" : ""}" role="option" data-index="${i}">
          <span class="recent-text">${q}</span>
          <button class="recent-del" data-q="${q}" aria-label="최근 검색어 ‘${q}’ 삭제" tabindex="-1">×</button>
        </li>
      `)
      .join("");
  }
  

  function positionRecents() {
    if (recentLayer.hidden) return;
    const r = input.getBoundingClientRect();
    const width = Math.round(Math.min(Math.max(260, r.width * 0.55), 340));
    recentLayer.style.position = "fixed";
    recentLayer.style.top = `${Math.round(r.bottom + 10)}px`;
    recentLayer.style.left = `${Math.round(r.right - width)}px`; // 오른쪽 맞춤
    recentLayer.style.width = `${width}px`;
    recentLayer.style.zIndex = "10001";
    recentLayer.style.maxHeight = "50vh";
    recentLayer.style.overflowY = "auto";
  }

  function showRecents() {
    renderRecents();
    recentLayer.hidden = recentItems.length === 0;
    positionRecents();
  }
  function hideRecents() { recentLayer.hidden = true; }

  function moveRecent(delta: number) {
    if (recentItems.length === 0) return;
  
    if (recentIndex === -1) {
      recentIndex = delta > 0 ? 0 : recentItems.length - 1;
    } else {
      recentIndex = (recentIndex + delta + recentItems.length) % recentItems.length;
    }
  
    [...recentList.children].forEach((li, i) => {
      li.classList.toggle("active", i === recentIndex);
    });
  
    input.value = recentItems[recentIndex];
  }

  function ensureRecentsOpenAndMove(delta: number) {
    allowAutoRecents = true;
    if (recentLayer.hidden) {
      if (input.value.trim() !== "") return; // 타이핑 중엔 열지 않음
      showRecents();
    }
    moveRecent(delta);
  }

  const commitRecent = () => {
    const q = input.value.trim();
    if (q) saveRecent(q);
  };

  // ===== 드롭다운(검색 결과) 포지셔닝: 옵션 =====
  function positionDropdown() {
    if (!enableDropdown) return;
    if (!listEl.classList.contains("show")) return;
    const r = input.getBoundingClientRect();
    listEl.style.position = "fixed";
    listEl.style.left = `${Math.round(r.left)}px`;
    listEl.style.top = `${Math.round(r.bottom)}px`;
    listEl.style.width = `${Math.round(r.width)}px`;
    listEl.style.zIndex = "10000";
    listEl.style.maxHeight = "60vh";
  }
  const repositionIfOpen = () => { positionDropdown(); positionRecents(); };
  window.addEventListener("resize", repositionIfOpen);
  window.addEventListener("scroll", repositionIfOpen, { passive: true });

  const renderLoading = (q: string) => {
    statusEl.textContent = "검색 중…";
    hideRecents();
    if (enableDropdown) {
      listEl.classList.add("show");
      listEl.innerHTML = `<li class="loading">불러오는 중…</li>`;
      positionDropdown();
    }
    emit("search:loading", { query: q });
  };
  const renderEmpty = (q: string) => {
    statusEl.textContent = q ? `"${q}"에 대한 결과가 없습니다.` : "";
    hideRecents();
    if (enableDropdown) {
      listEl.classList.add("show");
      listEl.innerHTML = `<li class="empty">결과 없음</li>`;
      positionDropdown();
    }
    emit("search:results", { query: q, items: [], total: 0 });
  };
  const renderError = (q: string, err: Error) => {
    statusEl.textContent = "오류가 발생했습니다. 다시 시도해 주세요.";
    hideRecents();
    if (enableDropdown) {
      listEl.classList.add("show");
      listEl.innerHTML = `<li class="error">${err.message}</li>`;
      positionDropdown();
    }
    emit("search:error", { query: q, message: err.message });
  };
  const renderResults = (q: string, items: SearchResponse["items"], total: number) => {
    hideRecents();
    if (enableDropdown) {
      listEl.classList.add("show");
      listEl.innerHTML = items.map((t, i) => `
        <li class="result" id="${idPrefix}-${i}" role="option" data-index="${i}" tabindex="-1" aria-selected="${i===0}">
          <img alt="" src="${t.image}" />
          <div>
            <div class="name">${t.name}</div>
            <div class="meta">${t.type} · ${t.desc ?? ""}</div>
          </div>
        </li>
      `).join("");
      positionDropdown();
    }
    emit("search:results", { query: q, items, total });
  };
  const hideResults = () => {
    if (!enableDropdown) return;
    listEl.classList.remove("show");
    listEl.removeAttribute("style");
    listEl.innerHTML = "";
  };

  async function doSearch(q: string) {
    if (!isOpen) open();

    if (!q.trim()) {
      statusEl.textContent = "";
      hideResults();
      emit("search:clear", {});
      if (allowAutoRecents) showRecents(); else hideRecents();
      return;
    } else {
      hideRecents();
    }

    if (controller) controller.abort();
    controller = new AbortController();

    if (cache.has(q)) {
      const data = cache.get(q)!;
      statusEl.textContent = `${data.total}건`;
      if (data.items.length) renderResults(q, data.items, data.total);
      else renderEmpty(q);
      return;
    }

    renderLoading(q);

    try {
      const data = await searchTitles(q, controller.signal);
      cache.set(q, data);
      statusEl.textContent = `${data.total}건`;
      if (data.items.length) renderResults(q, data.items, data.total);
      else renderEmpty(q);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      renderError(q, err);
    }
  }

  const debounced = debounce((q: string) => doSearch(q), 300);
  toggleBtn?.addEventListener("click", () => {
    if (!isOpen) {
      open();
    } else {
      input.focus();
    }
  });
  input.addEventListener("click", () => {
    if (!isOpen) return;
    if (!input.value.trim()) {
      allowAutoRecents = true;
      showRecents();
    }
  });
  input.addEventListener("focus", () => {
    if (!input.value.trim() && allowAutoRecents) showRecents();
  });

  input.addEventListener("input", e => {
    const val = (e.target as HTMLInputElement).value;
    if (val.trim() === "") {
      if (allowAutoRecents) showRecents(); else hideRecents();
    } else {
      hideRecents();
    }
    debounced(val);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      ensureRecentsOpenAndMove(e.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (e.key === "Enter") {
      commitRecent();
      // 선택된 최근 검색어가 있으면 그대로 사용
      debounced(input.value);
      hideRecents();
      return;
    }
    if (e.key === "Escape") {
      if (input.value) {
        input.value = "";
        emit("search:clear", {});
        showRecents();
      } else {
        close();
      }
    }
  });

  // 최근 검색어 클릭
  recentList.addEventListener("mousedown", (e) => {
    const target = e.target as HTMLElement;
  
    // 1) 삭제 버튼 클릭
    const delBtn = target.closest<HTMLButtonElement>(".recent-del");
    if (delBtn) {
      e.preventDefault(); e.stopPropagation();
      const q = delBtn.dataset.q!;
      removeRecent(q);
      renderRecents();
      positionRecents();     // 위치 재보정
      return;
    }
  
    // 2) 항목 클릭 → 검색창에 채워넣고 실행
    const li = target.closest<HTMLLIElement>(".recent-item");
    if (!li) return;
    const i = Number(li.dataset.index);
    if (Number.isFinite(i)) {
      input.value = recentItems[i];
      saveRecent(input.value.trim()); // 선택도 최근검색으로 승격
      hideRecents();
      debounced(input.value);
    }
  });
  


  // X 버튼
  clearBtn.addEventListener("click", () => {
    if (input.value) {
      input.value = "";
      emit("search:clear", {});
      allowAutoRecents = true;
      showRecents();
      input.focus();
    } else {
      close();
    }
  });

  document.addEventListener("click", (e) => {
    if (!isOpen) return;
    const t = e.target as Node;
    if (!box.contains(t) && !(toggleBtn && toggleBtn.contains(t))) {
      commitRecent();
      close();
    }
  });
}
