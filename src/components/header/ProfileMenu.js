/**
 * @function ProfileMenu
 *
 * @returns {string}
 */
export function ProfileMenu() {
  return `
<div class="menu">
  <div class="topbar"></div>
  <ul class="profile-container">
    <li><a href="#">프로필 관리</a></li>
    <li><a href="#">계정</a></li>
    <li><a href="#">고객센터</a></li>
    <li><a href="#">로그아웃</a></li>
  </ul>
</div>
`.trim();
}
