import express from 'express';
import moviesData from './src/data/movies.json' with { type: 'json' };

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const delay = (ms: number = 1000) =>
  new Promise(resolve => setTimeout(resolve, ms));

function paginate<T>(data: T[], page: number, limit: number) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return {
    data: data.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(data.length / limit),
      totalItems: data.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < data.length,
      hasPrevPage: page > 1,
    },
  };
}

app.get('/api/search', async (req, res) => {
  await delay();

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const query = (req.query.q as string)?.toLowerCase() || '';

  let results = moviesData.search;

  if (query) {
    results = results.filter(
      movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.genre.some(g => g.toLowerCase().includes(query))
    );
  }

  const paginatedResults = paginate(results, page, limit);

  res.json({
    results: paginatedResults.data,
    ...paginatedResults.pagination,
    query,
  });
});

app.get('/api/movies', async (req, res) => {
  await delay();

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const paginatedResults = paginate(moviesData.search, page, limit);

  res.json({
    movies: paginatedResults.data,
    ...paginatedResults.pagination,
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
  console.log('API Endpoints:');
  console.log('  GET /api/search?q=검색어&page=1&limit=20 - 검색');
  console.log('  GET /api/movies?page=1&limit=20 - 전체 영화 목록');
});
