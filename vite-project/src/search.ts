// Grid results under the navbar (5 per row)
export type ImageItem = { name: string; path: string };

let CACHE: ImageItem[] | null = null;

const panel = () => {
  let el = document.getElementById("nav-search-results") as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = "nav-search-results";
    el.className = "search-results";
    document.querySelector(".navbar")?.after(el);
  }
  return el!;
};

const loadIndex = async (url: string) =>
  (CACHE ??= ((await (await fetch(url)).json()).images ?? []) as ImageItem[]);

export function initNavSearch(dataUrl: string, formId = "nav-search-form", inputId = "nav-search-input") {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  if (!form || !input) return;

  const p = panel();
  form.addEventListener("submit", e => e.preventDefault());

  input.addEventListener("input", async () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { p.innerHTML = ""; return; }
    const list = await loadIndex(dataUrl);
    const items = list.filter(it => it.name.toLowerCase().includes(q));

    p.innerHTML = items.length
      ? `<div class="results-grid">${
          items.map(it => `
            <a class="card" href="${it.path}" target="_blank" rel="noopener">
              <img src="${it.path}" alt="${it.name}" />
              <span class="name">${it.name}</span>
            </a>
          `).join("")
        }</div>`
      : `<div class="empty">No matches</div>`;
  });
}
