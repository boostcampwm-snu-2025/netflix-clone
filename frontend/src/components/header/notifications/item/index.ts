import './index.css';

type Props = {
  description: string;
  id: number;
  notifiedTime: Date;
  title: string;
}

export default function Item({ description, id, notifiedTime, title }: Props) {
  const img = `/assets/header/notifications/${id}.png`;
  return `
  <li class="notification-item">
    <a href="#">
      <img src="${img}" alt="${title}" />
    </a>
    <a href="#">
      <div>${title}</div>
      <div>${description}</div>
      <div>${age(notifiedTime)}</div>
    </a>
  </li>
`;
}

function age(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years}년 전`;
  if (months > 0) return `${months}달 전`;
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
}
