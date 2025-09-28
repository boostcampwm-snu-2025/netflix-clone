// src/hero.ts
import { getJSON } from './data';

export type HeroData = {
  logo: string;
  rank: number;
  desc: string;
  bg?: string;
};

/** 히어로 섹션을 /data/hero.json 으로부터 채움 */
export async function renderHero(jsonPath = '/data/hero.json'): Promise<void> {
  const root = document.querySelector<HTMLElement>('.hero');
  if (!root) return; // 히어로가 없는 페이지면 무시

  // 데이터 로드
  const data = await getJSON<HeroData>(jsonPath);

  // 1) 배경 이미지(플래시 방지: 미리 로드 후 교체)
  if (data.bg) {
    await preloadImage(data.bg).catch(() => {});
    // 기존 CSS의 그라데이션을 유지한 채로 bg만 교체
    root.style.backgroundImage =
      `linear-gradient(to top, rgba(20,20,20,.9) 0%, rgba(20,20,20,.35) 40%, rgba(0,0,0,0) 100%), url("${data.bg}")`;
    root.style.backgroundPosition = 'center';
    root.style.backgroundSize = 'cover';
    root.style.backgroundRepeat = 'no-repeat';
  }

  // 2) 로고
  const logoImg = root.querySelector<HTMLImageElement>('.hero__logo img');
  if (logoImg && data.logo) {
    logoImg.src = data.logo;
    // alt는 기존 HTML에 정의되어 있으니 그대로 두되, 필요하면 아래처럼 업데이트 가능
    // logoImg.alt = '히어로 로고';
  }

  // 3) 랭크
  const rankStrong = root.querySelector<HTMLElement>('.hero__rank .rank-text strong');
  if (rankStrong && Number.isFinite(data.rank)) {
    rankStrong.textContent = String(data.rank);
  }

  // 4) 설명
  const descEl = root.querySelector<HTMLElement>('.hero__desc');
  if (descEl && data.desc) {
    descEl.textContent = data.desc;
  }
}

/** 이미지 미리 로드(선택) */
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}
