import './index.css';

type Props = {
  pageSize: number;
  totalItems: number;
}

export default function PageIndicator({ pageSize, totalItems }: Props) {
  return `
  <div class="page-indicator">
    ${Array.from({ length: Math.ceil(totalItems / pageSize) }, () => "<span></span>").join("")}
  </div>
`
}
