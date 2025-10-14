import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import apiRouter from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 3001;

// [Middlewares]-------------
// CORS 허용 설정
app.use(cors());
app.use(express.json());
// ✨ client 폴더를 정적 서빙
app.use(express.static(path.resolve(__dirname, "../client")))


// [Routers]-------------
// /api 경로로 들어오는 요청은 apiRouter가 처리
app.use("/api", apiRouter);


// 기본 경로: index.html 서빙
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});


// [Start Server]-------------
// 클라이언트 요청 대기
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
