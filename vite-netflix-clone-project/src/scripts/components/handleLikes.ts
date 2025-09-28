const LIKES_KEY = "netflix-liked-items";

function getLikedItems(): string[] {
	const likedItemsJSON = localStorage.getItem(LIKES_KEY);
	return likedItemsJSON ? JSON.parse(likedItemsJSON) : [];
}

function saveLikedItems(items: string[]): void {
	localStorage.setItem(LIKES_KEY, JSON.stringify(items));
}

function toggleLike(cardId: string): void {
	const likedItems = getLikedItems();
	const itemIndex = likedItems.indexOf(cardId);

	if (itemIndex > -1) {
		likedItems.splice(itemIndex, 1);
	} else {
		likedItems.push(cardId);
	}

	saveLikedItems(likedItems);
}

export function repaintLikes(
	container: Document | HTMLElement = document
): void {
	const likedItems = getLikedItems();

	const likeButtons =
		container.querySelectorAll<HTMLButtonElement>(".btn-like");

	if (likeButtons.length === 0) {
		console.error(
			"아직 DOM에 .btn-like 요소가 없습니다. 호출 시점을 확인하세요."
		);
		return;
	}

	likeButtons.forEach((button) => {
		const card = button.closest<HTMLElement>(".cr-card");
		const cardId = card?.dataset.id;

		if (cardId && likedItems.includes(cardId)) {
			button.setAttribute("aria-pressed", "true");
			button.classList.add("liked");
		} else {
			button.setAttribute("aria-pressed", "false");
			button.classList.remove("liked");
		}
	});
}

export function initLikeButtons(): void {
	document.body.addEventListener("click", (event) => {
		const target = event.target as HTMLElement;
		const likeButton = target.closest<HTMLButtonElement>(".btn-like");

		if (!likeButton) {
			return;
		}

		const card = likeButton.closest<HTMLElement>(".cr-card");
		const cardId = card?.dataset.id;

		if (!cardId) return;

		toggleLike(cardId);

		const isPressed = likeButton.getAttribute("aria-pressed") === "true";
		likeButton.setAttribute("aria-pressed", String(!isPressed));
		likeButton.classList.toggle("liked");
	});
}
