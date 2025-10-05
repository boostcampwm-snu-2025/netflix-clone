import './index.css';
import PageIndicator from './page-indicator';

type Props<T> = {
  itemRenderer: (item: T) => string;
  items: T[];
  pageSize: number;
};

export default function Carousel<T>({ itemRenderer, items, pageSize }: Props<T>) {
  return `
  <div class="carousel">
    ${PageIndicator({ pageSize, totalItems: items.length })}
    <div class="slider">
      <button class="left" aria-label="왼쪽으로 이동">
        <b><</b>
      </button>
      <ol>
        ${items.map(itemRenderer).join("")}
      </ol>
      <button class="right" aria-label="오른쪽으로 이동">
        <b>></b>
      </button>
    </div>
  </div>
  `;
}
