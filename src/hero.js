import { createStyledElement } from "./utils.js";

export const renderHero = () => {
  const body = document.body;
  const hero = createStyledElement("section", [
    "flex flex-col w-screen relative",
  ]);
  const heroImg = composeHeroImage();
  const heroOverlay = composeHeroOverlay();
  const shadowDiv = composeShadowDiv();

  hero.appendChild(heroImg);
  hero.appendChild(heroOverlay);
  hero.appendChild(shadowDiv);
  body.appendChild(hero);
};
const composeHeroImage = () => {
  const heroImg = createStyledElement("img", ["w-full"]);
  heroImg.src = "assets/section/hero_bg.webp";
  heroImg.alt = "Hero Image";
  return heroImg;
};
const composeHeroOverlay = () => {
  const heroOverlay = createStyledElement("div", [
    "w-[518px] pl-[60px] text-white justify-center top-0 gap-[8px] h-full flex flex-col absolute",
  ]);
  const heroOverlayImg = createStyledElement("img", ["w-full"]);
  heroOverlayImg.src = "assets/section/hero_overlay.webp";
  heroOverlay.appendChild(heroOverlayImg);
  const heroTitle = createStyledElement("h2", ["text-[23px]"]);
  heroTitle.innerText = "시청자 추천";

  const heroDescription = createStyledElement("p", ["text-[14px]"]);
  heroDescription.innerText =
    "직업이 없는 싱글 여성. 예상치 못한 사건들을 겪은 후, 연애 경험이 없는\n샐러리맨을 위해 일하게 된다. 직책이 뭐냐고? 그건 바로 그의 아내.";
  heroOverlay.appendChild(heroTitle);
  heroOverlay.appendChild(heroDescription);

  const heroButtonsRow = createStyledElement("div", [
    "flex flex-row gap-[8px] text-[18px]",
  ]);
  const playBtn = createStyledElement("button", [
    "rounded-[4px] cursor-pointer flex flex-row gap-[8px] text-black items-center px-[16px] py-[8px] border-transparent bg-white hover:opacity-70",
  ]);
  const playImg = createStyledElement("img");
  playImg.src = "assets/section/play.svg";
  playImg.alt = "play button icon";
  playBtn.appendChild(playImg);
  const playText = createStyledElement("p");
  playText.innerText = "재생";
  playBtn.appendChild(playText);
  const infoBtn = createStyledElement("button", [
    "rounded-[4px] cursor-pointer flex flex-row gap-[8px] items-center px-[16px] py-[8px] border-transparent bg-[#6d6d6e]/70 text-white hover:opacity-70",
  ]);
  const infoImg = createStyledElement("img");

  infoImg.src = "assets/section/info.svg";
  infoImg.alt = "info button icon";
  infoBtn.appendChild(infoImg);
  const infoText = createStyledElement("p");
  infoText.innerText = "상세 정보";
  infoBtn.appendChild(infoText);

  heroButtonsRow.appendChild(playBtn);
  heroButtonsRow.appendChild(infoBtn);

  heroOverlay.appendChild(heroButtonsRow);

  return heroOverlay;
};

const composeShadowDiv = () => {
  const shadowDiv = createStyledElement("div", [
    "grid absolute bottom-0 w-screen h-[100px] bg-linear-to-b from-base/0 to-base/100",
  ]);
  return shadowDiv;
};
