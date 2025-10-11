export default class Search {
  constructor() {
    this.searchIcon = document.querySelector('.search-icon');
    this.searchBox = document.querySelector('.search-box');
    this.searchClose = document.querySelector('.search-close');
    this.searchInput = document.querySelector('.search-input');
    this.searchContainer = document.querySelector('.search-container');
    
    this.bindEvents();
  }

  bindEvents() {
    this.searchIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openSearch();
    });
    
    this.searchClose.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeSearch();
    });
    
    // 검색창 내부 클릭 시 이벤트 전파 중단
    this.searchBox.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // 문서 전체에 클릭 이벤트 리스너 추가
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
  }
}
