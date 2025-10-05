import './index.css';
import { loadJson } from '~/helpers/loadJson';

import Item from './item';

const notificationsPromise = loadJson<{
  description: string;
  id: number;
  notifiedTime: string;
  title: string;
}[]>("/api/notifications");

export default async function Notifications() {
  const notifications = await notificationsPromise;
  return `
  <ol class="notifications-container">
    ${notifications.map((item) => Item({ ...item, notifiedTime: new Date(item.notifiedTime) })).join("")}
  </ol>
`;
}
