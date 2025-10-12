import express from "express";
import cors from "cors";
import { mockSearchData } from "./data.js";
import { sleep } from "./utils.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/search", async (_req, res) => {
  await sleep(1000);
  const searchRes = mockSearchData.sort(() => Math.random() - 0.5).slice(0, 12);

  res.send(searchRes);
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
