import LikeOutlined from '/assets/main/like-outlined.svg?raw';
import LikeFilled from '/assets/main/like-filled.svg?raw';

export default function handleLike(like: Element) {
  const button = like.querySelector(".like-button")!;
  let liked = false;

  function updateLikeButton() {
    button.innerHTML = liked ? LikeFilled : LikeOutlined;
  }
  updateLikeButton();

  button.addEventListener("click", () => {
    liked = !liked;
    updateLikeButton();
  });
}
