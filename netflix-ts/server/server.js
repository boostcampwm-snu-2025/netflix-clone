import express from "express";
import cors from "cors";
import { TITLES } from "./data.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/search", (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase();

  const result = q
    ? TITLES.filter(t =>
        t.name.toLowerCase().includes(q) || (t.desc?.toLowerCase().includes(q))
      )
    : [];

  // 1초 지연 응답
  setTimeout(() => res.json({ items: result, total: result.length }), 1000);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
