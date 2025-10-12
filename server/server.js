import express from "express";
import cors from "cors";
import { TITLES } from "./data.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Netflix Mock Server is running!");
});

// GET /api/search?q=키워드
app.get("/api/search", (req, res) => {
  // q가 없을 경우를 대비해 기본값('') 설정
  const q = (req.query.q || '').toLowerCase();

  // 검색어가 없으면 빈 배열 반환
  if (!q) {
    return res.json([]);
  }

  const result = TITLES.filter(item => item.title.toLowerCase().includes(q));
  
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});