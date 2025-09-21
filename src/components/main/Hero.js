import { loadSvgElement } from "../../js/core.js";

const playIcon = loadSvgElement("assets/main/play.svg");
const infoIcon = loadSvgElement("assets/main/info.svg");

/**
 * @async
 * @function Hero
 *
 * @returns {Promise<string>}
 */
export async function Hero() {
  const [play, info] = await Promise.all([playIcon, infoIcon]);

  return `
<section class="hero">
  <div class="background"></div>
  <div class="trailer-vignette"></div>
  <div class="hero-vignette"></div>
  <div class="meta">
    <img src="assets/main/billboard-title.png" alt="나의 아저씨" />
    <div>
      백상예술대상을 수상한 드라마 시리즈. 케이팝 슈퍼스타 아이유와 배우 이선균(《커피프린스 1호점》)이 불친절한 세상 속에서 뜻밖의 우정을 나누는 사이로 출연한다.
    </div>
    <div class="buttons">
      <button class="play-button">
        ${play}
        재생
      </button>
      <button class="more-info-button">
        ${info}
        상세 정보
      </button>
    </div>
  </div>
</section>
`.trim();
}
