import "./global.css";
import LoadingSpinner from "~/components/loading-spinner";

const appElement = document.querySelector<HTMLDivElement>('div#app')!;

appElement.innerHTML = LoadingSpinner();

const [Footer, Header, Main, handleModal, handleCarousel, handleLike] = await Promise.all([
  import("~/components/footer").then(module => module.default),
  import("~/components/header").then(module => module.default),
  import("~/components/main").then(module => module.default),
  import("~/events/handleModal").then(module => module.default),
  import("~/events/handleCarousel").then(module => module.default),
  import("~/events/handleLike").then(module => module.default),
]);

const [header, main] = await Promise.all([Header(), Main()]);
appElement.innerHTML = `
${header}
${main}
${Footer()}
`;

document.querySelectorAll(".modal-container").forEach(handleModal);
document.querySelectorAll(".carousel").forEach(handleCarousel);
document.querySelectorAll(".like").forEach(handleLike);
