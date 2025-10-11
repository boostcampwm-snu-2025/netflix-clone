const DEBOUNCE_DELAY = 500; // 디바운스 딜레이 (ms)
let debounceTimer;

//초기화 함수
export function initSearchBar() {
  const searchBox = document.getElementById("search-box");
  const searchInput = document.getElementById("search-input");
  const searchIcon = document.getElementById("search-icon");
  const resultContainer = document.getElementById("search-results");

  attachEventHandlers(searchInput, searchBox, searchIcon, resultContainer);
  attachOverlayCloseHandler(searchInput, resultContainer);
}

//이벤트 핸들러 연결 함수
function attachEventHandlers(input, box, icon, container) {
  //검색 아이콘 클릭 시 검색 실행
  icon.addEventListener("click", () => {
    const query = input.value.trim();
    if (!query) return;

    performSearch(query, container);
  });

  //입력 필드에 입력 시 디바운스 적용해 검색 실행
  input.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    clearTimeout(debounceTimer);

    if (query === "") {
      container.innerHTML = "";
      return;
    }

    debounceTimer = setTimeout(() => {
      performSearch(query, container);
    }, DEBOUNCE_DELAY);
  });

  //입력 필드 포커스 시 검색창 확장
  input.addEventListener("focus", () => box.classList.add("active"));
  input.addEventListener("blur", () => {
    if (input.value.trim() === "") box.classList.remove("active");
  });
}

//검색 수행 함수 (API 호출 및 필터링)
async function performSearch(query, container) {
  try {
    const res = await fetch(
      `http://localhost:4000/api/search?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    const filtered = filterResults(data, query);
    renderResults(filtered, container);
  } catch (error) {
    console.error("검색 중 오류 발생:", error);
  }
}

//필터링 함수
function filterResults(data, query) {
  return data.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
}

//검색 결과 렌더링 함수
function renderResults(list, container) {
  const body = document.body;

  // 검색 결과 렌더링 시작 ( → 오버레이 보이기)
  if (list.length > 0) {
    body.classList.add("show-overlay");
  } else {
    body.classList.add("show-overlay");
    container.innerHTML = `<p class="no-result">검색 결과가 없습니다.</p>`;
  }

  const html = list
    .map((item) => `<img src="${item.image}" alt="${item.name}" />`)
    .join("");

  container.innerHTML = html;
}

//오버레이 닫는 함수(검색어 비었을 때)
function attachOverlayCloseHandler(input, container) {
  const body = document.body;

  // 입력창이 비어 있으면 닫기
  input.addEventListener("input", () => {
    if (input.value.trim() === "") {
      container.innerHTML = "";
      body.classList.remove("show-overlay");
    }
  });
}
