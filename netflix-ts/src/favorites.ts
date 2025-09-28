// src/favorites.ts
export type ToggleKind = 'like' | 'wish';

const mem = { like: new Set<string>(), wish: new Set<string>() };
const KEY = 'netflix-ts/session';

function save() {
  try { sessionStorage.setItem(KEY, JSON.stringify({ like: [...mem.like], wish: [...mem.wish] })); } catch {}
}

export function initFavorites(): void {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return;
    const obj = JSON.parse(raw) as { like?: string[]; wish?: string[] };
    if (Array.isArray(obj.like)) obj.like.forEach((id) => mem.like.add(id));
    if (Array.isArray(obj.wish)) obj.wish.forEach((id) => mem.wish.add(id));
  } catch {}
}

export function hasFavorite(kind: ToggleKind, id: string): boolean {
  return mem[kind].has(id);
}

export function toggleFavorite(kind: ToggleKind, id: string): boolean {
  const s = mem[kind];
  s.has(id) ? s.delete(id) : s.add(id);
  save();
  return s.has(id);
}

export function clearFavorites(): void {
  mem.like.clear(); mem.wish.clear();
  try { sessionStorage.removeItem(KEY); } catch {}
}
