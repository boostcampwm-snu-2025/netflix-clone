

// 서버의 기본 URL (현재 localhost:3001에서 실행 중)
const API_BASE_URL = "http://localhost:3001/api/search";


///////////// Search Related Functions /////////////
const searchInput = document.getElementById("q");
const searchForm = document.getElementById("searchForm");
const resultsContainer = document.getElementById("results");
// Search Request to server, and retrieve (asynchronous)
async function fetchSearchResults(query) {
    // 쿼리 파라미터를 인코딩하여 안전하게 URL에 추가합니다.
    const url = `${API_BASE_URL}?q=${encodeURIComponent(query)}`;

    // 로딩 상태 표시
    resultsContainer.innerHTML = `<p>검색 중...</p>`;

    try {
        const response = await fetch(url);

        // HTTP 상태 코드가 200-299 범위가 아니면 오류 처리
        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        const data = await response.json();
        console.log("서버 응답 데이터:", data);
        return data; // { items: [...], total: N } 형태의 객체 반환

    } catch (error) {
        console.error("검색 중 오류 발생:", error);
        resultsContainer.innerHTML = `<p style="color: red;">데이터를 가져오는 데 실패했습니다. 서버를 확인해주세요.</p>`;
        return null;
    }
}
// Render Search Results
function renderResults(data) {
    // 결과 없음 처리
    if (!data || data.total === 0) {
        resultsContainer.innerHTML = `<p>검색 결과가 없습니다.</p>`;
        return;
    }

    // 총 개수 표시 (결과 컨테이너 밖에 표시되도록 임시 변수에 저장)
    const totalCountHtml = `<h2>총 ${data.total}개의 결과</h2>`;

    // 검색 결과를 이미지 태그로 변환
    let itemsHtml = data.items.map(item => {
        return `
            <div class="poster-item">
                <img src="${item.image}" alt="${item.name}" title="${item.name}">
                <p class="poster-title">${item.name}</p>
            </div>
        `;
    }).join('');
    // 포스터들을 그리드 컨테이너로 감싸기
    const gridHtml = `<div class="poster-grid">${itemsHtml}</div>`;

    // 결과를 컨테이너에 삽입 (총 개수 + 이미지들)
    resultsContainer.innerHTML = totalCountHtml + gridHtml;
}
// Search Event Handler
async function handleSearch(event) {
    const query = searchInput.value.trim(); // 입력된 값 가져오기

    if (query.length === 0) {
        resultsContainer.innerHTML = `<p>검색어를 입력해주세요.</p>`;
        return;
    }

    // 1. 서버에서 데이터 가져오기
    const resultData = await fetchSearchResults(query);

    // 2. 결과를 화면에 표시하기
    if (resultData) {
        renderResults(resultData);
    }
}



///////////// Recent Key Related Functions /////////////
const RECENT_KEY = "recent_searches";
const MAX_RECENT = 5;
const recentLayer = document.getElementById("recentLayer");
const searchBar = document.getElementById("q");

function loadRecent() {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
}

function saveRecent(arr) {
    localStorage.setItem(RECENT_KEY, JSON.stringify(arr))
}

function addRecent(q) {
    const cur = (q || "").trim(); // remove whitespace
    if (cur.length === 0) return; // if blank, return

    // load and add cur to recent items
    let arr = loadRecent().filter(x => x !== cur); // remove duplicates
    arr.unshift(cur); // add to front

    // keep only MAX_RECENT items
    if (arr.length > MAX_RECENT)
        arr = arr.slice(0, MAX_RECENT);

    saveRecent(arr);
    console.log("Saved recent searches:", arr);
}

function renderRecent() {
    const ul = document.getElementById("recentList");
    const recentitems = loadRecent();

    // if no items
    if (!recentitems.length) {
        recentLayer.hidden = true;
        return;
    }

    ul.innerHTML = recentitems.map(v => `
        <li class="recent-item" data-q="${encodeURIComponent(v)}">
          <span class="recent-text">${v.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>
        </li>
    `).join("");
    recentLayer.hidden = false;
}

function hideRecent() {
    recentLayer.hidden = true;
}


///////////// Register Event Listeners /////////////
// Search Event Listner
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    addRecent(searchInput.value);
    hideRecent();
    await handleSearch();
});


// Recent Item Event Listner
// click on searchbar, render recents
searchBar.addEventListener("click", renderRecent);
// click elsewhere, hide recents
document.addEventListener("click", (event) => {
    // if event is not a child of searchbar or recentLayer, hide
    if (!searchBar.contains(event.target) && !recentLayer.contains(event.target)) {
        hideRecent();
    }
});
// escape key, hide recents
searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        hideRecent();
    }
});

// click on specific item
document.getElementById("recentList").addEventListener("click", (e) => {
    const li = e.target.closest(".recent-item");
    if (!li) return;

    const q = decodeURIComponent(li.dataset.q || "");

    // update search input
    searchInput.value = q;
    hideRecent();
});