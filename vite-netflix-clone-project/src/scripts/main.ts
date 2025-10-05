import "../styles/style.css";
import { mountCarousels } from "./components/infiniteCarousel";
import { top10 } from "./components/top10";
import { fetchNetflixData } from "./api/fetchData";
import {
	renderHero,
	renderNotifications,
	renderProfiles,
	renderCarousels,
	renderTop10,
} from "./render/render";
import { initLikeButtons } from "./components/handleLikes";
import { initSearchToggle } from "./components/search";

async function initializeApp() {
	try {
		// fetch data
		const data = await fetchNetflixData();

		// render UI using the fetched data
		renderHero(data.hero);
		renderNotifications(data.notifications);
		renderProfiles(data.profiles);
		renderCarousels(data.carousels);
		renderTop10(data.top10);

		// handle other events on the rendered DOM
		mountCarousels();
		top10();

		initLikeButtons();

		initSearchToggle(data);
	} catch (error) {
		document.body.innerHTML = `<h1>페이지 로딩 중 오류가 발생했습니다.</h1>`;
	}
}

document.addEventListener("DOMContentLoaded", initializeApp);
