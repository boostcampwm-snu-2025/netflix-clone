const searchInput = document.getElementById("q");
const searchForm = document.getElementById("searchForm");
const resultsContainer = document.getElementById("results");

// 서버의 기본 URL (현재 localhost:3001에서 실행 중)
const API_BASE_URL = "http://localhost:3001/api/search";



// 서버에 검색 요청을 보내고 결과를 가져오는 비동기 함수
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

// 검색 결과를 화면에 렌더링하는 함수
function renderResults(data) {
    // 1. 결과 없음 처리
    if (!data || data.total === 0) {
        resultsContainer.innerHTML = `<p>검색 결과가 없습니다. ${data.total}개의 결과</p>`;
        // [수정] 4열 배치를 위해 추가했던 클래스 제거
        resultsContainer.classList.remove('poster-grid');
        return;
    }

    // 2. 4열 배치를 위한 클래스 추가 (grid 설정)
    resultsContainer.classList.add('poster-grid');

    // 3. 총 개수 표시 (결과 컨테이너 밖에 표시되도록 임시 변수에 저장)
    const totalCountHtml = `<h2>총 ${data.total}개의 결과</h2>`;

    // 4. 검색 결과를 이미지 태그로 변환
    let itemsHtml = data.items.map(item => {
        return `
            <div class="poster-item">
                <img src="${item.image}" alt="${item.name}" title="${item.name}">
                <p class="poster-title">${item.name}</p>
            </div>
        `;
    }).join('');

    // 5. 결과를 컨테이너에 삽입 (총 개수 + 이미지들)
    resultsContainer.innerHTML = totalCountHtml + itemsHtml;
}


/**
 * 검색 버튼 클릭 이벤트 핸들러
 */
async function handleSearch(event) {
    if (event && event.preventDefault) {
        event.preventDefault(); // 폼 제출 기본 동작 방지 (새로고침 방지)
    }

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


// 이벤트 리스너 등록
searchForm.addEventListener("submit", handleSearch);

// (선택 사항) 엔터 키를 눌러도 검색이 되도록 추가
// searchInput.addEventListener("keypress", (event) => {
//     if (event.key === 'Enter') {
//         handleSearch();
//     }
// });

// 초기 상태 메시지
resultsContainer.innerHTML = `<p>검색을 시작하세요.</p>`;