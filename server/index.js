import express from "express";
import cors from "cors";
import { TITLES, CATEGORIES } from "./data.js";

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// 1초 지연 미들웨어
const delayMiddleware = (req, res, next) => {
  setTimeout(() => {
    next();
  }, 1000);
};

// API Routes

// GET /api/search?q=키워드 - 검색 API
app.get("/api/search", delayMiddleware, (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({
      error: "검색어를 입력해주세요",
      items: [],
      total: 0
    });
  }

  const q = query.toLowerCase();
  const result = TITLES.filter(title =>
    title.name.toLowerCase().includes(q) ||
    title.description.toLowerCase().includes(q) ||
    title.category.toLowerCase().includes(q)
  );

  console.log(`[검색] 키워드: "${query}" - 결과: ${result.length}개`);

  res.json({
    items: result,
    total: result.length,
    query: query
  });
});

// GET /api/titles - 모든 콘텐츠 조회
app.get("/api/titles", delayMiddleware, (req, res) => {
  console.log(`[조회] 전체 콘텐츠: ${TITLES.length}개`);

  res.json({
    items: TITLES,
    total: TITLES.length
  });
});

// GET /api/titles/:id - 특정 콘텐츠 상세 조회
app.get("/api/titles/:id", delayMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const title = TITLES.find(t => t.id === id);

  if (!title) {
    return res.status(404).json({
      error: "콘텐츠를 찾을 수 없습니다"
    });
  }

  console.log(`[상세조회] ID: ${id} - ${title.name}`);

  res.json(title);
});

// GET /api/categories - 카테고리별 콘텐츠 조회
app.get("/api/categories", delayMiddleware, (req, res) => {
  const categoryData = {};

  Object.keys(CATEGORIES).forEach(categoryKey => {
    categoryData[categoryKey] = {
      name: CATEGORIES[categoryKey],
      items: TITLES.filter(title => title.category === categoryKey)
    };
  });

  console.log(`[카테고리] ${Object.keys(categoryData).length}개 카테고리 조회`);

  res.json(categoryData);
});

// GET /api/categories/:category - 특정 카테고리 콘텐츠 조회
app.get("/api/categories/:category", delayMiddleware, (req, res) => {
  const category = req.params.category;

  if (!CATEGORIES[category]) {
    return res.status(404).json({
      error: "존재하지 않는 카테고리입니다"
    });
  }

  const items = TITLES.filter(title => title.category === category);

  console.log(`[카테고리조회] ${CATEGORIES[category]}: ${items.length}개`);

  res.json({
    category: category,
    name: CATEGORIES[category],
    items: items,
    total: items.length
  });
});

// Health Check
app.get("/", (req, res) => {
  res.json({
    message: "Netflix Clone API Server",
    version: "1.0.0",
    endpoints: {
      search: "/api/search?q=키워드",
      allTitles: "/api/titles",
      titleDetail: "/api/titles/:id",
      allCategories: "/api/categories",
      categoryDetail: "/api/categories/:category"
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: "API를 찾을 수 없습니다",
    path: req.path
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("서버 에러:", err);
  res.status(500).json({
    error: "서버 내부 오류가 발생했습니다"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   Netflix Clone API Server           ║
║   Running on http://localhost:${PORT}   ║
╚═══════════════════════════════════════╝

📌 사용 가능한 API:
  - GET  /api/search?q=키워드
  - GET  /api/titles
  - GET  /api/titles/:id
  - GET  /api/categories
  - GET  /api/categories/:category

⏱️  모든 API 요청은 1초 지연됩니다.
  `);
});
