import express from "express";
import cors from "cors";
import { readdir, writeFile } from "fs/promises";
import path from "path";

const app = express();
const PORT = 3001;

const IMAGES_DIR = "/home/suho/netflix-clone/vite-project/images";
const OUTPUT_JSON = "/home/suho/netflix-clone/vite-project/database.json";
const WEB_PREFIX = "/images";
const EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg", ".avif"]);

// building dataset for show search result
const buildIndex = async () => {
  const files = (await readdir(IMAGES_DIR, { withFileTypes: true }))
    .filter(f => f.isFile() && EXTS.has(path.extname(f.name).toLowerCase()))
    .map(f => ({ name: f.name, path: path.posix.join(WEB_PREFIX, f.name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const payload = { generatedAt: new Date().toISOString(), count: files.length, images: files };
  await writeFile(OUTPUT_JSON, JSON.stringify(payload, null, 2));
  return payload;
};

app.use(cors());          // 모든 요청 허용
app.use(express.json());  // JSON 파싱

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.listen(PORT, () => {
  console.log(` Server on http://localhost:${PORT}`);
});

// GET: 데이터 조회
app.get("/api/hello", (req, res) => {
  res.json({ msg: "Hello World" });
});

// POST: 데이터 생성
app.post("/api/echo", (req, res) => {
  res.json({ youSent: req.body });
});

// get database
app.get("/api/images-index", async (_, res) => res.json(await buildIndex()));