import { loadJsonData } from "../../js/core.js";
import { RankCard } from "./RankCard.js";
import { RegularCard } from "./RegularCard.js";

/**
 * @type {Promise<import("./RankCard.js").RankItem[]>}
 */
const top10SeriesPromise = loadJsonData("data/top10-series.json");
/**
 * @type {Promise<import("./RegularCard.js").Item[]>}
 */
const newContentsPromise = loadJsonData("data/new-contents.json");
/**
 * @type {Promise<import("./RankCard.js").RankItem[]>}
 */
const top10MoviesPromise = loadJsonData("data/top10-movies.json");

/**
 * @async
 * @function Categories
 *
 * @returns {Promise<string>}
 */
export async function Categories() {
  const [top10Series, newContents, top10Movies] = await Promise.all([
    top10SeriesPromise,
    newContentsPromise,
    top10MoviesPromise,
  ]);

  const createPageIndicators = (items) =>
    Array.from({ length: items.length - 4 }, () => "<span></span>").join("");

  return (
    `
<section class="categories">
  <section class="rank">
    <h2>오늘 대한민국의 TOP 10 시리즈</h2>
    <div class="page-indicator">
      ${createPageIndicators(top10Series)}
    </div>
    <div class="slider">
      <button class="left" aria-label="왼쪽으로 이동">
        <b><</b>
      </button>
      <ol>
        ${top10Series.map((item) => RankCard(item, "series")).join("\n          ")}
      </ol>
      <button class="right" aria-label="왼쪽으로 이동">
        <b>></b>
      </button>
    </div>
  </section>
  <section class="regular">
    <h2>넷플릭스에 새로 올라온 콘텐츠</h2>
    <div class="page-indicator">
      ${createPageIndicators(newContents)}
    </div>
    <div class="slider">
      <button class="left" aria-label="왼쪽으로 이동">
        <b><</b>
      </button>
      <ul>
        ${newContents.map((item) => RegularCard(item)).join("\n        ")}
      </ul>
      <button class="right" aria-label="왼쪽으로 이동">
        <b>></b>
      </button>
    </div>
  </section>
  <section class="rank">
    <h2>오늘 대한민국의 TOP 10 영화</h2>
    <div class="page-indicator">
      ${createPageIndicators(top10Movies)}
    </div>
    <div class="slider">
      <button class="left" aria-label="왼쪽으로 이동">
        <b><</b>
      </button>
      <ol>
        ${top10Movies.map((item) => RankCard(item, "movies")).join("\n        ")}
      </ol>
      <button class="right" aria-label="왼쪽으로 이동">
        <b>></b>
      </button>
    </div>
  </section>
</section>
`
  ).trim();
}
