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

    // 상태
    this.recentSearches = this.loadRecentSearches();
    this.selectedIndex = -1;

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
        this.closeSearch();
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

    // 입력값이 없으면 최근 검색어 표시
    if (trimmedValue === '') {
      this.hideAllLayers();
      this.showRecentSearches();
      return;
    }

    // 최근 검색어 레이어 숨기기
    this.recentSearchesLayer.classList.remove('show');
    this.selectedIndex = -1;
    this.clearSelection();
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
