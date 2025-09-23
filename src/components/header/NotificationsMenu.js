import { loadJsonData } from "../../js/core.js";
import { NotificationItem } from "./NotificationItem.js";

/**
 * @type {Promise<import("./NotificationItem.js").Item[]>}
 */
const notificationsPromise = loadJsonData("data/notifications.json");

/**
 * @async
 * @function NotificationsMenu
 *
 * @returns {Promise<string>}
 */
export async function NotificationsMenu() {
  const notifications = await notificationsPromise;

  return `
<div class="menu">
  <div class="topbar"></div>
  <ul class="notifications-container">
    ${notifications.map((item) => NotificationItem(item)).join("")}
  </ul>
</div>
`.trim();
}
