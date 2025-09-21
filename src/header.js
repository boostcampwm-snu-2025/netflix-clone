import { createStyledElement } from "./utils.js";

export const renderHeader = () => {
  const body = document.body;
  const header = createStyledElement("header", [
    "bg-transparent duration-700 fixed top-0 w-screen h-header-narrow netflix:h-header-wide px-wrapper-wide flex flex-row items-center justify-between z-50",
  ]);
  const logo = composeLogo();
  const menu = composeMenu();
  const profileMenu = composeProfileMenu();
  header.appendChild(logo);
  header.appendChild(menu);
  header.appendChild(profileMenu);

  window.addEventListener("scroll", (e) => {
    if (window.scrollY <= 0) {
      header.style.backgroundColor = "transparent";
    } else {
      header.style.backgroundColor = "rgb(20,20,20)";
    }
  });

  body.appendChild(header);

  const shadowDiv = composeShadowDiv();
  body.appendChild(shadowDiv);
};

const composeShadowDiv = () => {
  const shadowDiv = createStyledElement("div", [
    "grid fixed top-0 w-screen h-header-narrow netflix:h-header-wide bg-linear-to-b from-base/100 to-base/0",
  ]);
  return shadowDiv;
};

const composeLogo = () => {
  const logo = document.createElement("a");
  logo.classList = ["w-[92.5px] h-[31px] p-2 cursor-pointer"];
  const logoImg = document.createElement("img");
  logoImg.classList = ["w-full h-full"];
  logoImg.src = "assets/header/logo.webp";
  logo.appendChild(logoImg);
  return logo;
};
const composeMenu = () => {
  const menuArr = [
    "홈",
    "시리즈",
    "영화",
    "게임",
    "NEW! 요즘 대세 콘텐츠",
    "내가 찜한 리스트",
    "언어별로 찾아보기",
  ];

  const navMenu = createStyledElement(
    "nav",
    "flex text-[1.2rem] flex-row flex-1 h-full items-center",
  );

  menuArr.forEach((m) => {
    const menuElem = createStyledElement(
      "a",
      m === "홈"
        ? ["duration-400 cursor-default text-white ml-nav"]
        : ["duration-400 text-[#e5e5e5] hover:text-[#b3b3b3] ml-nav"],
    );
    menuElem.innerText = m;
    navMenu.appendChild(menuElem);
  });

  return navMenu;
};
const composeProfileMenu = () => {
  const profileMenu = createStyledElement("nav", [
    "flex flex-row relative text-[1.2rem] gap-[12px] h-full items-center",
  ]);

  const searchA = createStyledElement("a");
  const searchImg = createStyledElement("img", ["w-[24px] h-[24px]"]);
  searchImg.src = "assets/header/search.svg";
  searchImg.alt = "Search Magnifying Glass Icon";
  searchA.appendChild(searchImg);
  profileMenu.appendChild(searchA);

  const kidsA = createStyledElement("a", ["text-white not-netflix:hidden"]);
  kidsA.innerText = "키즈";

  const notificationA = createStyledElement("a", ["w-[24px] h-[24px]"]);
  const notificationImg = createStyledElement("img");
  notificationImg.src = "assets/header/notification.svg";
  notificationImg.alt = "Notification Bell Icon";

  notificationA.appendChild(notificationImg);
  profileMenu.appendChild(notificationA);

  const profileA = createStyledElement("a");
  const profileImg = createStyledElement("img", [
    "w-[32px] h-[32px] rounded-[5px]",
  ]);
  profileImg.src = "assets/header/user_profile.webp";
  profileImg.alt = "User Profile Icon";
  profileA.appendChild(profileImg);
  profileMenu.appendChild(profileA);

  const profileDropdown = composeProfileDropdown();
  profileMenu.appendChild(profileDropdown);

  const notificationDropdown = composeNotificationDropdown();
  profileMenu.appendChild(notificationDropdown);

  let profileDropdownTimeoutCnt;
  let notificationTimeoutDropdownCnt;

  profileA.addEventListener("mouseover", () => {
    if (profileDropdownTimeoutCnt) clearTimeout(profileDropdownTimeoutCnt);
    notificationDropdown.style.visibility = "hidden";
    notificationDropdown.style.opacity = 0;
    profileDropdown.style.visibility = "";
    profileDropdown.style.opacity = 100;
  });
  profileA.addEventListener("mouseout", () => {
    if (profileDropdownTimeoutCnt) clearTimeout(profileDropdownTimeoutCnt);
    profileDropdownTimeoutCnt = setTimeout(() => {
      profileDropdown.style.visibility = "hidden";
      profileDropdown.style.opacity = 0;
    }, 300);
  });
  profileDropdown.addEventListener("mouseover", () => {
    if (profileDropdownTimeoutCnt) clearTimeout(profileDropdownTimeoutCnt);
    notificationDropdown.style.visibility = "hidden";
    notificationDropdown.style.opacity = 0;
    profileDropdown.style.visibility = "";
    profileDropdown.style.opacity = 100;
  });
  profileDropdown.addEventListener("mouseout", () => {
    if (profileDropdownTimeoutCnt) clearTimeout(profileDropdownTimeoutCnt);
    profileDropdownTimeoutCnt = setTimeout(() => {
      profileDropdown.style.visibility = "hidden";
      profileDropdown.style.opacity = 0;
    }, 300);
  });

  notificationA.addEventListener("mouseover", () => {
    if (notificationTimeoutDropdownCnt)
      clearTimeout(notificationTimeoutDropdownCnt);
    profileDropdown.style.visibility = "hidden";
    profileDropdown.style.opacity = 0;
    notificationDropdown.style.visibility = "";
    notificationDropdown.style.opacity = 100;
  });
  notificationA.addEventListener("mouseout", () => {
    if (notificationTimeoutDropdownCnt)
      clearTimeout(notificationTimeoutDropdownCnt);
    notificationTimeoutDropdownCnt = setTimeout(() => {
      notificationDropdown.style.visibility = "hidden";
      notificationDropdown.style.opacity = 0;
    }, 300);
  });
  notificationDropdown.addEventListener("mouseover", () => {
    if (notificationTimeoutDropdownCnt)
      clearTimeout(notificationTimeoutDropdownCnt);
    profileDropdown.style.visibility = "hidden";
    profileDropdown.style.opacity = 0;
    notificationDropdown.style.visibility = "";
    notificationDropdown.style.opacity = 100;
  });
  notificationDropdown.addEventListener("mouseout", () => {
    if (notificationTimeoutDropdownCnt)
      clearTimeout(notificationTimeoutDropdownCnt);
    notificationTimeoutDropdownCnt = setTimeout(() => {
      notificationDropdown.style.visibility = "hidden";
      notificationDropdown.style.opacity = 0;
    }, 300);
  });

  return profileMenu;
};
const composeProfileDropdown = () => {
  const profileDropdown = createStyledElement("ul", [
    "absolute flex flex-col top-[51px] right-0 w-[220px] h-[300px] bg-base/70 text-white",
  ]);
  profileDropdown.style.visibility = "hidden";
  const data = [
    "Kids",
    "프로필 관리",
    "프로필 이전",
    "계정",
    "고객센터",
    "넷플릭스에서 로그아웃",
  ];
  data.forEach((d) => {
    const row = composeProfileDropdownRow(d);
    profileDropdown.appendChild(row);
  });
  return profileDropdown;
};
const composeNotificationDropdown = () => {
  const notificationDropdown = createStyledElement("ul", [
    "absolute flex flex-col top-[51px] right-[38px] w-[408px] h-[570px] bg-base/70 text-white text-[9px]",
  ]);
  notificationDropdown.style.visibility = "hidden";
  const data = [
    {
      src: "assets/header/noti1.webp",
      detail: "넷플릭스 '신규 콘텐츠 가이드'\n공개 예정작을 살펴보세요.",
      date: "2주 전",
    },
    {
      src: "assets/header/noti2.webp",
      detail: "신규 콘텐츠\n폭군의 셰프",
      date: "3주 전",
    },
    {
      src: "assets/header/noti3.webp",
      detail: "대한민국의 TOP 10 시리즈\n인기 콘텐츠를 확인해 보세요.",
      date: "1개월",
    },
    {
      src: "assets/header/noti4.webp",
      detail: "신규 콘텐츠\n파이널 드래프트",
      date: "1개월",
    },
    {
      src: "assets/header/noti5.webp",
      detail: "<브람스를 좋아하세요?> 시청 완료!\n다음으로는 뭘 볼까요?",
      date: "1개월",
    },
    {
      src: "assets/header/noti6.webp",
      detail: "사카모토 데이즈\n새로운 에피소드 등록 알림",
      date: "1개월",
    },
  ];
  data.forEach(({ src, detail, date }) => {
    const row = composeNotificationRow(src, detail, date);
    notificationDropdown.appendChild(row);
  });

  return notificationDropdown;
};
const composeNotificationRow = (src, detail, date) => {
  const li = createStyledElement("li");
  const a = createStyledElement("a", [
    "flex flow-row h-[95px] w-[408px] bg-base/70 hover:bg-base/100",
  ]);
  const descriptionCol = createStyledElement("div", [
    "flex flex-col items-start justify-center h-[95px]",
  ]);
  const description = createStyledElement("p", ["text-[14px]"]);
  description.innerText = detail;
  const dateP = createStyledElement("p", ["text-gray-200"]);
  dateP.innerText = date;
  descriptionCol.appendChild(description);
  descriptionCol.appendChild(dateP);
  const imgSlot = createStyledElement("div", [
    "grid place-items-center h-[95px] w-[144px]",
  ]);
  const coverImg = createStyledElement("img", ["w-[122px] h-[63px]"]);
  coverImg.src = src;
  coverImg.alt = `${detail}의 커버 이미지`;
  imgSlot.appendChild(coverImg);
  a.appendChild(imgSlot);
  a.appendChild(descriptionCol);
  li.appendChild(a);
  return li;
};

const composeProfileDropdownRow = (title) => {
  const li = createStyledElement("li");
  const a = createStyledElement("a", [
    "flex flex-row h-[50px] px-[8px] w-full items-center justify-start hover:underline",
  ]);
  a.innerText = title;
  li.appendChild(a);
  return li;
};
