export const SECTIONS = [
    {
      sectionId: "lovely-videos",
      title: "연애 세포를 깨우는 작품들",
      items: [
        { id: "lov-01", name: "고백의 역사", thumb: "https://placehold.co/600x400?text=1" },
        { id: "lov-02", name: "스타트업", thumb: "https://placehold.co/600x400?text=2" },
        { id: "lov-03", name: "미스터션샤인", thumb: "https://placehold.co/600x400?text=3" },
        { id: "lov-04", name: "난홍", thumb: "https://placehold.co/600x400?text=4" },
        { id: "lov-05", name: "어느 날 월터 형제들과 살게 됐다", thumb: "https://placehold.co/600x400?text=5" },
        { id: "lov-06", name: "트라이", thumb: "https://placehold.co/600x400?text=6" },
        { id: "lov-07", name: "승부", thumb: "https://placehold.co/600x400?text=7" },
        { id: "lov-08", name: "천문", thumb: "https://placehold.co/600x400?text=8" },
        { id: "lov-09", name: "미생", thumb: "https://placehold.co/600x400?text=9" }
      ]
    },
    {
      sectionId: "recommend",
      title: "회원님을 위해 엄선한 오늘의 콘텐츠",
      items: [
        { id: "rec-01", name: "귀멸의 칼날", thumb: "https://placehold.co/600x400?text=1" },
        { id: "rec-02", name: "트리거", thumb: "https://placehold.co/600x400?text=2" },
        { id: "rec-03", name: "미션 임파서블", thumb: "https://placehold.co/600x400?text=3" },
        { id: "rec-04", name: "폭싹 속았수다", thumb: "https://placehold.co/600x400?text=4" },
        { id: "rec-05", name: "브레이킹 배드", thumb: "https://placehold.co/600x400?text=5" },
        { id: "rec-06", name: "폭군의 셰프", thumb: "https://placehold.co/600x400?text=6" },
        { id: "rec-07", name: "터미널", thumb: "https://placehold.co/600x400?text=7" },
        { id: "rec-08", name: "다운사이징", thumb: "https://placehold.co/600x400?text=8" },
        { id: "rec-09", name: "언내추럴", thumb: "https://placehold.co/600x400?text=9" },
        { id: "rec-10", name: "삼국지", thumb: "https://placehold.co/600x400?text=10" },
        { id: "rec-11", name: "설국열차", thumb: "https://placehold.co/600x400?text=11" },
        { id: "rec-12", name: "고스트 워", thumb: "https://placehold.co/600x400?text=12" }
      ]
    },
    {
      sectionId: "top10-series",
      title: "오늘 대한민국의 TOP 10 시리즈",
      items: [
        { id: "top-01", name: "사마귀", thumb: "https://placehold.co/600x400?text=1" },
        { id: "top-02", name: "폭군의 셰프", thumb: "https://placehold.co/600x400?text=2" },
        { id: "top-03", name: "에스콰이어", thumb: "https://placehold.co/600x400?text=3" },
        { id: "top-04", name: "애마", thumb: "https://placehold.co/600x400?text=4" },
        { id: "top-05", name: "나는 SOLO", thumb: "https://placehold.co/600x400?text=5" },
        { id: "top-06", name: "귀멸의 칼날", thumb: "https://placehold.co/600x400?text=6" },
        { id: "top-07", name: "은중과 상연", thumb: "https://placehold.co/600x400?text=7" },
        { id: "top-08", name: "마이턴", thumb: "https://placehold.co/600x400?text=8" },
        { id: "top-09", name: "괴수 8호", thumb: "https://placehold.co/600x400?text=9" },
        { id: "top-10", name: "소용없어 거짓말", thumb: "https://placehold.co/600x400?text=10" }
      ]
    }
  ];
  
  const seenNames = new Set();
  
  export const TITLES = SECTIONS
    .flatMap(sec =>
      sec.items.map(it => ({
        id: it.id,
        name: it.name,
        type: "series",        // 필요 시 섹션별로 다르게 지정 가능
        image: it.thumb,
        desc: sec.title,
        sectionId: sec.sectionId
      }))
    )
    // 제목 기준 중복 제거
    .filter(item => {
      const key = item.name.toLowerCase();
      if (seenNames.has(key)) return false;
      seenNames.add(key);
      return true;
    });
  