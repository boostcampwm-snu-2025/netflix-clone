export function initializeSearchFeature() {
    const searchIcon = document.querySelector('.header__icon--magnifier');
    const searchInput = document.getElementById('header__search');
    const searchContainer = document.querySelector('.modal--magnifier');
    const resultsOverlay = document.getElementById('search-results-overlay');

    if (!searchIcon || !searchInput || !searchContainer || !resultsOverlay) {
        console.error("검색 기능에 필요한 HTML 요소를 찾을 수 없습니다.");
        return;
    }

    // 돋보기 아이콘 클릭 시 검색창을 토글
    searchIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // 문서 전체에 설정된 클릭 이벤트가 바로 실행되는 것을 방지
        searchContainer.classList.toggle('active');

        // 검색창이 활성화되면 즉시 입력할 수 있도록 포커스
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // 검색창 외부를 클릭하면 검색창과 결과 창 닫기
    document.addEventListener('click', (event) => {
        if (!searchContainer.contains(event.target)) {
            searchContainer.classList.remove('active');
            resultsOverlay.classList.remove('visible');
        }
    });

    // 실시간으로 검색 결과를 요청하고 표시
    searchInput.addEventListener('input', async (event) => {
        const searchTerm = event.target.value;

        if (searchTerm.trim() !== '') {
            await requestAndRenderResults(searchTerm, resultsOverlay);
            resultsOverlay.classList.add('visible'); // 결과 창 표시
        } else {
            resultsOverlay.classList.remove('visible'); // 검색어가 없으면 결과 창 숨김
        }
    });

    // 검색창 포커스 아웃('blur') 이벤트: 결과 창을 숨깁니다.
    searchInput.addEventListener('blur', () => {
        // 바로 숨기면 결과 항목을 클릭할 수 없으므로, 약간의 시간차
        setTimeout(() => {
            resultsOverlay.classList.remove('visible');
        }, 150);
    });

    // 검색창 포커스 인('focus') 이벤트: 검색어가 이미 있다면 결과 창을 다시 보여줍니다.
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() !== '') {
            resultsOverlay.classList.add('visible');
        }
    });
}

async function requestAndRenderResults(term, container) {
    try {
        const url = `http://localhost:3001/api/search?q=${encodeURIComponent(term)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const results = await response.json();
        renderResults(results, container);
    } catch (error) {
        console.error("검색 결과를 가져오는 데 실패했습니다:", error);
        container.innerHTML = `<div class="error-message">결과를 불러올 수 없습니다.</div>`;
    }
}

function renderResults(data, container) {
    // 검색 결과가 없을 경우 메시지 표시
    if (data.length === 0) {
        container.innerHTML = `<div class="no-results-message">검색 결과가 없습니다.</div>`;
        return;
    }

    // 각 데이터 항목을 HTML 문자열로 변환하여 리스트 생성
    container.innerHTML = data.map(item => `
        <div class="search-result-item" data-id="${item.id}">
            ${item.title}
        </div>
    `).join('');
}