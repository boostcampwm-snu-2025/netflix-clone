import express from "express";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors()); // 모든 요청 허용
app.use(express.json()); // JSON 파싱

//루트 엔드포인트
app.get("/", (req, res) => {
  res.send("Hello Express");
});

//api/search 엔드포인트
app.get("/api/search", (req, res) => {
  // 쿼리 파라미터에서 검색어 추출, 없으면 빈 문자열 (대소문자 구분 x)
  const query = (req.query.q || "").toLowerCase();
  // mockData.json 파일 읽기
  const dataPath = path.join(__dirname, "data", "mockData.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  // 검색어가 제목이나 내용에 포함된 항목 필터링
  const results = data.filter((item) =>
    item.name.toLowerCase().includes(query)
  );

  //응답 반환
  res.json(results);
});

//서버 실행 명령
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
