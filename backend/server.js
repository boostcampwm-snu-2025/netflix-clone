import express from "express";
import cors from "cors";
import { TITLES } from "./data.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// GET /api/search?q=키워드
app.get("/api/search", (req, res) => {
  const q = req.query.q.toLowerCase();
  const result = TITLES.filter(t => t.name.toLowerCase().includes(q));
  res.json({ items: result, total: result.length });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

