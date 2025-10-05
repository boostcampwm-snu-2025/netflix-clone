import { debounce } from "~/helpers/debounce";
import { loadJson } from "~/helpers/loadJson";

export default function handleSearch(searchContainer: Element) {
  const input = searchContainer.querySelector<HTMLInputElement>("input.search-input")!;

  searchContainer.addEventListener("click", () => {
    searchContainer.classList.add("active");
    input.focus();
  });
  input.addEventListener("focusout", () => {
    searchContainer.classList.remove("active");
  });

  const dataList = searchContainer.querySelector<HTMLDataListElement>("datalist#search-datalist")!;
  const search = debounce((query: string) => {
    loadJson<{ items: string[] }>("/api/search?q=" + encodeURIComponent(query))
      .then(data => {
        if (!query)
          dataList.innerHTML = "";
        else
          dataList.innerHTML = data.items.map(
            (item: string) => `<option value="${item}"></option>`
          ).join("");
      });
  });

  input.addEventListener("input", () => {
    search(input.value);
  });
}