
const profile = document.querySelector('.basic_profile');
const transTriangle = document.querySelector('.triangle');



profile.addEventListener("mouseover", function(){
    transTriangle.classList.add('on');
});

profile.addEventListener("mouseout", function(){
    transTriangle.classList.remove('on');
});