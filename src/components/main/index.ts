import "./index.css";
import Categories from "./categories";
import Hero from "./hero";

export default async function Main() {
  const categories = await Categories();
  return `
<main class="main">
  ${Hero()}
  ${categories}
</main>
`.trim();
}
