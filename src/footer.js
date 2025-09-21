import { createStyledElement } from "./utils.js";

export const renderFooter = () => {
  const body = document.body;

  const footer = createStyledElement("footer", [
    "flex flex-col mt-[32px] mx-[32px]",
  ]);
  const snsRow = createStyledElement("div", [
    "flex flex-row h-[29px] items-center gap-[24px]",
  ]);

  const snsImages = [
    "assets/footer/facebook.svg",
    "assets/footer/instagram.svg",
    "assets/footer/twitter.svg",
    "assets/footer/youtube.svg",
  ];

  snsImages.forEach((imgSrc) => {
    const a = createStyledElement("a");
    const img = createStyledElement("img");
    img.src = imgSrc;
    a.appendChild(img);
    snsRow.appendChild(a);
  });

  const etcGrid = createStyledElement("div", ["grid grid-cols-4 text-[grey]"]);

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

  etcElements.forEach((elem) => {
    const etcElement = createStyledElement("a", [
      "flex flex-row w-full items-center justify-center h-[22px] text-[13px] text-[gray] no-underline",
    ]);
    etcElement.innerText = elem;
    etcGrid.appendChild(etcElement);
  });
  footer.appendChild(snsRow);
  footer.appendChild(etcGrid);

  body.appendChild(footer);
};
