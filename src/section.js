import { createStyledElement } from "./utils.js";

export const renderSection = () => {
  const body = document.body;
  const data0 = [
    { src: "assets/section/section_1_1.webp" },
    { src: "assets/section/section_1_2.webp" },
    { src: "assets/section/section_1_3.webp" },
    { src: "assets/section/section_1_4.webp" },
    { src: "assets/section/section_1_5.webp" },
    { src: "assets/section/section_1_6.webp" },
    { src: "assets/section/section_2_1.webp" },
    { src: "assets/section/section_2_2.webp" },
    { src: "assets/section/section_2_3.webp" },
    { src: "assets/section/section_2_4.webp" },
    { src: "assets/section/section_2_5.webp" },
    { src: "assets/section/section_2_6.webp" },
  ];
  const carousel0 = composeCarousel("Sample0", data0, 5);
  const carousel1 = composeCarousel("Sample1", data0, 4);
  const carousel2 = composeCarousel("Sample2", data0, 6);
  body.appendChild(carousel0);
  body.appendChild(carousel1);
  body.appendChild(carousel2);
};
export const composeCarousel = (title, data, pageSize) => {
  let page = 0;
  const totalPages = Math.ceil(data.length / pageSize);
  const nextScrollQty = new Array(totalPages).fill(pageSize);
  nextScrollQty[nextScrollQty.length - 1] =
    data.length - pageSize * (totalPages - 1);
  const prevScrollQty = new Array(totalPages).fill(pageSize);
  prevScrollQty[prevScrollQty.length - 2] =
    data.length - pageSize * (totalPages - 1);

  const wrapper = createStyledElement("section", [
    "flex flex-col h-fit w-screen overflow-hidden relative mt-[16px]",
  ]);
  const upperRow = createStyledElement("div", [
    "flex flex-row justify-between mx-wrapper-wide h-[20px] items-center",
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
    "flex flex-row w-full overflow-hidden",
  ]);
  const imgWidth = (window.innerWidth - 120) / pageSize;
  const currData = [...data, ...data, ...data];
  currData.forEach(({ src }) => {
    const li = createStyledElement("li", ["flex shrink-0"]);
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
