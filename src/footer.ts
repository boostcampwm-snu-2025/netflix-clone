import { appendChildrenSync, createStyledElement } from "./utils";

export const composeFooter = async (): Promise<HTMLElement> => {
  const etcElements = [
    "화면 해설",
    "고객 센터",
    "기프트카드",
    "미디어 센터",
    "투자 정보(IR)",
    "입사 정보",
    "이용 약관",
    "개인정보",
    "법적 고지",
    "쿠키 설정",
    "회사 정보",
    "문의하기",
  ];
  const snsImages = [
    "/footer/facebook.svg",
    "/footer/instagram.svg",
    "/footer/twitter.svg",
    "/footer/youtube.svg",
  ];

  const footer = createStyledElement("footer", [
    "flex flex-col mt-[32px] mx-[32px]",
  ]);
  await appendChildrenSync(footer, [
    composeSnsRow(snsImages),
    composeEtcGrid(etcElements),
  ]);

  return footer;
};

const composeEtcGrid = async (etcElements: string[]) => {
  const composeEtcElement = (content: string): HTMLElement => {
    const etcElement = createStyledElement("a", [
      "flex flex-row w-full items-center justify-center h-[22px] text-[13px] text-[gray] no-underline",
    ]);
    etcElement.innerText = content;
    return etcElement;
  };

  const etcGrid = createStyledElement("div", ["grid grid-cols-4 text-[grey]"]);
  await appendChildrenSync(
    etcGrid,
    etcElements.map((e) => composeEtcElement(e)),
  );
  return etcGrid;
};

const composeSnsRow = async (snsImages: string[]) => {
  const composeSnsImgs = (imgSrc: string): HTMLElement => {
    const a = createStyledElement("a");
    const img = createStyledElement("img");
    img.src = imgSrc;
    a.appendChild(img);
    return a;
  };

  const snsRow = createStyledElement("div", [
    "flex flex-row h-[29px] items-center gap-[24px]",
  ]);
  await appendChildrenSync(
    snsRow,
    snsImages.map((s) => composeSnsImgs(s)),
  );

  return snsRow;
};
