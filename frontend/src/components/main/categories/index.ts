import "./index.css";
import { loadJson } from '~/helpers/loadJson';

import CardContainer from "./card-container";
import Carousel from "./carousel";
import RankCard, { type RankItem } from './rank-card';
import RegularCard, { type Item } from './regular-card';


const top10SeriesPromise = loadJson<RankItem[]>("/api/top10-series");
const newContentsPromise = loadJson<Item[]>("/api/new-contents");
const top10MoviesPromise = loadJson<RankItem[]>("/api/top10-movies");

export default async function Categories() {
  const [top10Series, newContents, top10Movies] = await Promise.all([
    top10SeriesPromise,
    newContentsPromise,
    top10MoviesPromise,
  ]);

  return `
  <section class="categories">
    <section class="rank">
      <h2>오늘 대한민국의 TOP 10 시리즈</h2>
      ${Carousel({
        itemRenderer: (item) => CardContainer({ children: RankCard({ item, type: "series" }) }),
        items: top10Series,
        pageSize: 5,
      })}
    </section>
    <section class="regular">
      <h2>넷플릭스에 새로 올라온 콘텐츠</h2>
      ${Carousel({
        itemRenderer: (item) => CardContainer({ children: RegularCard({ item }) }),
        items: newContents,
        pageSize: 5,
      })}
    </section>
    <section class="rank">
      <h2>오늘 대한민국의 TOP 10 영화</h2>
      ${Carousel({
        itemRenderer: (item) => CardContainer({ children: RankCard({ item, type: "movies" }) }),
        items: top10Movies,
        pageSize: 5,
      })}
    </section>
  </section>
`
}
