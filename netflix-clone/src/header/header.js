// =================================================================
// Header
// =================================================================
import { create_component, create_component_with_img } from "../utils.js";
import { Card } from "../content/card/card.js";

// Functions
function create_logo(parent, data) {
    const logo = create_component("div", "logo", parent);
    const logo_image = create_component("img", "logo-img", logo);
    logo_image.src = data.img_src;
    logo_image.alt = data.img_alt;
}

function create_primary_navigation(parent, data) {
    const primary_navigation = create_component("ul", "primary-navigation", parent);
    data.forEach(elem => {
        create_primary_navigation_item(primary_navigation, elem);
    });
}

function create_primary_navigation_item(parent, data) {
    const container = create_component("li", "primary-navigation-item-container", parent);
    const item = create_component("a", "primary-navigation-item", container);
    item.innerHTML = data.text;
    item.href = data.link;
}

function create_secondary_navigation(parent, data) {
    const secondary_navigation = create_component("ul", "secondary-navigation", parent);
    create_search(secondary_navigation, data.search);
    create_notification(secondary_navigation, data.notification);
    create_user_profile(secondary_navigation, data.profile);
}

function create_secondary_navigation_item(parent, img_src, alt) {
    const container = create_component("li", "secondary-navigation-item-container", parent);
    
    if (alt != "user-profile") {
        const item = create_component("button", alt, container);
        const icon = create_component("img", `${item.className}-icon`, item);
        icon.src = img_src;
        icon.alt = alt;
    } else {
        const user_profile_container = create_component("div", "user-profile-container", container);
        const item = create_component("button", alt, user_profile_container);
        const icon = create_component("img", `${item.className}-icon`, item);
        icon.src = img_src;
        icon.alt = alt;
        const dropdown = create_component("div", "profile-dropdown", user_profile_container);
        user_profile_container.addEventListener('mouseenter', () => {
            dropdown.classList.add("is-rotated");
        })
        user_profile_container.addEventListener('mouseleave', () => {
            dropdown.classList.remove("is-rotated");
        })
    }

    return container;
}

// ==========================================================================================

function create_search(parent, data) {
    const search_container = create_secondary_navigation_item(parent, data.img_src, data.alt);
    const search_button = document.querySelector(".search-button");
    const search_modal = create_search_modal(search_container, data.search_bar);
}

function create_search_modal(parent, data) {
    const search_modal = create_component("div", "search-modal", parent);
    const search_bar = create_component("form", "search-bar", search_modal);
    const search_icon = create_component_with_img("div", "search-icon", search_bar, data.search.img_src);
    const user_input = create_user_input(search_bar, data.user_input);
    const cancel_button = create_component_with_img("button", "cancel-button", search_bar, data.cancel.img_src);
    add_search_modal_animation(parent, cancel_button, search_modal);
    search(user_input, data.icons);

    return search_modal;
}

function create_user_input(parent, data) {
    const user_input = create_component("input", "user-input", parent);
    user_input.type = "text";
    user_input.placeholder = data.text;
    return user_input;
}

function add_search_modal_animation(search_button, cancel_button, search_modal) {
    search_button.addEventListener("click", () => {
        search_modal.classList.add("active");
    });

    cancel_button.addEventListener("click", () => {
        search_modal.classList.remove("active");
    })
}

function search(user_input, data) {
    user_input.addEventListener("input", () => {
        const current_input = user_input.value;
        initialize_search_results(current_input);
        request_search(current_input, data);
    })
}

function initialize_search_results(current_input) {
    const hero = document.querySelector(".hero");
    const content = document.querySelector(".content");        
    if (current_input === "") {
        hero.style.display = "flex";
        content.style.display = "flex";
    } else {
        hero.style.display = "none";
        content.style.display = "none";
    }
}

function request_search(current_input, data) {
    const base_url = "http://localhost:3001/api/search";
    const query = `?q=${current_input}`;
    const url = base_url + query;
    fetch(url)
        .then(res => res.json())
        .then(response => {
            let results = response.items;
            construct_search_results(results, current_input, data);
        })
}

function construct_search_results(results, current_input, data) {
    let search_results = reset_search_results();
    if (results.length === 0) {
        search_results.textContent = `입력하신 검색어 "${current_input}"와(과) 일치하는 결과가 없습니다.`;
    } else {    
        let current_row = null;
        results.forEach((result, index) => {
            if (index % 6 === 0) current_row = create_component("div", "search-results-row", search_results);
            const card_width = 214;
            const card_height = 121;
            const card_type = "category";
            const result_card = new Card(current_row, index, card_width, card_height, data, result, card_type);
        });
    }
}

function reset_search_results() {
    const old_search_results = document.querySelector(".search-results");
    if (old_search_results) old_search_results.remove();
    const footer = document.querySelector(".footer");
    const search_results = document.createElement("div");
    search_results.className = "search-results";
    document.body.insertBefore(search_results, footer);
    return search_results;
}

// ================================================================================

function create_notification(parent, data) {
    create_secondary_navigation_item(parent, data.img_src, data.alt);
    const notification_button = document.querySelector(".notification-button");
    create_notification_modal(notification_button, data.items);
}

function create_notification_modal(parent, data) {
    const notification_modal = create_component("div", "notification-modal", parent);
    const tooltip_arrow = create_component("div", "notification-tooltip-arrow", notification_modal);
    const tooltip_background = create_component("div", "notification-tooltip-background", notification_modal);
    data.forEach(elem => {
        create_notification_item(tooltip_background, elem.img_src, elem.text, elem.time);
    })
}

function create_notification_item(parent, img_src, text, time) {
    const container = create_component("div", "notification-item", parent);
    create_component_with_img("div", "notification-item-left", container, img_src);
    const container_right = create_component("div", "notification-item-right", container);
    const text_box = create_component("div", "notification-item-text", container_right);
    text_box.innerHTML = text;
    const time_box = create_component("div", "notification-item-time", container_right);
    time_box.innerHTML = time;
}

function create_user_profile(parent, data) {
    create_secondary_navigation_item(parent, data.img_src, data.alt);
    const user_profile = document.querySelector(".user-profile");
    create_user_profile_modal(user_profile, data.items);
}

function create_user_profile_modal(parent, data) {
    const user_profile_modal = create_component("div", "user-profile-modal", parent);
    const tooltip_arrow = create_component("div", "profile-tooltip-arrow", user_profile_modal);
    const tooltip_background = create_component("div", "profile-tooltip-background", user_profile_modal);
    data.forEach(elem => {
        create_profile_item(tooltip_background, elem.img_src, elem.text)
    })
    const logout_button = create_component("button", "logout-button", user_profile_modal);
    logout_button.innerHTML = "넷플릭스에서 로그아웃";
}

function create_profile_item(parent, img_src, text) {
    const container = create_component("div", "profile-item", parent);
    create_component_with_img("button", "profile-icon", container, img_src);
    const text_box = create_component("div", "profile-text", container);
    text_box.innerHTML = text;
}

export function create_header(parent, data) {
    const header = create_component("header", "header", parent);
    const header_left = create_component("div", "header-left", header, data);
    const header_right = create_component("div", "header-right", header, data);

    // Logo
    create_logo(header_left, data.logo);

    // Navigation
    create_primary_navigation(header_left, data.primary_navigation);
    create_secondary_navigation(header_right, data.secondary_navigation);
}