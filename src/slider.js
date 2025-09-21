const positions = new Map();
export function InitSliders(indicators, movieLists, leftButtons, rightButtons) {
    for (let i = 0; i < indicators.length; i++) {
        InitSlider(indicators[i], movieLists[i], leftButtons[i], rightButtons[i]);
    }
}

function InitSlider(indicator, movieList, leftButton, rightButton) {
    leftButton.addEventListener("click", () => MovetoLeft(indicator, movieList));
    leftButton.addEventListener("click", () => UpdateIndicator(indicator, movieList));
    rightButton.addEventListener("click", () => MovetoRight(indicator, movieList));
    rightButton.addEventListener("click", () => UpdateIndicator(indicator, movieList));
    rightButton.addEventListener("click", () => {leftButton.style.visibility = "visible";});
    
    leftButton.style.visibility = "hidden";
    if(movieList.children.length <= 4){ //TODO : replace hardcoding
        rightButton.style.visibility = "hidden";
    }
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

function UpdateIndicator(indicator, movieList) {
    const current = positions.get(movieList) || 0;
    const index = Math.abs(current / 100);

    indicator.src = `../asset/dummy/index${index}.png`;
} 
