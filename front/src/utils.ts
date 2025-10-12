type SelfOrArray<T> = T | T[];
type HtmlElemSrc =
  | SelfOrArray<HTMLElement>
  | (() => SelfOrArray<HTMLElement>)
  | (() => Promise<SelfOrArray<HTMLElement>>)
  | Promise<SelfOrArray<HTMLElement>>
  | HtmlElemSrc[];

export const createStyledElement = (
  type: string,
  classList: string[] = [],
): HTMLElement => {
  const elem = document.createElement(type);
  if (type == "a") elem.href = "#";
  if (type == "button") elem.onclick = () => {};
  elem.classList = classList;
  return elem;
};

const resolveChildSrc = async (
  childSrc: HtmlElemSrc,
): Promise<HTMLElement[]> => {
  if (childSrc instanceof Array) {
    let memo = [];
    for (const src of childSrc) {
      const resolution = await resolveChildSrc(src);
      memo.push(...resolution);
    }
    return memo;
  }
  if (childSrc instanceof Promise) {
    return resolveChildSrc(await childSrc);
  }
  if (typeof childSrc === "function") {
    const childRes = childSrc();
    if (childRes instanceof Promise) {
      return resolveChildSrc(await childRes);
    } else {
      return resolveChildSrc(childRes);
    }
  } else return [childSrc];
};
export const appendChildrenSync = async (
  parent: HTMLElement,
  children: HtmlElemSrc[],
) => {
  const newChildren = await resolveChildSrc(children);
  newChildren.forEach((c) => parent.appendChild(c));
};
