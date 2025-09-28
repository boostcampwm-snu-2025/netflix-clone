import "./index.css";

type Props = {
  children?: string;
}

export default function CardContainer({ children }: Props) {
  return `
  <li class="card-container">
    ${children}
    <div class="like">
      <button class="like-button" aria-label="like">
      </button>
    </div>
  </li>
`;
}
