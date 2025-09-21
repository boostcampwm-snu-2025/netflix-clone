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
};

export const HEADER_NOTIFICATION = [
  {
    id: "notification-1",
    title: "은중과상연",
    contents: "9월 12일 공개",
    time: "오늘",
    unread: true,
  },
  {
    id: "notification-2",
    title: "넷플릭스 '신규 콘텐츠 가이드'",
    contents: "공개 예정작을 살펴보세요.",
    time: "4일",
    unread: false,
  },
  {
    id: "notification-3",
    title: "신규 콘텐츠",
    contents: "나는 생존자다",
    time: "3주 전",
    unread: true,
  },
  {
    id: "notification-4",
    title: "손맛이 다른 세계가 온다",
    contents: "《웬즈데이》 시즌 2 공개",
    time: "4주 전",
    unread: true,
  },
  {
    id: "notification-5",
    title: "신규 콘텐츠",
    contents: "에스콰이어: 변호사를 꿈꾸는 변호사들",
    time: "1개월",
    unread: true,
  },
  {
    id: "notification-6",
    title: "대한민국의 TOP 10 시리즈",
    contents: "인기 콘텐츠를 확인해 보세요.",
    time: "1개월",
    unread: true,
  },
];
