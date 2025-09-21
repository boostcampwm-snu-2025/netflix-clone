const positions = new Map();
export function InitSliders(indicators, movieLists, leftButtons, rightButtons) {
    for (let i = 0; i < indicators.length; i++) {
        InitSlider(indicators[i], movieLists[i], leftButtons[i], rightButtons[i]);
    }
}

function InitSlider(indicator, movieList, leftButton, rightButton) {
    leftButton.addEventListener("click", () => MovetoLeft(indicator, movieList));
    rightButton.addEventListener("click", () => MovetoRight(indicator, movieList));
}

function MovetoLeft(indicator, movieList) {
    let current = positions.get(movieList) || 0;
    current += 100; // 왼쪽으로 100%
    positions.set(movieList, current);

    movieList.style.transform = `translateX(${current}%)`;
}
function MovetoRight(indicator, movieList) {
    let current = positions.get(movieList) || 0;
    current -= 100; // 오른쪽으로 100%
    positions.set(movieList, current);

    movieList.style.transform = `translateX(${current}%)`;
}
