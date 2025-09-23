const positions = new Map();
const sliderIndex = new Map();
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
    let sI = sliderIndex.get(movieList) || 0;
    sI += 1;
    if(sI >= (movieList.children.length)/4){ //TODO : replace hardcoding
        sI = 0;
    }
    sliderIndex.set(movieList, sI)
    
    let current = positions.get(movieList) || 0;
    current += 100; // 왼쪽으로 100%
    positions.set(movieList, current);
    
    movieList.style.transform = `translateX(${sI*100}%)`;
}
function MovetoRight(indicator, movieList) {
    let sI = sliderIndex.get(movieList) || 0;
    sI += 1;
    if(sI >= (movieList.children.length)/4){ //TODO : replace hardcoding
        sI = 0;
    }
    sliderIndex.set(movieList, sI)
    
    let current = positions.get(movieList) || 0;
    current -= 100; // 오른쪽으로 100%
    positions.set(movieList, current);
    
    movieList.style.transform = `translateX(${-sI*100}%)`;
    movieList.style.transition = `${sI === 0?'none':'transform 0.5s ease-in-out'}`;
    if(sI === 0) {
        setTimeout(() => MovetoRight(indicator, movieList), 10);

    }}
function UpdateIndicator(indicator, movieList) {
    const current = positions.get(movieList) || 0;
    let sI = sliderIndex.get(movieList) || 0;
    
    if(sI >= (movieList.children.length)/4){ //TODO : replace hardcoding
        sI = 0;
    }
    console.log("move"+sI);
    
    indicator.src = `../asset/dummy/index${sI}.png`;
}
