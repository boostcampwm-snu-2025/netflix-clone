// 검색 기능 모듈
// 함수만을 사용하여 구현

const API_BASE_URL = 'http://localhost:8080'
const RECENT_SEARCHES_KEY = 'recentSearches'
const MAX_RECENT_SEARCHES = 5
const DEBOUNCE_DELAY = 500

let debounceTimer = null
let currentSelectedIndex = -1
let recentSearchesList = []

/**
 * 검색 기능 초기화
 */
export function initSearchFeature() {
    const searchButton = document.querySelector('.search-button')
    const searchInput = document.querySelector('.search-input')
    const searchCloseBtn = document.querySelector('.search-close-btn')
    
    if (!searchButton || !searchInput) {
        console.warn('Search elements not found')
        return
    }
    
    // 검색 버튼 클릭 이벤트
    searchButton.addEventListener('click', handleSearchButtonClick)
    
    // 검색 닫기 버튼 클릭 이벤트
    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', handleSearchClose)
    }
    
    // 검색어 입력 이벤트
    searchInput.addEventListener('input', handleSearchInput)
    
    // 검색창 포커스 이벤트
    searchInput.addEventListener('focus', handleSearchFocus)
    
    // 검색창 외부 클릭 이벤트
    document.addEventListener('click', handleOutsideClick)
    
    // 키보드 네비게이션
    searchInput.addEventListener('keydown', handleKeyboardNavigation)
    
    // 최근 검색어 로드
    loadRecentSearches()
}

/**
 * 검색 버튼 클릭 핸들러
 */
function handleSearchButtonClick(event) {
    event.stopPropagation()
    toggleSearchBox()
}

/**
 * 검색창 열기/닫기 토글
 */
function toggleSearchBox() {
    const searchContainer = document.querySelector('.search-container')
    const searchInput = document.querySelector('.search-input')
    
    if (!searchContainer) return
    
    const isExpanded = searchContainer.classList.contains('expanded')
    
    if (isExpanded) {
        closeSearchBox()
    } else {
        openSearchBox()
    }
}

/**
 * 검색창 열기
 */
function openSearchBox() {
    const searchContainer = document.querySelector('.search-container')
    const searchInput = document.querySelector('.search-input')
    
    searchContainer.classList.add('expanded')
    setTimeout(() => {
        searchInput.focus()
    }, 300)
}

/**
 * 검색창 닫기
 */
function closeSearchBox() {
    const searchContainer = document.querySelector('.search-container')
    const searchInput = document.querySelector('.search-input')
    const searchResults = document.querySelector('.search-results')
    const recentSearchesLayer = document.querySelector('.recent-searches')
    
    searchContainer.classList.remove('expanded')
    searchInput.value = ''
    
    if (searchResults) {
        searchResults.innerHTML = ''
        searchResults.style.display = 'none'
    }
    
    if (recentSearchesLayer) {
        recentSearchesLayer.style.display = 'none'
    }
    
    currentSelectedIndex = -1
}

/**
 * 검색창 닫기 버튼 핸들러
 */
function handleSearchClose(event) {
    event.stopPropagation()
    closeSearchBox()
}

/**
 * 검색어 입력 핸들러 (debounce 적용)
 */
function handleSearchInput(event) {
    const keyword = event.target.value.trim()
    
    // 최근 검색어 레이어 숨김
    hideRecentSearches()
    
    // debounce 처리
    clearTimeout(debounceTimer)
    
    if (keyword.length === 0) {
        clearSearchResults()
        return
    }
    
    // 0.5초 후에 검색 실행
    debounceTimer = setTimeout(() => {
        performSearch(keyword)
    }, DEBOUNCE_DELAY)
}

/**
 * 실제 검색 실행
 */
