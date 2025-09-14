import { ASSET_PATH } from "./asset.js";
import { ROUTE } from "./route.js";

export const HEADER_DATA = {
  logo: {
    src: ASSET_PATH.LOGO,
    alt: "Netflix Logo",
  },
  navItems: [
    { contents: "홈", href: ROUTE.HOME, active: true },
    { contents: "시리즈", href: ROUTE.SERIES },
    { contents: "영화", href: ROUTE.MOVIE },
    { contents: "개인", href: ROUTE.PERSONAL },
    { contents: "NEW! 오늘 대세 콘텐츠", href: ROUTE.TREND },
    { contents: "내가 찜한 리스트", href: ROUTE.WISH_LIST },
    { contents: "언어별로 찾아보기", href: ROUTE.LANGUAGE_SEARCH },
  ],
  headerIcons: [
    {
      type: "button",
      className: "header-icon-button",
      content: `<img src="${ASSET_PATH.SEARCH}" />`,
    },
    {
      type: "button",
      className: "header-icon-kids",
      content: "키즈",
    },
    {
      type: "button",
      className: "header-icon-notification",
      content: `<img src="${ASSET_PATH.NOTIFICATON}" /><span class="header-icon-notification-badge">10</span>`,
    },
    {
      type: "button",
      className: "header-icon-kids",
      content: `<img src="${ASSET_PATH.MY_PROFILE}" /><img src="${ASSET_PATH.ARROW.DOWN}" />`,
    },
  ],
};
