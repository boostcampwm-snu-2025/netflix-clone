//  * @param {string} tag - 생성할 HTML 태그 이름 (e.g., 'div', 'img', 'p')
//  * @param {string} class_name - 요소에 적용할 클래스 이름
//  * @param {HTMLElement} parent - 생성된 요소를 추가할 부모 요소
//  * @returns {HTMLElement} 생성된 DOM 요소
export function create_component(tag, class_name, parent) {
    const component = document.createElement(tag);
    component.className = class_name;
    parent.appendChild(component);
    return component;
}

//  * @param {string} tag - 생성할 HTML 태그 이름 (e.g., 'div', 'img', 'p')
//  * @param {string} class_name - 요소에 적용할 클래스 이름
//  * @param {HTMLElement} parent - 생성된 요소를 추가할 부모 요소
//  * @param {string} img_src - 이미지 요소 경로
export function create_component_with_img(tag, class_name, parent, img_src) {
    const component = create_component(tag, class_name, parent);
    const img = create_component("img", `${class_name}-img`, component);
    img.src = img_src;
    return component
}

export function debounce(callback, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args)        
        }, delay)    
    }
}
