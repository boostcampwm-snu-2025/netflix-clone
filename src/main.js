//  * @param {string} tag - 생성할 HTML 태그 이름 (e.g., 'div', 'img', 'p')
//  * @param {string} class_name - 요소에 적용할 클래스 이름
//  * @param {HTMLElement} parent - 생성된 요소를 추가할 부모 요소
//  * @returns {HTMLElement} 생성된 DOM 요소
function create_component(tag, class_name, parent) {
    const component = document.createElement(tag);
    component.className = class_name;
    parent.appendChild(component);
    return component;
}

// =================================================================
// Header
// =================================================================
const header = document.querySelector(".header");
const header_left = create_component("div", "header-left", header);
const header_right = create_component("div", "header-right", header);

// Logo
const logo = create_component("div", "logo", header_left);
const logo_image = create_component("img", "", logo); // logo img에는 클래스 없음
logo_image.src = "images/logo.png";
logo_image.alt = "Netflix logo";

// Navigation
const primary_navigation = create_component("ul", "primary-navigation", header_left);

const primary_navigation_items = [
    { text: "홈", link: "#" }, { text: "시리즈", link: "#" },
    { text: "영화", link: "#" }, { text: "게임", link: "#" },
    { text: "NEW! 요즘 대세 컨텐츠", link: "#" },
    { text: "내가 찜한 리스트", link: "#" },
    { text: "언어별로 찾아보기", link: "#" }
];

function create_primary_navigation_item(parent, text, link) {
    const container = create_component("li", "primary-navigation-item-container", parent);
    const item = create_component("a", "primary-navigation-item", container);
    item.textContent = text;
    item.href = link;
}

primary_navigation_items.forEach(item => {
    create_primary_navigation_item(primary_navigation, item.text, item.link);
});

const secondary_navigation = create_component("ul", "secondary-navigation", header_right);

const secondary_navigation_items = [
    { icon_src: "images/search_icon.png", alt: "search-button" },
    { icon_src: "images/notification_icon.png", alt: "notification-button" },
    { icon_src: "images/profile.jpg", alt: "profile" },
];

function create_secondary_navigation_item(parent, icon_src, alt) {
    const container = create_component("li", "secondary-navigation-item-container", parent);
    const item = create_component("button", alt, container);
    const icon = create_component("img", "", item);
    icon.src = icon_src;
    icon.alt = alt;
}

secondary_navigation_items.forEach(item => {
    create_secondary_navigation_item(secondary_navigation, item.icon_src, item.alt);
});


// =================================================================
// Hero
// =================================================================
const hero = document.querySelector(".hero");

const poster = create_component("img", "poster", hero);
poster.src = "images/poster.webp";
poster.alt = "오징어게임 포스터";

const overlay = create_component("div", "overlay", hero);
const hero_content = create_component("div", "hero-content", hero);

const hero_title = create_component("img", "hero-title", hero_content);
hero_title.src = "images/title.webp";
hero_title.alt = "오징어게임 타이틀";

const hero_description = create_component("p", "hero-description", hero_content);
hero_description.innerHTML = "전 세계 시청 시간 16억 5천만을 넘기며 역대 최고의 인기를 기록한 시리즈<br>빚더미에서 허우적대던 참가자들이 거액을 차지하고자 목숨을 걸고<br>위험천만한 아이들의 놀이에 뛰어든다.";

const hero_button_container = create_component("div", "hero-button-container", hero_content);

// Play Button
const play_button = create_component("button", "play-button", hero_button_container);
const play_button_icon = create_component("span", "play-button-icon", play_button);
play_button_icon.innerHTML = "►";
const play_button_text = create_component("span", "play-button-text", play_button);
play_button_text.innerHTML = "재생";

// Details Button
const details_button = create_component("button", "details-button", hero_button_container);
const details_button_icon = create_component("span", "details-button-icon", details_button);
details_button_icon.innerHTML = "ⓘ";
const details_button_text = create_component("span", "details-button-text", details_button);
details_button_text.innerHTML = "상세 정보";

// =================================================================
// Category
// =================================================================
function create_category_section(parent, items, header_text) {
    const container = create_component("div", "category-section-container", parent);
    const header = create_component("div", "category-section-header", container);
    header.textContent = header_text;
    const slider = create_component("ul", "category-section-slider", container);
    items.forEach(item => {
        create_slider_item(slider, item.img_src);
    });
}

function create_slider_item(parent, img_src) {
    // const item_container = create_component("div", "category-section-slider-item-container", parent)
    
    // const item = create_component("li", "category-section-slider-item", item_container);
    const item = create_component("li", "category-section-slider-item", parent);
    const item_img = create_component("img", "", item);
    item_img.src = img_src;
    
    // const inner_item = create_component("div", "category-section-slider-inner-item", item_container);
    const inner_item = create_component("div", "category-section-slider-inner-item", item);
    const inner_item_img = create_component("img", "", inner_item);
    inner_item_img.src = img_src;
    
    const inner_item_canvas = create_component("div", "category-section-slider-inner-item-canvas", inner_item);
    const button_container = create_component("div", "button-container", inner_item_canvas);

    const left_button_container = create_component("div", "left-button-container", button_container);
    create_button("category-play-button", left_button_container, "images/play_button.png");
    create_button("category-add-button", left_button_container, "images/add_button.png");
    create_button("category-like-button", left_button_container, "images/like_button.png");
    
    const right_button_container = create_component("div", "right-button-container", button_container);
    create_button("category-dropdown-button", right_button_container, "images/dropdown_button.png");

    const description = create_component("p", "category-section-slider-inner-item-description", inner_item_canvas);
    description.innerHTML = "Content Description";
}