async function performSearch(keyword) {
    try {
        showLoadingState()
        
        const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(keyword)}`)
        
        if (!response.ok) {
            throw new Error('Search request failed')
        }
        
        const data = await response.json()
        
        displaySearchResults(data.items)
        saveRecentSearch(keyword)
        
    } catch (error) {
        console.error('Search error:', error)
        displayErrorMessage('검색 중 오류가 발생했습니다.')
    }
}

/**
 * 로딩 상태 표시
 */
function showLoadingState() {
    const searchResults = document.querySelector('.search-results')
    searchResults.style.display = 'block'
    searchResults.innerHTML = '<div class="search-loading">검색 중...</div>'
}

/**
 * 검색 결과 표시
 */
function displaySearchResults(results) {
    const searchResults = document.querySelector('.search-results')
    
    if (!results || results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">검색 결과가 없습니다.</div>'
        return
    }
    
    const resultsHTML = results.map(item => createSearchResultItem(item)).join('')
    
    searchResults.innerHTML = `
        <div class="search-results-list">
            ${resultsHTML}
        </div>
    `
    
    // 결과 클릭 이벤트 (이벤트 위임)
    searchResults.addEventListener('click', handleResultClick)
}

/**
 * 검색 결과 아이템 HTML 생성
 */
function createSearchResultItem(item) {
    return `
        <div class="search-result-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="result-thumbnail" />
            <div class="result-info">
                <div class="result-title">${item.name}</div>
                <div class="result-type">${item.type === 'series' ? '시리즈' : '영화'}</div>
            </div>
        </div>
    `
}

/**
 * 검색 결과 클릭 핸들러
 */
function handleResultClick(event) {
    const resultItem = event.target.closest('.search-result-item')
    if (resultItem) {
        const title = resultItem.querySelector('.result-title').textContent
        console.log('선택한 콘텐츠:', title)
        // 여기에 상세 페이지 이동 등의 로직 추가 가능
    }
}

/**
 * 에러 메시지 표시
 */
function displayErrorMessage(message) {
    const searchResults = document.querySelector('.search-results')
    searchResults.style.display = 'block'
    searchResults.innerHTML = `<div class="search-error">${message}</div>`
}

/**
 * 검색 결과 초기화
 */
function clearSearchResults() {
    const searchResults = document.querySelector('.search-results')
    searchResults.innerHTML = ''
    searchResults.style.display = 'none'
}

/**
 * 검색창 포커스 핸들러
 */
function handleSearchFocus() {
    const searchInput = document.querySelector('.search-input')
    
    if (searchInput.value.trim().length === 0) {
        displayRecentSearches()
    }
}

/**
 * 최근 검색어 로드
 */
function loadRecentSearches() {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    recentSearchesList = stored ? JSON.parse(stored) : []
}

/**
 * 최근 검색어 저장
 */
function saveRecentSearch(keyword) {
    if (!keyword || keyword.trim().length === 0) return
    
    // 중복 제거
    recentSearchesList = recentSearchesList.filter(item => item !== keyword)
    
    // 맨 앞에 추가
    recentSearchesList.unshift(keyword)
    
    // 최대 5개까지만 유지
    if (recentSearchesList.length > MAX_RECENT_SEARCHES) {
        recentSearchesList = recentSearchesList.slice(0, MAX_RECENT_SEARCHES)
    }
    
    // localStorage에 저장
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearchesList))
}

/**
 * 최근 검색어 레이어 표시
 */
function displayRecentSearches() {
    if (recentSearchesList.length === 0) return
    
    const recentSearchesLayer = document.querySelector('.recent-searches')
    
    if (!recentSearchesLayer) return
    
    const itemsHTML = recentSearchesList
        .map((keyword, index) => createRecentSearchItem(keyword, index))
        .join('')
    
    recentSearchesLayer.innerHTML = `
        <div class="recent-searches-title">최근 검색어</div>
        <div class="recent-searches-list">
            ${itemsHTML}
        </div>
    `
    
    recentSearchesLayer.style.display = 'block'
    
    // 클릭 이벤트 (이벤트 위임)
    recentSearchesLayer.addEventListener('click', handleRecentSearchClick)
}

/**
 * 최근 검색어 아이템 HTML 생성
 */
function createRecentSearchItem(keyword, index) {
    return `
        <div class="recent-search-item" data-index="${index}" data-keyword="${keyword}">
            <span class="recent-search-text">${keyword}</span>
        </div>
    `
}

/**
 * 최근 검색어 클릭 핸들러
 */
function handleRecentSearchClick(event) {
    const item = event.target.closest('.recent-search-item')
    if (item) {
        const keyword = item.dataset.keyword
        selectRecentSearch(keyword)
    }
}

/**
 * 최근 검색어 선택
 */
function selectRecentSearch(keyword) {
    const searchInput = document.querySelector('.search-input')
    searchInput.value = keyword
    hideRecentSearches()
    performSearch(keyword)
}

/**
 * 최근 검색어 레이어 숨김
 */
function hideRecentSearches() {
    const recentSearchesLayer = document.querySelector('.recent-searches')
    if (recentSearchesLayer) {
        recentSearchesLayer.style.display = 'none'
    }
    currentSelectedIndex = -1
}

/**
 * 키보드 네비게이션 핸들러
 */
function handleKeyboardNavigation(event) {
    const recentSearchesLayer = document.querySelector('.recent-searches')
    
    // 최근 검색어 레이어가 표시되지 않으면 무시
    if (!recentSearchesLayer || recentSearchesLayer.style.display === 'none') {
        return
    }
    
    const items = recentSearchesLayer.querySelectorAll('.recent-search-item')
    
    if (items.length === 0) return
    
    if (event.key === 'ArrowDown') {
        event.preventDefault()
        navigateRecentSearches('down', items)
    } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        navigateRecentSearches('up', items)
    } else if (event.key === 'Enter') {
        event.preventDefault()
        if (currentSelectedIndex >= 0 && currentSelectedIndex < items.length) {
            const keyword = items[currentSelectedIndex].dataset.keyword
            selectRecentSearch(keyword)
        }
    }
}

/**
 * 최근 검색어 방향키 네비게이션
 */
function navigateRecentSearches(direction, items) {
    // 현재 선택 제거
    items.forEach(item => item.classList.remove('selected'))
    
    if (direction === 'down') {
        currentSelectedIndex = (currentSelectedIndex + 1) % items.length
    } else if (direction === 'up') {
        currentSelectedIndex = currentSelectedIndex <= 0 ? items.length - 1 : currentSelectedIndex - 1
    }
    
    // 새로운 선택 표시
    items[currentSelectedIndex].classList.add('selected')
}

/**
 * 검색창 외부 클릭 핸들러
 */
function handleOutsideClick(event) {
    const searchContainer = document.querySelector('.search-container')
    
    if (!searchContainer) return
    
    const isClickInside = searchContainer.contains(event.target)
    
    if (!isClickInside && searchContainer.classList.contains('expanded')) {
        closeSearchBox()
    }
}
