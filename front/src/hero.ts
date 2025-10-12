import { appendChildrenSync, createStyledElement } from "./utils";

export const composeHero = async (): Promise<HTMLElement> => {
  const heroFetchRes = await fetch("/data/hero.json");
  const { background, overlay } = await heroFetchRes.json();

  const hero = createStyledElement("section", [
    "flex flex-col w-screen relative",
  ]);
  await appendChildrenSync(hero, [
    composeHeroImage(background.src),
    composeHeroOverlay(overlay.src, overlay.title, overlay.description),
    composeShadowDiv,
  ]);

  return hero;
};
const composeHeroImage = (src: string): HTMLElement => {
  const heroImg = createStyledElement("img", ["w-full"]);
  heroImg.src = src;
  heroImg.alt = "Hero Image";
  return heroImg;
};
const composeHeroOverlay = (
  src: string,
  title: string,
  description: string,
): HTMLElement => {
  const heroOverlay = createStyledElement("div", [
    "w-[518px] pl-[60px] text-white justify-center top-0 gap-[8px] h-full flex flex-col absolute",
  ]);
  const heroOverlayImg = createStyledElement("img", ["w-full"]);
  heroOverlay.src = src;
  heroOverlay.appendChild(heroOverlayImg);
  const heroTitle = createStyledElement("h2", ["text-[23px]"]);
  heroTitle.innerText = title;

  const heroDescription = createStyledElement("p", ["text-[14px]"]);
  heroDescription.innerText = description;
  heroOverlay.appendChild(heroTitle);
  heroOverlay.appendChild(heroDescription);

  const heroButtonsRow = createStyledElement("div", [
    "flex flex-row gap-[8px] text-[18px]",
  ]);
  const playBtn = createStyledElement("button", [
    "rounded-[4px] cursor-pointer flex flex-row gap-[8px] text-black items-center px-[16px] py-[8px] border-transparent bg-white hover:opacity-70",
  ]);
  const playImg = createStyledElement("img");
  playImg.src = "/section/play.svg";
  playImg.alt = "play button icon";
  playBtn.appendChild(playImg);
  const playText = createStyledElement("p");
  playText.innerText = "재생";
  playBtn.appendChild(playText);
  const infoBtn = createStyledElement("button", [
    "rounded-[4px] cursor-pointer flex flex-row gap-[8px] items-center px-[16px] py-[8px] border-transparent bg-[#6d6d6e]/70 text-white hover:opacity-70",
  ]);
  const infoImg = createStyledElement("img");

  infoImg.src = "/section/info.svg";
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

const composeShadowDiv = (): HTMLDivElement => {
  const shadowDiv = createStyledElement("div", [
    "grid absolute bottom-0 w-screen h-[100px] bg-linear-to-b from-base/0 to-base/100",
  ]);
  return shadowDiv;
};
