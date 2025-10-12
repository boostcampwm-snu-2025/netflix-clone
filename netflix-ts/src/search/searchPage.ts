type Item = { id: string | number; name: string; image: string; desc?: string; type?: string };

export function initSearchPage() {
  const header = document.querySelector<HTMLElement>("header.header") || document.querySelector("header");
  const home = document.querySelector<HTMLElement>("#main");

  // 헤더 바로 아래에 결과 섹션 삽입
  let root = document.querySelector<HTMLElement>("#search-page");
  if (!root) {
    root = document.createElement("section");
    root.id = "search-page";
    header?.insertAdjacentElement("afterend", root);
  }

  root.classList.add("search-page");
  root.innerHTML = `
    <div class="search-page__inner">
      <div class="search-page__header" id="search-header" aria-live="polite"></div>
      <div class="search-page__loading" id="search-loading" hidden>불러오는 중…</div>
      <div class="search-page__empty" id="search-empty" hidden>검색 결과가 없습니다.</div>
      <ul class="search-grid" id="search-grid"></ul>
    </div>
  `;

  const headerEl = root.querySelector<HTMLElement>("#search-header")!;
  const gridEl   = root.querySelector<HTMLElement>("#search-grid")!;
  const emptyEl  = root.querySelector<HTMLElement>("#search-empty")!;
  const loadingEl= root.querySelector<HTMLElement>("#search-loading")!;

  // 🔧 헤더가 fixed/sticky면 헤더 높이 + gap만큼 결과 섹션을 아래로 내림
  function applyTopOffset() {
    if (!header) return;
    const cs = getComputedStyle(header);
    const pos = cs.position;
    const gap = 12; // 헤더와 결과 사이 여백
    if (pos === "fixed" || pos === "sticky") {
      const h = header.getBoundingClientRect().height;
      (root as HTMLElement).style.marginTop = `${h + gap}px`;
    } else {
      (root as HTMLElement).style.marginTop = "";
    }
  }
  applyTopOffset();
  // 창 크기 변경/폰트 로딩 등으로 헤더 높이가 바뀌면 다시 계산
  window.addEventListener("resize", applyTopOffset);

  const show = () => { root.hidden = false; home?.setAttribute("hidden",""); applyTopOffset(); };
  const hide = () => { root.hidden = true;  home?.removeAttribute("hidden"); };

  const setHeader = (q: string, total?: number) => {
    headerEl.textContent = q
      ? (total == null ? `“${q}” 검색 중…` : `“${q}” 검색 결과 ${total}건`)
      : "";
  };
  const setLoading = (on: boolean) => { loadingEl.hidden = !on; };
  const setEmpty   = (on: boolean) => { emptyEl.hidden = !on; };

  const render = (items: Item[], query: string) => {
    show();
    setHeader(query, items.length);
    setLoading(false);
    setEmpty(items.length === 0);
    gridEl.innerHTML = items.map(it => `
      <li class="search-grid__card" data-id="${it.id}">
        <figure class="search-grid__poster"><img src="${it.image}" alt="" /></figure>
        <div class="search-grid__title">${it.name}</div>
      </li>
    `).join("");
  };

  document.addEventListener("search:loading", (e: any) => {
    show(); setHeader(e.detail?.query ?? "", undefined); setLoading(true); setEmpty(false); gridEl.innerHTML = "";
  });
  document.addEventListener("search:results", (e: any) => {
    const { query, items } = e.detail ?? { query: "", items: [] };
    render(items ?? [], query ?? "");
  });
  document.addEventListener("search:error", (e: any) => {
    show(); setHeader(e.detail?.query ?? "", 0); setLoading(false); setEmpty(true);
    gridEl.innerHTML = `<li class="search-grid__error">오류: ${e.detail?.message ?? "알 수 없는 오류"}</li>`;
  });
  document.addEventListener("search:clear", () => {
    hide(); gridEl.innerHTML = ""; setHeader("", 0); setLoading(false); setEmpty(false);
  });

  hide(); // 초기엔 홈만
}
