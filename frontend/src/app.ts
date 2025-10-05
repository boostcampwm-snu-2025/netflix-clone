import "./global.css";
import Footer from "~/components/footer";
import Header from "~/components/header";
import LoadingSpinner from "~/components/loading-spinner";
import Main from "~/components/main";
import handleCarousel from "~/events/handleCarousel";
import handleLike from "~/events/handleLike";
import handleModal from "~/events/handleModal";
import handleSearch from "~/events/handleSearch";

const appElement = document.querySelector<HTMLDivElement>('div#app')!;

appElement.innerHTML = LoadingSpinner();

const [header, main] = await Promise.all([Header(), Main()]);
appElement.innerHTML = `
${header}
${main}
${Footer()}
`;

document.querySelectorAll(".modal-container").forEach(handleModal);
document.querySelectorAll(".carousel").forEach(handleCarousel);
document.querySelectorAll(".like").forEach(handleLike);
document.querySelectorAll(".search-container").forEach(handleSearch);