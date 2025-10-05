import cors from "cors";
import express, { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";

import newContents from "../data/new-contents.json" with { type: "json" };
import notifications from "../data/notifications.json" with { type: "json" };
import searchWords from "../data/search-words.json" with { type: "json" };
import top10Movies from "../data/top10-movies.json" with { type: "json" };
import top10Series from "../data/top10-series.json" with { type: "json" };

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use(cors());          // 모든 요청 허용
app.use(express.json());  // JSON 파싱

const router = Router();

router.get("/search", (req, res) => {
  const q = req.query.q?.toString().toLowerCase() || "";
  const items = searchWords.filter(word => word.split(" ").some(part => part.toLowerCase().startsWith(q)));
  res.json({ items, total: items.length });
});

router.get("/top10-series", (req, res) => {
  res.json(top10Series);
});

router.get("/new-contents", (req, res) => {
  res.json(newContents);
});

router.get("/top10-movies", (req, res) => {
  res.json(top10Movies);
});

router.get("/notifications", (req, res) => {
  res.json(notifications);
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(` Server on http://localhost:${PORT}`);
});
