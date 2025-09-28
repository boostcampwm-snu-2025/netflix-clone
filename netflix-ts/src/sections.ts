import { getJSON } from './data';
import { hasFavorite, toggleFavorite } from './favorites';

export type Item = { id: string; name: string; thumb?: string };
export type Section = { sectionId: string; title: string; items: Item[] };

function cardHTML(item: Item) {
  const liked  = hasFavorite('like', item.id);
  const wished = hasFavorite('wish', item.id);
  return `
    <article class="card" data-id="${item.id}">
      <a href="#" aria-label="${item.name}">
        <img class="card__img" src="${item.thumb ?? ''}" alt="${item.name} 포스터"
             onerror="this.style.background='#444'; this.removeAttribute('src')"/>
      </a>
      <div class="card__actions" style="position:absolute;left:8px;bottom:8px;display:flex;gap:6px;">
        <button class="btn-like" aria-pressed="${liked}"  aria-label="좋아요">❤</button>
        <button class="btn-wish" aria-pressed="${wished}" aria-label="찜하기">★</button>
      </div>
    </article>`;
}

export async function renderSectionById(sectionId: string, jsonPath: string) {
  const h2 = document.getElementById(sectionId);
  if (!h2) return;
  const sectionEl = h2.closest('.section') as HTMLElement | null;
  const track = sectionEl?.querySelector('.carousel__track') as HTMLElement | null;
  if (!track) return;

  const data = await getJSON<Section>(jsonPath);
  track.innerHTML = data.items.map(cardHTML).join('');

  track.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const host = t.closest('.card') as HTMLElement | null;
    if (!host) return;
    const id = host.dataset.id!;

    if (t.closest('.btn-like')) {
      const on = toggleFavorite('like', id);
      host.querySelector('.btn-like')?.setAttribute('aria-pressed', String(on));
      (t.closest('.btn-like') as HTMLButtonElement | null)?.blur();
    }
    if (t.closest('.btn-wish')) {
      const on = toggleFavorite('wish', id);
      host.querySelector('.btn-wish')?.setAttribute('aria-pressed', String(on));
      (t.closest('.btn-wish') as HTMLButtonElement | null)?.blur();
    }
  });
}
