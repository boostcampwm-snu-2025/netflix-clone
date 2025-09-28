import type {
	HeroData,
	Notification,
	Profile,
	CarouselData,
	ContentItem,
} from "../../types/types";
import { repaintLikes } from "../components/handleLikes";

// Hero
export function renderHero(data: HeroData) {
	const heroSection = document.querySelector<HTMLElement>(".hero");
	const rankEl = document.querySelector(".hero-content .rank");
	const descEl = document.querySelector(".hero-content .desc");

	if (heroSection) heroSection.style.backgroundImage = `url(${data.image})`;
	if (rankEl) rankEl.textContent = data.rank;
	if (descEl) descEl.textContent = data.description;
}

// Notification
export function renderNotifications(data: Notification[]) {
	const list = document.querySelector(".notif-dropdown ul");
	if (!list) return;
	list.innerHTML = data
		.map(
			(item) => `
				<li>
					<img src="${item.image}" alt="${item.alt}" />
					<div class="notif-text">
						<p class="notif-title">${item.title}</p>
						<p class="notif-desc">${item.desc}</p>
					</div>
				</li>
			`
		)
		.join("");
}

// Profile
export function renderProfiles(data: Profile[]) {
	const list = document.querySelector(".profile-list");
	const divider = list?.querySelector(".divider");
	if (!list || !divider) return;

	list.querySelectorAll(".profile-item").forEach((item) => item.remove());
	data.forEach((profile) => {
		const li = document.createElement("li");
		li.className = "profile-item";
		li.innerHTML = `
      <img src="${profile.avatar}" alt="${profile.name}" class="avatar" />
      <span>${profile.name}</span>
    `;
		list.insertBefore(li, divider);
	});
}

// Carousel
export function renderCarousels(data: CarouselData[]) {
	const top10Section = document.querySelector(".top10-section");
	if (!top10Section) return;

	// 기존 캐러셀은 삭제
	document.querySelectorAll(".carousel-row").forEach((row) => row.remove());

	// Top 10 섹션 앞에 새로운 캐러셀들을 추가
	data.forEach((carousel) => {
		const section = document.createElement("section");
		section.className = "carousel-row";
		section.setAttribute("data-carousel", "");
		const currentCarousel = carousel.id;
		const cardsHtml = carousel.items
			.map(
				(item, index) => `
				<div class="cr-card" data-id="${currentCarousel + "-" + index}">
					<div class="card-media">
						<img src="${item.image}" alt="${item.alt}" />
					</div>
					<div class="card-hover">
						<div class="hover-top">
							<div class="hover-right">
								<button class="icon-btn circle play" aria-label="재생">
									<span class="material-symbols-outlined">play_arrow</span>
								</button>
								<button class="icon-btn circle ghost" aria-label="내가 찜한 리스트에 추가">
									<span class="material-symbols-outlined">add</span>
								</button>
								<button class="icon-btn circle ghost btn-like" aria-label="좋아요" aria-pressed="false">
									<span class="material-symbols-outlined">thumb_up</span>
								</button>
							</div>
							<div class="hover-left">
								<button class="icon-btn circle ghost" aria-label="더보기">
									<span class="material-symbols-outlined">expand_more</span>
								</button>
							</div>
						</div>

						<div class="hover-meta">
							<div class="age-badge">15+</div>
							<span class="series-type">리미티드 시리즈</span>
							<span class="quality">HD</span>
						</div>

						<div class="hover-genres">
							순한맛 코미디 | 재밌는 | 셀럽
						</div>
					</div>
				</div>
   			`
			)
			.join("");

		section.innerHTML = `
			<h2>${carousel.title}</h2>
			<button class="cr-btn prev" aria-label="이전">&#10094;</button>
			<div class="cr-viewport"><div class="cr-track">${cardsHtml}</div></div>
			<button class="cr-btn next" aria-label="다음">&#10095;</button>
    	`;
		top10Section.parentNode?.insertBefore(section, top10Section);
	});

	repaintLikes(document);
}

// TOP 10
export function renderTop10(data: ContentItem[]) {
	const list = document.querySelector(".top10-list");
	if (!list) return;
	list.innerHTML = data
		.map(
			(item) => `
				<li class="top10-item" data-rank="${item.alt}">
				<div class="poster-wrap">
					<img class="poster-23" src="${item.image}" alt="${item.alt}" />
				</div>
				</li>
			`
		)
		.join("");
}
