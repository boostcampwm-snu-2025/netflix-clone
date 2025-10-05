import "./index.css";
import Menu from "./menu";
import Notifications from "./notifications";
import Profile from "./profile";

import netflixLogo from "/assets/header/netflix-logo.svg?raw";
import notificationIcon from "/assets/header/notification-icon.svg?raw";
import profileIcon from "/assets/header/profile-icon.png";
import searchIcon from "/assets/header/search-icon.svg?raw";

export default async function Header() {
  const notifications = await Notifications();

  return `
  <header>
    <nav class="navbar" aria-label="Main navigation">
      <div class="nav-left">
        <div class="logo">
          <a href="#">
            ${netflixLogo}
          </a>
        </div>
        <ul class="nav-tabs">
          <li><a class="current" href="#">홈</a></li>
          <li><a href="#">시리즈</a></li>
          <li><a href="#">영화</a></li>
          <li><a href="#">게임</a></li>
          <li><a href="#">내가 찜한 리스트</a></li>
          <li><a href="#">언어별로 찾아보기</a></li>
        </ul>
      </div>
      <ul class="nav-right">
        <li class="search-container">
          <a href="#">${searchIcon}</a>
          <form>
            <input
              class="search-input"
              type="text"
              placeholder="제목, 인물, 장르 검색"
              list="search-datalist"
              autocomplete="on"
              name="search-input"
            />
          </form>
          <datalist id="search-datalist"></datalist>
        </li>
        <li class="modal-container">
          <a href="#">${notificationIcon}</a>
          ${Menu({ children: notifications })}
        </li>
        <li class="modal-container">
          <a href="#"><img src="${profileIcon}" alt="User Profile" /></a>
          ${Menu({ children: Profile() })}
        </li>
      </ul>
    </nav>
  </header>
`;
}
