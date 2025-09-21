import { Footer } from "./footer/index.js";
import { Header } from "./header/index.js";
import { Main } from "./main/index.js";
import { handleModal } from "../js/modal.js";
import { handleSlider } from "../js/slider.js";

const [header, main, footer] = await Promise.all([
  Header(),
  Main(),
  Footer(),
]);

document.body.innerHTML = `
  ${header}
  ${main}
  ${footer}
`.trim();

handleModal(document.querySelector(".notification"));
handleModal(document.querySelector(".profile"));
document.querySelectorAll(".slider").forEach(handleSlider);
