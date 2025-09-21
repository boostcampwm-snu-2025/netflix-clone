export function initializeHeaderInteraction() {
    const modalProfile = document.querySelector('.profile-wrapper');
    const transTriangle = document.querySelector('.triangle');

    if (!modalProfile || !transTriangle) return;

    modalProfile.addEventListener("mouseover", function(){
        transTriangle.classList.add('on');
    });

    modalProfile.addEventListener("mouseout", function(){
        transTriangle.classList.remove('on');
    });
}