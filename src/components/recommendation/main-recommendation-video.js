export class MainRecommendationVideo extends HTMLElement {
  constructor() {
    super();
    this._video = null;
    this._hoverTimer = null;
    this._hideTimer = null;
    this._isModalVisible = false;
    this._isHoveringTrigger = false;
    this._isHoveringModal = false;
  }

  set video(value) {
    this._video = typeof value === "object" ? value : null;
    if (this.isConnected) {
      this._render();
    }
  }

  get video() {
    return this._video;
  }

  connectedCallback() {
    this._render();
    this._setupHoverEvents();
  }

  disconnectedCallback() {
    this._clearAllTimers();
    this._removeEventListeners();
  }

  _setupHoverEvents() {
    const container = this.querySelector(".recommendation-contents-inner");
    if (!container) return;

    container.addEventListener(
      "mouseenter",
      this._handleTriggerMouseEnter.bind(this)
    );
    container.addEventListener(
      "mouseleave",
      this._handleTriggerMouseLeave.bind(this)
    );
  }

  _removeEventListeners() {
    const container = this.querySelector(".recommendation-contents-inner");
    if (!container) return;

    container.removeEventListener(
      "mouseenter",
      this._handleTriggerMouseEnter.bind(this)
    );
    container.removeEventListener(
      "mouseleave",
      this._handleTriggerMouseLeave.bind(this)
    );
  }

  _handleTriggerMouseEnter() {
    this._isHoveringTrigger = true;
    this._clearAllTimers();

    this._hoverTimer = setTimeout(() => {
      this._showModal();
    }, 3000);
  }

  _handleTriggerMouseLeave() {
    this._isHoveringTrigger = false;
    this._clearHoverTimer();

    // 모달이 보이는 상태라면 잠시 기다렸다가 숨기기
    if (this._isModalVisible) {
      this._hideTimer = setTimeout(() => {
        this._checkAndHideModal();
      }, 300); // 300ms 여유시간
    }
  }

  _handleModalMouseEnter() {
    this._isHoveringModal = true;
    this._clearHideTimer();
  }

  _handleModalMouseLeave() {
    this._isHoveringModal = false;

    // 모달에서 마우스가 벗어났을 때 약간의 지연 후 숨기기
    this._hideTimer = setTimeout(() => {
      this._checkAndHideModal();
    }, 500); // 500ms 여유시간
  }

  _checkAndHideModal() {
    // 트리거 요소나 모달 둘 다에 호버 중이 아닐 때만 숨기기
    if (!this._isHoveringTrigger && !this._isHoveringModal) {
      this._hideModal();
    }
  }

  _clearHoverTimer() {
    if (this._hoverTimer) {
      clearTimeout(this._hoverTimer);
      this._hoverTimer = null;
    }
  }

  _clearHideTimer() {
    if (this._hideTimer) {
      clearTimeout(this._hideTimer);
      this._hideTimer = null;
    }
  }

  _clearAllTimers() {
    this._clearHoverTimer();
    this._clearHideTimer();
  }

  _showModal() {
    if (this._isModalVisible) return;

    this._isModalVisible = true;

    const modal = document.createElement("div");
    modal.className = "video-hover-modal-overlay";
    modal.innerHTML = this._renderModal();

    // 현재 요소의 위치 계산
    const rect = this.getBoundingClientRect();
    modal.style.left = `${rect.left + window.scrollX}px`;
    modal.style.top = `${rect.top + window.scrollY}px`;

    document.body.appendChild(modal);

    // 애니메이션을 위한 약간의 지연
    requestAnimationFrame(() => {
      modal.classList.add("show");
      // 좋아요 상태 확인
      this._checkInitialLikeStatus();
    });

    // 모달 이벤트 설정
    this._setupModalEvents(modal);
  }
  static getLikedVideosList() {
    try {
      const likedVideos = localStorage.getItem("likedVideos");
      return likedVideos ? JSON.parse(likedVideos) : [];
    } catch (error) {
      console.error("좋아요 목록 불러오기 중 오류 발생:", error);
      return [];
    }
  }
  static clearLikedVideos() {
    try {
      localStorage.removeItem("likedVideos");
      console.log("좋아요 목록이 모두 삭제되었습니다.");
    } catch (error) {
      console.error("좋아요 목록 삭제 중 오류 발생:", error);
    }
  }

  static exportLikedVideos() {
    const likedVideos = MainRecommendationVideo.getLikedVideosList();
    const dataStr = JSON.stringify(likedVideos, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = "liked_videos.json";
    link.click();
  }

  _hideModal() {
    if (!this._isModalVisible) return;

    const modal = document.querySelector(".video-hover-modal-overlay");
    if (modal) {
      modal.classList.add("hide");
      setTimeout(() => {
        modal.remove();
        this._isModalVisible = false;
        this._isHoveringModal = false;
      }, 300);
    }
  }

  _setupModalEvents(modal) {
    const playButton = modal.querySelector(".modal-play-button");
    const likeButton = modal.querySelector(".modal-like-button");
    const actionButtons = modal.querySelectorAll(".modal-action-button");

    // 모달 호버 이벤트
    modal.addEventListener(
      "mouseenter",
      this._handleModalMouseEnter.bind(this)
    );
    modal.addEventListener(
      "mouseleave",
      this._handleModalMouseLeave.bind(this)
    );

    // 버튼 클릭 이벤트
    if (playButton) {
      playButton.addEventListener("click", (e) => {
        e.stopPropagation();
        this._handlePlayClick();
      });
    }

    if (likeButton) {
      likeButton.addEventListener("click", (e) => {
        e.stopPropagation();
        this._handleLikeClick();
      });
    }

    actionButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        this._handleActionClick(button);
      });
    });
  }

  _handlePlayClick() {
    console.log("재생 버튼 클릭:", this._video.title);
    this._hideModal();
  }

  _handleLikeClick() {
    console.log("좋아요 버튼 클릭:", this._video.title);
    const likeButton = document.querySelector(".modal-like-button");
    if (likeButton) {
      const isLiked = likeButton.classList.toggle("liked");

      // localStorage에 좋아요 상태 저장/제거
      this._updateLikeStorage(this._video, isLiked);
    }
  }

  _updateLikeStorage(video, isLiked) {
    try {
      // 기존 좋아요 목록 가져오기
      const likedVideos = this._getLikedVideos();

      if (isLiked) {
        // 좋아요 추가
        const likedVideo = {
          id: video.id || video.title, // id가 없으면 title을 사용
          title: video.title,
          thumbnail: video.thumbnail,
          likedAt: new Date().toISOString(),
        };

        // 중복 제거 후 추가
        const filteredVideos = likedVideos.filter(
          (v) => v.id !== likedVideo.id
        );
        filteredVideos.push(likedVideo);

        localStorage.setItem("likedVideos", JSON.stringify(filteredVideos));
        console.log(`"${video.title}"을(를) 좋아요 목록에 추가했습니다.`);
      } else {
        // 좋아요 제거
        const filteredVideos = likedVideos.filter(
          (v) => v.id !== (video.id || video.title)
        );
        localStorage.setItem("likedVideos", JSON.stringify(filteredVideos));
        console.log(`"${video.title}"을(를) 좋아요 목록에서 제거했습니다.`);
      }
    } catch (error) {
      console.error("좋아요 상태 저장 중 오류 발생:", error);
    }
  }

  _getLikedVideos() {
    try {
      const likedVideos = localStorage.getItem("likedVideos");
      return likedVideos ? JSON.parse(likedVideos) : [];
    } catch (error) {
      console.error("좋아요 목록 불러오기 중 오류 발생:", error);
      return [];
    }
  }

  _checkInitialLikeStatus() {
    if (this._video && this._isVideoLiked(this._video)) {
      const likeButton = document.querySelector(".modal-like-button");
      if (likeButton) {
        likeButton.classList.add("liked");
      }
    }
  }

  _isVideoLiked(video) {
    const likedVideos = this._getLikedVideos();
    return likedVideos.some((v) => v.id === (video.id || video.title));
  }

  _handleActionClick(button) {
    console.log("액션 버튼 클릭:", button.textContent.trim());
    this._hideModal();
  }

  _renderModal() {
    const { thumbnail, title, description = "설명이 없습니다." } = this._video;

    return `
      <div class="video-hover-modal">
        <div class="modal-thumbnail-section">
          <img src="${thumbnail}" alt="${title}" class="modal-large-thumbnail" />
          <div class="modal-controls-overlay">
            <button class="modal-play-button" aria-label="재생">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M8 5v14l11-7z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="modal-content-section">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-like-button" aria-label="좋아요">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-info">
            <div class="modal-badges">
              ${this._video.is_new ? '<span class="badge new">NEW</span>' : ""}
              ${
                this._video.is_new_episode
                  ? '<span class="badge episode">새 에피소드</span>'
                  : ""
              }
              ${
                this._video.is_new_season
                  ? '<span class="badge season">새 시즌</span>'
                  : ""
              }
            </div>
            
            <p class="modal-description">${description}</p>
            
            <div class="modal-actions">
              <button class="modal-action-button primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5v14l11-7z" fill="currentColor"/>
                </svg>
                지금 시청
              </button>
              <button class="modal-action-button secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                내가 찜한 콘텐츠
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _render() {
    if (this._video === null) {
      return;
    }
    const { thumbnail, title, is_new_episode, is_new, is_new_season } =
      this._video;
    this.innerHTML = `
        <div class="recommendation-contents-inner">
            <img src="${thumbnail}" alt="${title}" class="recommendation-thumbnail" />
            ${
              is_new_episode
                ? "<main-recommendation-new-episode></main-recommendation-new-episode>"
                : ""
            }
            ${
              is_new
                ? "<main-recommendation-new-video></main-recommendation-new-video>"
                : ""
            }
            ${
              is_new_season
                ? "<main-recommendation-new-season></main-recommendation-new-season>"
                : ""
            }
        </div>
    `;

    if (this.isConnected) {
      this._setupHoverEvents();
    }
  }
}
