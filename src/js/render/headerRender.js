export async function headerRender() {
    const container = document.getElementById('header-container');
    if (!container) return;

    const response = await fetch('./data/headerData.json');
    const headerData = await response.json();

    // 탭 목록 HTML 생성
    const tabsHtml = headerData.tabs.map(tab => `<li class="header__tab-item">${tab}</li>`).join('');

    // 알림 모달 컨텐츠 HTML 생성
    const notificationsHtml = headerData.notifications.map(item => `
        <img src="${item.imgSrc}">
        <div class="modal__font--notification">
            ${item.text}
            <span class="modal__text--time">${item.time}</span>
        </div>
    `).join('');

    // 프로필 모달 컨텐츠 HTML 생성
    const profilesHtml = headerData.profiles.map(item => `
        <img src="${item.imgSrc}">
        <div class="modal__font--profile">${item.name}</div>
    `).join('');

    // 최종 헤더 HTML 조립
    container.innerHTML = `
        <nav class="header__nav">
            <a href="#" class="header__logo-link">
                <div class="header__logo--cutting">
                    <img src="${headerData.logo.src}" class="header__logo--netflix" alt="${headerData.logo.alt}">
                </div>
            </a>
            <ul class="header__tab-list">${tabsHtml}</ul>
        </nav>
        <div>
            <ul class = "header__icon-list">
                <li>
                    <div class="search-wrapper">
                        <div class="modal--magnifier">
                            <img src="${headerData.icons.magnifier.src}" class="header__icon--magnifier" alt="${headerData.icons.magnifier.alt}">
                            <input type=search id=header__search placeholder="제목, 사람, 장르">
                        </div>
                        <div id="search-results-overlay" class="search-results-overlay"></div>
                    </div>
                </li>
                <li>
                    <div class="modal-wrapper--notification">
                        <img src="${headerData.icons.bell.src}" class="header__item--notification" alt="${headerData.icons.bell.alt}">
                        <div class="modal--notification">${notificationsHtml}</div>
                    </div>
                </li>
                <li>
                    <div class="modal-wrapper--profile">
                        <img src="${headerData.icons.profile.src}" class="header__icon--basic_profile" alt="${headerData.icons.profile.alt}">
                        <div class="modal--profile">${profilesHtml}</div>
                    </div>
                </li>
                <li><img src="${headerData.icons.triangle.src}" class="header__icon--triangle" alt="${headerData.icons.triangle.alt}"></li>
            </ul>
        </div>
    `;
}