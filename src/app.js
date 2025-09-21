const alarm_modal = document.querySelector("#alarm_modal");
const profile_modal = document.querySelector("#profile_modal");

const alarm_modal_body = document.querySelector("#alarm_modal_body");
const profile_modal_body = document.querySelector("#profile_modal_body");

alarm_modal.addEventListener("mouseover", () => {
    alarm_modal_body.style.display = "flex";
})

alarm_modal.addEventListener("mouseout", () => { 
    alarm_modal_body.style.display = "none";
})

profile_modal.addEventListener("mouseover", () => {
    profile_modal_body.style.display = "flex";
})

profile_modal.addEventListener("mouseout", () => { 
    profile_modal_body.style.display = "none";
})

import { InitSliders } from './slider.js';
InitSliders(document.querySelectorAll(".MovieIndicator"),
    document.querySelectorAll(".MovieList"),
    document.querySelectorAll(".LeftButton"), 
    document.querySelectorAll(".RightButton")
);