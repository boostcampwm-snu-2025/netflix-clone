import './index.css';

type Props = {
  children?: string;
}

export default function Menu({ children }: Props) {
  return `
  <div class="menu">
    <div class="topbar"></div>
    ${children ?? ''}
  </div>
  `;
}
