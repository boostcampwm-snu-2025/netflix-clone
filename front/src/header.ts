import { appendChildrenSync, createStyledElement } from "./utils";

export const composeHeader = async (): Promise<HTMLElement[]> => {
  const header = createStyledElement("header", [
    "bg-transparent duration-700 fixed top-0 w-screen h-header-narrow netflix:h-header-wide px-wrapper-wide flex flex-row items-center justify-between z-[60]",
  ]);
  await appendChildrenSync(header, [
    composeLogo,
    composeMenu,
    composeProfileMenu,
  ]);
  changeBgOnScroll(header);

  const shadowDiv = composeShadowDiv();
  return [header, shadowDiv];
};

const changeBgOnScroll = (elem: HTMLElement) => {
  window.addEventListener("scroll", () => {
    if (window.scrollY <= 0) {
      elem.style.backgroundColor = "transparent";
    } else {
      elem.style.backgroundColor = "rgb(20,20,20)";
    }
  });
};

const composeShadowDiv = (): HTMLDivElement => {
  const shadowDiv = createStyledElement("div", [
    "grid fixed top-0 w-screen h-header-narrow netflix:h-header-wide bg-linear-to-b from-base/100 to-base/0",
  ]);
  return shadowDiv;
};

const composeLogo = (): HTMLElement => {
  const logo = document.createElement("a");
  logo.classList = ["w-[92.5px] h-[31px] p-2 cursor-pointer"];
  const logoImg = document.createElement("img");
  logoImg.classList = ["w-full h-full"];
  logoImg.src = "/header/logo.webp";
  logo.appendChild(logoImg);
  return logo;
};
const composeMenu = (): HTMLElement => {
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
const composeProfileMenu = async (): Promise<HTMLElement> => {
  const profileMenu = createStyledElement("nav", [
    "flex flex-row relative text-[1.2rem] gap-[12px] h-full items-center",
  ]);

  const searchBtn = createStyledElement("button", [
    "flex flex-row place-items-center h-[32px] p-[4px] gap-[4px] min-w-[24px] cursor-pointer relative",
  ]);
  const searchImg = createStyledElement("img", ["w-[24px] h-[24px]"]);
  const searchInput = createStyledElement("input", [
    "h-[24px] transition-[width] transition-500 outline-none caret-white text-white",
  ]);
  const searchCancelBtn = createStyledElement("button", [
    "w-[24px] h-[24px] text-white text-2xl cursor-pointer hidden",
  ]);
  const searchHistoryDiv = createStyledElement("div", [
    "flex flex-col absolute top-[32px] right-0 w-[96px] bg-base hidden z-[70]",
  ]);
  const renderSearchHistory = () => {
    searchHistoryDiv.replaceChildren();
    const savedHistory = localStorage.getItem("history");
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    history.forEach((h) => {
      const btn = createStyledElement("button", [
        "w-full h-[24px] text-white text-start px-[8px]",
      ]);
      btn.innerText = h;
      btn.addEventListener("click", () => {
        searchInput.value = h;
        searchInput.dispatchEvent(
          new Event("input", { bubbles: true, composed: true }),
        );
      });
      btn.addEventListener("mouseenter", () => {
        searchInput.placeholder = h;
      });
      btn.addEventListener("mouseleave", () => {
        searchInput.placeholder = "";
      });
      searchHistoryDiv.appendChild(btn);
    });
  };
  renderSearchHistory();

  searchCancelBtn.innerText = "X";
  searchInput.style.width = "0px";
  searchImg.src = "/header/search.svg";
  searchImg.alt = "Search Magnifying Glass Icon";
  searchBtn.appendChild(searchImg);
  searchBtn.appendChild(searchInput);
  searchBtn.appendChild(searchCancelBtn);
  searchBtn.appendChild(searchHistoryDiv);
  profileMenu.appendChild(searchBtn);

  let isActivated = false;

  const activateSearchBar = () => {
    isActivated = true;
    Object.assign(searchBtn.style, {
      border: "1px solid white",
      backgroundColor: "black",
    });
    searchBtn.disabled = true;
    searchCancelBtn.style.display = "block";
    searchInput.style.width = "96px";
    searchInput.focus();
    searchHistoryDiv.style.display = "block";
  };
  searchBtn.addEventListener("click", activateSearchBar);

  const deactivateSearchBar = (e) => {
    e.stopPropagation();
    isActivated = false;
    Object.assign(searchBtn.style, {
      border: "none",
      backgroundColor: "transparent",
    });
    searchBtn.disabled = false;
    searchInput.style.width = "0px";
    searchInput.value = "";
    searchCancelBtn.style.display = "none";
    const prevSearchDiv = document.getElementById("searchRes");
    if (prevSearchDiv) prevSearchDiv.remove();
    searchHistoryDiv.style.display = "none";
  };
  searchCancelBtn.addEventListener("click", deactivateSearchBar);

  let timerMemo = undefined;
  const syncSearchHistory = (newSearch: string) => {
    const storedHistory = localStorage.getItem("history");
    const prev = storedHistory ? JSON.parse(storedHistory) : [];
    const newHistory = [
      newSearch,
      ...prev.filter((x) => x !== newSearch),
    ].slice(0, 5);
    localStorage.setItem("history", JSON.stringify(newHistory));
  };
  const search = async (param: string) => {
    syncSearchHistory(param);
    renderSearchHistory();
    const res = await fetch(
      `http://localhost:3001/api/search?search=${encodeURIComponent(param)}`,
    );
    const data = await res.json();
    if (!isActivated) return;
    const prevSearchDiv = document.getElementById("searchRes");
    const newSearchDiv =
      prevSearchDiv ??
      createStyledElement("div", [
        "grid grid-cols-3 auto-rows-min pt-[50px] px-[50px] gap-4 w-screen h-full absolute top-0 bg-base z-50",
      ]);

    newSearchDiv.replaceChildren([]);

    newSearchDiv.id = "searchRes";
    for (const datum of data) {
      const { href, id, src } = datum;
      const a = createStyledElement("a", ["flex flex-col min-h-0 w-full"]);
      const img = createStyledElement("img", ["w-full"]);
      img.src = src;
      a.appendChild(img);
      newSearchDiv.appendChild(a);
    }
    document.body.appendChild(newSearchDiv);
  };
  searchInput.addEventListener("input", async (e) => {
    if (timerMemo) clearTimeout(timerMemo);
    const searchKeyword = e.target.value.trim();
    if (searchKeyword.length)
      timerMemo = setTimeout(() => {
        search(searchKeyword);
      }, 500);
  });

  const kidsA = createStyledElement("a", ["text-white not-netflix:hidden"]);
  kidsA.innerText = "키즈";

  const notificationA = createStyledElement("a", ["w-[24px] h-[24px]"]);
  const notificationImg = createStyledElement("img");
  notificationImg.src = "/header/notification.svg";
  notificationImg.alt = "Notification Bell Icon";

  notificationA.appendChild(notificationImg);
  profileMenu.appendChild(notificationA);

  const profileA = createStyledElement("a");
  const profileImg = createStyledElement("img", [
    "w-[32px] h-[32px] rounded-[5px]",
  ]);
  profileImg.src = "/header/user_profile.webp";
  profileImg.alt = "User Profile Icon";
  profileA.appendChild(profileImg);
  profileMenu.appendChild(profileA);

  const profileDropdown = await composeProfileDropdown();
  profileMenu.appendChild(profileDropdown);

  const notificationDropdown = await composeNotificationDropdown();
  profileMenu.appendChild(notificationDropdown);

  let profileDropdownTimeoutCnt;
  let notificationTimeoutDropdownCnt;

  profileA.addEventListener("mouseover", () => {
    if (profileDropdownTimeoutCnt) clearTimeout(profileDropdownTimeoutCnt);
    Object.assign(notificationDropdown.style, {
      visibility: "hidden",
      opacity: 0,
    });
    Object.assign(profileDropdown.style, {
      visibility: "",
      opacity: 100,
    });
  });
  profileA.addEventListener("mouseout", () => {
    if (profileDropdownTimeoutCnt) clearTimeout(profileDropdownTimeoutCnt);
    profileDropdownTimeoutCnt = setTimeout(() => {
      Object.assign(profileDropdown.style, {
        visibility: "hidden",
        opacity: 0,
      });
    }, 300);
  });
  profileDropdown.addEventListener("mouseover", () => {
    if (profileDropdownTimeoutCnt) clearTimeout(profileDropdownTimeoutCnt);
    Object.assign(notificationDropdown.style, {
      visibility: "hidden",
      opacity: 0,
    });
    Object.assign(profileDropdown.style, { visibility: "", opacity: 100 });
  });
  profileDropdown.addEventListener("mouseout", () => {
    if (profileDropdownTimeoutCnt) clearTimeout(profileDropdownTimeoutCnt);
    profileDropdownTimeoutCnt = setTimeout(() => {
      Object.assign(profileDropdown.style, {
        visibility: "hidden",
        opacity: 0,
      });
    }, 300);
  });

  notificationA.addEventListener("mouseover", () => {
    if (notificationTimeoutDropdownCnt)
      clearTimeout(notificationTimeoutDropdownCnt);
    Object.assign(profileDropdown.style, { visibility: "hidden", opacity: 0 });
    Object.assign(notificationDropdown.style, { visibility: "", opacity: 100 });
  });
  notificationA.addEventListener("mouseout", () => {
    if (notificationTimeoutDropdownCnt)
      clearTimeout(notificationTimeoutDropdownCnt);
    notificationTimeoutDropdownCnt = setTimeout(() => {
      Object.assign(notificationDropdown.style, {
        visibility: "hidden",
        opacity: 0,
      });
    }, 300);
  });
  notificationDropdown.addEventListener("mouseover", () => {
    if (notificationTimeoutDropdownCnt)
      clearTimeout(notificationTimeoutDropdownCnt);
    Object.assign(profileDropdown.style, { visibility: "hidden", opacity: 0 });
    Object.assign(notificationDropdown.style, { visibility: "", opacity: 100 });
  });
  notificationDropdown.addEventListener("mouseout", () => {
    if (notificationTimeoutDropdownCnt)
      clearTimeout(notificationTimeoutDropdownCnt);
    notificationTimeoutDropdownCnt = setTimeout(() => {
      Object.assign(notificationDropdown.style, {
        visibility: "hidden",
        opacity: 0,
      });
    }, 300);
  });

  return profileMenu;
};
const composeProfileDropdown = async (): Promise<HTMLElement> => {
  const composeProfileDropdownRow = (title: string): HTMLElement => {
    const li = createStyledElement("li");
    const a = createStyledElement("a", [
      "flex flex-row h-[50px] px-[8px] w-full items-center justify-start hover:underline",
    ]);
    a.innerText = title;
    li.appendChild(a);
    return li;
  };

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
  await appendChildrenSync(
    profileDropdown,
    data.map((d) => composeProfileDropdownRow(d)),
  );
  return profileDropdown;
};
const composeNotificationDropdown = async (): Promise<HTMLElement> => {
  const composeNotificationRow = (
    src: string,
    detail: string,
    date: string,
  ): HTMLElement => {
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

  const notiFetchReq = await fetch("/data/notifications.json", {
    method: "GET",
  });
  const data = await notiFetchReq.json();
  const notificationDropdown = createStyledElement("ul", [
    "absolute flex flex-col top-[51px] right-[38px] w-[408px] h-[570px] bg-base/70 text-white text-[9px]",
  ]);
  notificationDropdown.style.visibility = "hidden";
  await appendChildrenSync(
    notificationDropdown,
    data.map(({ src, detail, date }) =>
      composeNotificationRow(src, detail, date),
    ),
  );

  return notificationDropdown;
};
