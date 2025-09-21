import { loadSvgElement } from "../../js/core.js";
import { NotificationsMenu } from "./NotificationsMenu.js";
import { ProfileMenu } from "./ProfileMenu.js";

const netflixLogo = loadSvgElement("assets/header/netflix-logo.svg");
const searchIcon = loadSvgElement("assets/header/search-icon.svg");
const notificationIcon = loadSvgElement("assets/header/notification-icon.svg");

/**
 * @async
 * @function Header
 *
 * @returns {Promise<string>}
 */
export async function Header() {
  const [logo, search, notification, notifications] = await Promise.all([
    netflixLogo,
    searchIcon,
    notificationIcon,
    NotificationsMenu(),
  ]);

  return `
<header>
  <nav class="navbar" aria-label="Main navigation">
    <div class="nav-left">
      <div class="logo">
        <a href="#">
          ${logo}
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
      <li>
        <a href="#">${search}</a>
      </li>
      <li class="notification">
        <a href="#">${notification}</a>
        ${notifications}
      </li>
      <li class="profile">
        <a href="#"><img src="assets/header/profile-icon.png" alt="User Profile" /></a>
        ${ProfileMenu()}
      </li>
    </ul>
  </nav>
</header>
`.trim();
}
