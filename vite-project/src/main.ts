// src/main.ts
import { initNavSearch } from "./search";

function navbar() {
  const nav = document.createElement("nav");
  nav.className = "navbar";
  nav.innerHTML = `
<img class="logo" src="/images/logo.png" alt="logo" />
<div class="links">
  <a href="#">Home</a><a href="#">Series</a><a href="#">Films</a>
  <a href="#">New & Popular</a><a href="#">My List</a>
</div>
<div class="spacer"></div>
<div class="search">
  <form role="search" aria-label="Site" id="nav-search-form">
    <input type="search" id="nav-search-input" name="q" placeholder="Search" autocomplete="off"/>
    <button type="submit" aria-label="Search">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0-2a8 8 0 1 0 4.9 14.3l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0 0 10 2Z"/></svg>
    </button>
  </form>
</div>
<img class="avatar" src="/images/avatar.png" alt="avatar" />`;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) nav.classList.add("scrolled"); else nav.classList.remove("scrolled");
  });
  return nav;
}

function mount() {
  const app = document.getElementById("app");
  if (!app) return;
  app.appendChild(navbar());
  initNavSearch("http://localhost:3001/api/images-index"); // or "/images.json"
}

mount();
