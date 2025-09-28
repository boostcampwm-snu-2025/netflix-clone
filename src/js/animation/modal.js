export function initializeHeaderInteraction() {
    const modalProfile = document.querySelector('.modal-wrapper--profile');
    const transTriangle = document.querySelector('.header__icon--triangle');

    if (!modalProfile || !transTriangle) return;

    modalProfile.addEventListener("mouseover", function(){
        transTriangle.classList.add('on');
    });

    modalProfile.addEventListener("mouseout", function(){
        transTriangle.classList.remove('on');
    });
}