export default class Search {
  constructor() {
    // DOM 요소
    this.searchIcon = document.querySelector('.search-icon');
    this.searchBox = document.querySelector('.search-box');
    this.searchClose = document.querySelector('.search-close');
    this.searchInput = document.querySelector('.search-input');
    this.searchContainer = document.querySelector('.search-container');
    this.recentSearchesLayer = document.querySelector('.recent-searches-layer');
    this.recentSearchesList = document.querySelector('.recent-searches-list');

    // 검색 결과 페이지 요소
    this.searchResultsSection = document.querySelector('.search-results-section');
    this.searchResultsTitle = document.querySelector('.search-results-title');
    this.searchResultsGrid = document.querySelector('.search-results-grid');
    this.mainElement = document.querySelector('main');
    this.footerElement = document.querySelector('footer');
    this.headerElement = document.querySelector('.header');

    // 상태
    this.recentSearches = this.loadRecentSearches();
    this.selectedIndex = -1;
    this.debounceTimer = null;
    this.isSearching = false;
    this.currentQuery = '';

    // API 설정
    this.API_BASE_URL = 'http://localhost:3000';

    this.bindEvents();
    this.renderRecentSearches();
  }

  bindEvents() {
    // 돋보기 아이콘 클릭 - 검색창 열기
    this.searchIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openSearch();
    });

    // 닫기 버튼 클릭
    this.searchClose.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeSearch();
    });

    // 검색창 내부 클릭 시 이벤트 전파 중단
    this.searchBox.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // 레이어 클릭 시 이벤트 전파 중단
    this.recentSearchesLayer.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // 검색 결과 섹션 클릭 시 이벤트 전파 중단
    this.searchResultsSection.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // 헤더 클릭 시 검색 완전히 닫기
    this.headerElement.addEventListener('click', (e) => {
      if (this.searchBox.classList.contains('active') || !this.searchResultsSection.classList.contains('hidden')) {
        e.stopPropagation();
        this.closeSearch();
      }
    });

    // 검색 입력 이벤트
    this.searchInput.addEventListener('input', (e) => {
      this.handleInput(e.target.value);
    });

    // 검색창 포커스 이벤트
    this.searchInput.addEventListener('focus', () => {
      this.showRecentSearches();
    });

    // 키보드 이벤트
    this.searchInput.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });

    // 문서 전체 클릭 시 검색창 닫기
    document.addEventListener('click', () => {
      if (this.searchBox.classList.contains('active')) {
        // 검색어가 입력되어 있으면 검색창만 닫고 검색 페이지는 유지
        if (this.searchInput.value.trim() !== '') {
          this.searchBox.classList.remove('active');
          this.hideAllLayers();
        } else {
          // 검색어가 없으면 완전히 닫기
          this.closeSearch();
        }
      }
    });
  }

  openSearch() {
    this.searchBox.classList.add('active');
    this.searchInput.focus();
  }

  closeSearch() {
    this.searchBox.classList.remove('active');
    this.searchInput.value = '';
    this.hideAllLayers();
    this.selectedIndex = -1;
    this.clearDebounce();
    this.hideSearchPage();
  }

  hideAllLayers() {
    this.recentSearchesLayer.classList.remove('show');
  }

  showRecentSearches() {
    if (this.searchInput.value.trim() === '') {
      this.hideAllLayers();
      this.selectedIndex = -1;
      this.clearSelection();
      if (this.recentSearches.length > 0) {
        this.recentSearchesLayer.classList.add('show');
        this.recentSearchesLayer.classList.remove('empty');
      } else {
        this.recentSearchesLayer.classList.add('show', 'empty');
      }
    }
  }

  handleInput(value) {
    const trimmedValue = value.trim();

    // 입력값이 없으면 최근 검색어 표시 및 원래 페이지 복원
    if (trimmedValue === '') {
      this.hideAllLayers();
      this.showRecentSearches();
      this.clearDebounce();
      this.hideSearchPage();
      return;
    }

    // 최근 검색어 레이어 숨기기
    this.recentSearchesLayer.classList.remove('show');
    this.selectedIndex = -1;
    this.clearSelection();

    // Debounce 처리 후 검색 실행
    this.clearDebounce();
    this.debounceTimer = setTimeout(() => {
      this.performSearch(trimmedValue);
    }, 300);
  }

  clearDebounce() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }


  handleKeydown(e) {
    const isRecentVisible = this.recentSearchesLayer.classList.contains('show');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.navigateDown(isRecentVisible);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.navigateUp(isRecentVisible);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.selectCurrentItem(isRecentVisible);
    }
  }

  navigateDown(isRecentVisible) {
    if (isRecentVisible) {
      const items = this.recentSearchesList.querySelectorAll('li');
      if (items.length === 0) return;

      this.clearSelection();
      this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
      items[this.selectedIndex].classList.add('keyboard-selected');
    }
  }

  navigateUp(isRecentVisible) {
    if (isRecentVisible) {
      const items = this.recentSearchesList.querySelectorAll('li');
      if (items.length === 0) return;

      this.clearSelection();
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      items[this.selectedIndex].classList.add('keyboard-selected');
    }
  }

  selectCurrentItem(isRecentVisible) {
    if (isRecentVisible) {
      const items = this.recentSearchesList.querySelectorAll('li');
      if (this.selectedIndex >= 0 && this.selectedIndex < items.length) {
        const keyword = items[this.selectedIndex].textContent;
        this.searchInput.value = keyword;
        this.handleInput(keyword);
      }
    } else if (this.searchInput.value.trim() !== '') {
      // 엔터로 검색어 입력 - 최근 검색어에 추가
      const keyword = this.searchInput.value.trim();
      this.addRecentSearch(keyword);
      this.hideAllLayers();
    }
  }

  clearSelection() {
    document.querySelectorAll('.keyboard-selected').forEach(item => {
      item.classList.remove('keyboard-selected');
    });
  }

  // 검색 API 호출
  async performSearch(query) {
    if (this.isSearching) return;

    this.isSearching = true;
    this.showSearchPage();
    this.showSearchLoading();

    try {
      const response = await fetch(`${this.API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error('검색 API 요청 실패');
      }

      const data = await response.json();
      this.renderSearchResults(data.items, query);

    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      this.showSearchError();
    } finally {
      this.isSearching = false;
    }
  }

  showSearchPage() {
    this.mainElement.classList.add('hidden');
    this.footerElement.classList.add('hidden');
    this.searchResultsSection.classList.remove('hidden');
  }

  hideSearchPage() {
    this.searchResultsSection.classList.add('hidden');
    this.mainElement.classList.remove('hidden');
    this.footerElement.classList.remove('hidden');
    this.clearSearchResults();
  }

  showSearchLoading() {
    this.searchResultsSection.classList.add('loading');
    this.searchResultsSection.classList.remove('empty', 'error');
  }

  showSearchError() {
    this.searchResultsSection.classList.add('error');
    this.searchResultsSection.classList.remove('loading', 'empty');
  }

  renderSearchResults(results, query) {
    this.searchResultsSection.classList.remove('loading', 'error', 'empty');

    // 현재 검색어 저장
    this.currentQuery = query;

    // 제목 설정
    this.searchResultsTitle.textContent = `"${query}" 검색 결과 (${results.length}개)`;

    // 빈 결과 처리
    if (results.length === 0) {
      this.searchResultsSection.classList.add('empty');
      this.searchResultsGrid.innerHTML = '';
      return;
    }

    // 결과 렌더링
    this.searchResultsGrid.innerHTML = results.map(item => `
      <div class="search-result-card" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div class="search-result-card-title">${item.name}</div>
      </div>
    `).join('');

    // 카드 클릭 이벤트 추가
    this.searchResultsGrid.querySelectorAll('.search-result-card').forEach(card => {
      card.addEventListener('click', () => {
        // 현재 검색어를 최근 검색어에 추가
        this.addRecentSearch(this.currentQuery);
      });
    });
  }

  clearSearchResults() {
    this.searchResultsGrid.innerHTML = '';
    this.searchResultsTitle.textContent = '';
    this.searchResultsSection.classList.remove('loading', 'error', 'empty');
  }

  // 최근 검색어 관리
  loadRecentSearches() {
    const saved = localStorage.getItem('netflix-recent-searches');
    return saved ? JSON.parse(saved) : [];
  }

  saveRecentSearches() {
    localStorage.setItem('netflix-recent-searches', JSON.stringify(this.recentSearches));
  }

  addRecentSearch(keyword) {
    // 중복 제거
    this.recentSearches = this.recentSearches.filter(item => item !== keyword);

    // 맨 앞에 추가
    this.recentSearches.unshift(keyword);

    // 최대 5개까지만 유지
    this.recentSearches = this.recentSearches.slice(0, 5);

    this.saveRecentSearches();
    this.renderRecentSearches();
  }

  renderRecentSearches() {
    if (this.recentSearches.length === 0) {
      this.recentSearchesList.innerHTML = '';
      return;
    }

    this.recentSearchesList.innerHTML = this.recentSearches.map((keyword, index) => `
      <li data-index="${index}">${keyword}</li>
    `).join('');

    // 최근 검색어 클릭 이벤트
    this.recentSearchesList.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', () => {
        const keyword = item.textContent;
        this.searchInput.value = keyword;
        this.handleInput(keyword);
      });
    });
  }
}
