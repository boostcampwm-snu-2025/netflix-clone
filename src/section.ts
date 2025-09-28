import { createStyledElement } from "./utils";

export const composeSections = async (): Promise<HTMLElement[]> => {
  const sectionDataSrcs = [
    "/data/section_1.json",
    "/data/section_2.json",
    "/data/section_3.json",
  ];
  const sectionDataResArr = await Promise.all(
    sectionDataSrcs.map((src) => fetch(src)),
  );
  const sectionDataArr = await Promise.all(
    sectionDataResArr.map((r) => r.json()),
  );
  const hoverDiv = createStyledElement("div", ["flex flex-col absolute z-50"]);

  hoverDiv.addEventListener("mouseleave", () => {
    hoverDiv.style.visibility = "hidden";
  });
  const hoverImg = createStyledElement("img", ["w-full"]);
  const hoverInfo = createStyledElement("div", [
    "flex flex-row h-20 p-4 gap-4 bg-gray-700",
  ]);
  const likeBtn = createStyledElement("button", ["h-9 w-9 cursor-pointer"]);
  const likeBtnImg = createStyledElement("img", ["w-full h-full"]);
  const wishListBtn = createStyledElement("button", ["h-9 w-9 cursor-pointer"]);
  const wishListBtnImg = createStyledElement("img", ["w-full h-full"]);
  likeBtn.appendChild(likeBtnImg);
  wishListBtn.appendChild(wishListBtnImg);

  hoverDiv.appendChild(hoverImg);

  hoverInfo.appendChild(likeBtn);
  hoverInfo.appendChild(wishListBtn);

  hoverDiv.appendChild(hoverInfo);
  hoverDiv.style.visibility = "hidden";
  document.body.appendChild(hoverDiv);
  const sections = sectionDataArr.map((sectionData) => {
    return composeCarousel(
      sectionData.title,
      sectionData.data,
      sectionData.pageSize,
      hoverDiv,
    );
  });
  return sections;
};
export const composeCarousel = (
  title: string,
  data: string,
  pageSize: number,
  hoverDiv: HTMLElement,
): HTMLElement => {
  let page = 0;
  const totalPages = Math.ceil(data.length / pageSize);
  const nextScrollQty = new Array(totalPages).fill(pageSize);
  nextScrollQty[nextScrollQty.length - 1] =
    data.length - pageSize * (totalPages - 1);
  const prevScrollQty = new Array(totalPages).fill(pageSize);
  prevScrollQty[prevScrollQty.length - 2] =
    data.length - pageSize * (totalPages - 1);

  const wrapper = createStyledElement("section", [
    "flex flex-col h-fit w-screen bg-transparent z-10 overflow-hidden relative mt-[16px]",
  ]);
  const upperRow = createStyledElement("div", [
    "flex flex-row justify-between bg-transparent z-10 mx-wrapper-wide h-[20px] items-center",
  ]);
  const paginationBar = createStyledElement("div", [
    "flex flex-row w-[200px] relative h-[2px] bg-gray-500",
  ]);
  const paginationIndicator = createStyledElement("div", [
    "flex flex-row absolute left-0 h-[2px] bg-white duration-500",
  ]);
  paginationIndicator.style.width = `${100 / totalPages}%`;
  paginationBar.appendChild(paginationIndicator);
  const titleH3 = createStyledElement("h3", ["text-white text-2xl h-[20px]"]);
  titleH3.innerText = title;
  upperRow.appendChild(titleH3);
  upperRow.appendChild(paginationBar);
  const carousel = createStyledElement("ul", [
    "flex flex-row w-full overflow-hidden relative z-10 will-change-transform",
  ]);
  const imgWidth = (window.innerWidth - 120) / pageSize;
  const currData = [...data, ...data, ...data];
  currData.forEach(({ src, id, href }) => {
    const li = createStyledElement("li", ["flex shrink-0"]);
    li.addEventListener("mouseenter", (e) => {
      const rects = li.getClientRects()[0];
      const width = rects.width;
      const height = rects.height;
      const left = rects.left;
      const top = rects.top + window.scrollY;
      const imgElem = hoverDiv.children[0];
      const prevLikeBtn = hoverDiv.children[1].children[0];
      const newLikeBtn = prevLikeBtn.cloneNode(true);
      prevLikeBtn.parentNode?.replaceChild(newLikeBtn, prevLikeBtn);
      const newLikeBtnImg = newLikeBtn.children[0];

      const prevWishListBtn = hoverDiv.children[1].children[1];
      const newWishListBtn = prevWishListBtn.cloneNode(true);
      prevWishListBtn.parentNode?.replaceChild(newWishListBtn, prevWishListBtn);
      const newWishListBtnImg = newWishListBtn.children[0];

      const isInWishList = window.localStorage.getItem(`wish_${id}`);
      newWishListBtnImg.src = isInWishList
        ? "/section/check.svg"
        : "/section/plus.svg";
      newWishListBtn.addEventListener("click", () => {
        const wishId = `wish_${id}`;
        const isInWishList = window.localStorage.getItem(wishId);
        if (isInWishList) {
          window.localStorage.removeItem(wishId);
          newWishListBtnImg.src = "/section/plus.svg";
        } else {
          window.localStorage.setItem(wishId, "1");
          newWishListBtnImg.src = "/section/check.svg";
        }
      });

      const isLiked = window.localStorage.getItem(id);
      newLikeBtnImg.src = isLiked
        ? "/section/thumb_filled.svg"
        : "/section/thumb.svg";
      newLikeBtn.addEventListener("click", () => {
        const isLiked = window.localStorage.getItem(id);
        if (isLiked) {
          window.localStorage.removeItem(id);
          newLikeBtnImg.src = "/section/thumb.svg";
        } else {
          window.localStorage.setItem(id, "1");
          newLikeBtnImg.src = "/section/thumb_filled.svg";
        }
      });

      imgElem.src = src;
      hoverDiv.style.width = `${width * 1.2}px`;
      hoverDiv.style.height = `${height * 1.2}px`;
      hoverDiv.style.left = `${left - width * 0.1}px`;
      hoverDiv.style.top = `${top - height * 0.1}px`;
      hoverDiv.style.visibility = "visible";
    });
    li.style.width = imgWidth + "px";
    const img = createStyledElement("img", ["w-full"]);
    img.src = src;
    img.alt = "Work thumbnail";
    li.appendChild(img);
    carousel.appendChild(li);
  });
  carousel.style.width = imgWidth * data.length * 2 + "px";
  const initialOffset = imgWidth * data.length - 60;
  carousel.style.transform = `translate(-${initialOffset}px,0px)`;

  const prevBtn = createStyledElement("button", [
    "h-[calc(100%-20px)] w-[60px] absolute left-0 bg-gray-700/70 text-white text-3xl top-[20px] z-50",
  ]);
  prevBtn.innerText = "<";
  const nextBtn = createStyledElement("button", [
    "h-[calc(100%-20px)] w-[60px] absolute z-50 bg-gray-700/70 text-white text-3xl top-[20px] right-0",
  ]);
  nextBtn.innerText = ">";
  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);

  window.addEventListener("resize", (e) => {
    const imgWidth = (window.innerWidth - 120) / pageSize;
    const initalOffset = imgWidth - 60;
    carousel.style.transform = `translate(-${initalOffset}px,0px)`;
    carousel.childNodes.forEach((child) => {
      child.style.width = imgWidth + "px";
    });
  });

  const nextPage = () => {
    page = (page + 1) % totalPages;
    const imgWidth = (window.innerWidth - 120) / pageSize;
    const scrollAmount = imgWidth * nextScrollQty[page];
    console.log(scrollAmount, carousel.scrollLeft, carousel.scrollWidth);
    if (scrollAmount + carousel.scrollLeft >= imgWidth * data.length) {
      console.log("appended");
      data.forEach(({ src }) => {
        const li = createStyledElement("li", ["flex shrink-0"]);
        li.style.width = imgWidth + "px";
        const img = createStyledElement("img", ["w-full"]);
        img.src = src;
        img.alt = "Work thumbnail";
        li.appendChild(img);
        carousel.appendChild(li);
      });
    }
    carousel.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
    paginationIndicator.style.transform = `translate(${(200 / totalPages) * page}px,0px)`;
  };
  nextBtn.onclick = nextPage;
  const prevPage = () => {
    page = (page + totalPages - 1) % totalPages;
    const imgWidth = (window.innerWidth - 120) / pageSize;
    const scrollAmount = -imgWidth * prevScrollQty[page];
    if (carousel.scrollLeft + scrollAmount < 0) {
      data.toReversed().forEach(({ src }) => {
        const li = createStyledElement("li", ["flex shrink-0"]);
        li.style.width = imgWidth + "px";
        const img = createStyledElement("img", ["w-full"]);
        img.src = src;
        img.alt = "Work thumbnail";
        li.appendChild(img);
        carousel.prepend(li);
      });
      carousel.scrollBy({ left: imgWidth * data.length });
    }
    carousel.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
    paginationIndicator.style.transform = `translate(${(200 / totalPages) * page}px,0px)`;
  };
  prevBtn.onclick = prevPage;

  wrapper.appendChild(upperRow);
  wrapper.appendChild(carousel);
  return wrapper;
};
