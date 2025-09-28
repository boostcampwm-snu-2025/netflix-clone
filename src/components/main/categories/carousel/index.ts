import './index.css';
import PageIndicator from './page-indicator';

type Props<T> = {
  items: T[];
  itemRenderer: (item: T) => string;
  pageSize: number;
};

export default function Carousel<T>({ items, itemRenderer, pageSize }: Props<T>) {
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
