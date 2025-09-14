const top10Series = [
  {
    rank: 1,
    title: '사마귀 살인자의 외출',
  },
  {
    rank: 2,
    title: '폭군의 셰프',
  },
  {
    rank: 3,
    title: '에스콰이어',
  },
  {
    rank: 4,
    title: '애마',
  },
  {
    rank: 5,
    title: '은중과 상연',
  },
  {
    rank: 6,
    title: '한탕 프로젝트 마이턴',
  },
];

const newContents = [
  {
    order: 1,
    title: '은중과 상연',
  },
  {
    order: 2,
    title: '야당',
  },
  {
    order: 3,
    title: '그림형제',
  },
  {
    order: 4,
    title: '크레이븐: 더 헌터',
  },
  {
    order: 5,
    title: '연애 실험: 블라인드 러브 - 프랑스편',
  },
  {
    order: 6,
    title: '말뫼 사람 절반은 나를 차버린 남자',
  },
];

const top10Movies = [
  {
    rank: 1,
    title: '야당',
  },
  {
    rank: 2,
    title: '크레이븐: 더 헌터',
  },
  {
    rank: 3,
    title: '케이팝 데몬 헌터스',
  },
  {
    rank: 4,
    title: '고백의 역사',
  },
  {
    rank: 5,
    title: '케이팝 데몬 헌터스 싱어롱',
  },
  {
    rank: 6,
    title: '브로큰',
  },
];

const topSeriesElement = document.getElementById('top-series').querySelector('ol');

top10Series.forEach((series) => {
  const listItem = document.createElement('li');
  listItem.className = 'card';

  const link = document.createElement('a');
  link.href = '#';

  const rankImg = document.createElement('img');
  rankImg.className = 'rank';
  rankImg.src = `assets/main/rank/${series.rank}.svg`;
  rankImg.alt = `rank ${series.rank}`;

  const itemImg = document.createElement('img');
  itemImg.className = 'item';
  itemImg.src = `assets/main/series/${series.rank}.png`;
  itemImg.alt = series.title;

  link.appendChild(rankImg);
  link.appendChild(itemImg);
  listItem.appendChild(link);
  topSeriesElement.appendChild(listItem);
});

const newContentsElement = document.getElementById('new-contents').querySelector('ul');

newContents.forEach((content) => {
  const listItem = document.createElement('li');

  const link = document.createElement('a');
  link.href = '#';

  const itemImg = document.createElement('img');
  itemImg.src = `assets/main/new/${content.order}.png`;
  itemImg.alt = content.title;

  link.appendChild(itemImg);
  listItem.appendChild(link);
  newContentsElement.appendChild(listItem);
});

const topMoviesElement = document.getElementById('top-movies').querySelector('ol');

top10Movies.forEach((movie) => {
  const listItem = document.createElement('li');
  listItem.className = 'card';

  const link = document.createElement('a');
  link.href = '#';

  const rankImg = document.createElement('img');
  rankImg.className = 'rank';
  rankImg.src = `assets/main/rank/${movie.rank}.svg`;
  rankImg.alt = `rank ${movie.rank}`;

  const itemImg = document.createElement('img');
  itemImg.className = 'item';
  itemImg.src = `assets/main/movies/${movie.rank}.png`;
  itemImg.alt = movie.title;

  link.appendChild(rankImg);
  link.appendChild(itemImg);
  listItem.appendChild(link);
  topMoviesElement.appendChild(listItem);
});