function create_button(class_name, parent, icon_src) {
    const button = create_component("button", class_name, parent);
    const icon = create_component("img", "", button);
    icon.src = icon_src;
}

const upper_category = document.querySelector(".upper-category");
const upper_first_section_items = [{img_src: "images/slider_item1.jpg"}, {img_src: "images/slider_item2.jpg"},
                                   {img_src: "images/slider_item3.jpg"}, {img_src: "images/slider_item4.jpg"},
                                   {img_src: "images/slider_item5.jpg"}, {img_src: "images/slider_item6.jpg"}];
const upper_first_section_header_text = "넷플릭스 시리즈"
create_category_section(upper_category, upper_first_section_items, upper_first_section_header_text);

const upper_second_section_items = [{img_src: "images/slider_item7.webp"}, {img_src: "images/slider_item8.webp"},
                                    {img_src: "images/slider_item9.webp"}, {img_src: "images/slider_item10.webp"},
                                    {img_src: "images/slider_item11.webp"}, {img_src: "images/slider_item12.webp"}];
const upper_second_section_header_text = "매주 공개! 이건 꼭 봐야 해"
create_category_section(upper_category, upper_second_section_items, upper_second_section_header_text);

const lower_category = document.querySelector(".lower-category");
const lower_first_section_items = [{img_src: "images/slider_item13.jpg"}, {img_src: "images/slider_item14.jpg"},
                                   {img_src: "images/slider_item15.webp"}, {img_src: "images/slider_item16.webp"},
                                   {img_src: "images/slider_item17.jpg"}, {img_src: "images/slider_item18.webp"}];
const lower_first_section_header_text = "어워드 수상 범죄 시리즈"
create_category_section(lower_category, lower_first_section_items, lower_first_section_header_text);

const lower_second_section_items = [{img_src: "images/slider_item19.webp"}, {img_src: "images/slider_item20.jpg"},
                                    {img_src: "images/slider_item21.webp"}, {img_src: "images/slider_item22.webp"},
                                    {img_src: "images/slider_item23.webp"}, {img_src: "images/slider_item24.webp"}];
const lower_second_section_header_text = "어워드 수상 한국 드라마"
create_category_section(lower_category, lower_second_section_items, lower_second_section_header_text);

// =================================================================
// Footer
// =================================================================
function create_member_link_row(items, parent) {
    const link_row = create_component("tr", "member-link-row", parent);
    items.forEach(item => {
        const member_link_container = create_component("td", "member-link-container", link_row);
        const member_link = create_component("a", "member-link", member_link_container);
        member_link.innerHTML = item.text;
        member_link.href = item.link;
    })
}

const footer = document.querySelector(".footer");
const social_link_container = create_component("ul", "social-link-container", footer);
const social_link_items = [{img_src: "images/facebook_icon.png", class_name: "facebook-button"}, 
                           {img_src: "images/instagram_icon.png", class_name: "instagram-button"},
                           {img_src: "images/twitter_icon.png", class_name: "twitter-button"}, 
                           {img_src: "images/youtube_icon.png", class_name: "youtube-button"}];
social_link_items.forEach(item => {
    create_button(item.class_name, social_link_container, item.img_src);
});

const member_link_table = create_component("table", "member-link-table", footer);
const member_link_items = [[{text: "화면 해설", link: "#"}, {text: "고객 센터", link:"#"}, {text: "기프트카드", link: "#"}, {text: "미디어 센터", link: "#"}],
                           [{text: "투자 정보(IR)", link: "#"}, {text: "입사 정보", link:"#"}, {text: "이용 약관", link: "#"}, {text: "개인정보", link: "#"}],
                           [{text: "법적 고지", link: "#"}, {text: "쿠키 설정", link:"#"}, {text: "회사 정보", link: "#"}, {text: "문의하기", link: "#"}]];
member_link_items.forEach(item => {
    create_member_link_row(item, member_link_table);
})

const copyright_container = create_component("ul", "copyright-container", footer);
const copyright_items = [{text: "넷플릭스서비시스코리아 유한회사 통신판매업신고번호: 제2018-서울종로-0426호 전화번호: 00-308-321-0161 (수신자 부담)"}, 
                         {text: "대표: 레지널드 숀 톰프슨"},
                         {text: "이메일 주소: korea@netflix.com"},
                         {text: "주소: 대한민국 서울특별시 종로구 우정국로 26, 센트로폴리스 A동 20층 우편번호 03161"},
                         {text: "사업자등록번호: 165-87-00119"},
                         {text: "클라우드 호스팅: Amazon Web Services Inc."},
                         {text: "공정거래위원회 웹사이트"}];
copyright_items.forEach(item => {
    const copyright_item = create_component("span", "copyright-item", copyright_container);
    copyright_item.innerHTML = item.text;
})
