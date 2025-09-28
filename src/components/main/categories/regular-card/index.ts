import "./index.css";

export type Item = {
  id: number;
  title: string;
}

type Prop = {
  item: Item;
};

export default function RegularCard({ item }: Prop) {
  return `
  <a class="regular-card" href="#">
    <img class="item" src="assets/main/new/${item.id}.png" alt="${item.title}">
  </a>
`;
}
