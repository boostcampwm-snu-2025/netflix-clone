import { composeFooter } from "./footer";
import { composeHeader } from "./header";
import { composeHero } from "./hero";
import { composeSections } from "./section";
import { appendChildrenSync } from "./utils";

const body = document.body;
await appendChildrenSync(body, [
  composeHeader,
  composeHero,
  composeSections,
  composeFooter,
]);
