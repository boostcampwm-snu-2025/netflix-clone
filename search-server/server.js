import express from "express";
import cors from "cors";

import mockData from './movie_data.json' with { type: 'json' };

const app = express();
const port = 3000;

app.use(cors());          // use cors
app.use(express.json());  // use json parsing


// --- API route ---

// usage: GET /search?q=query
app.get('/search', (req, res) => {
  // 1. extract key from query (very naive: only lowering case)
  const query = req.query.q ? req.query.q.toLowerCase() : '';

  // 2. return empty array if query is empty
  if (!query) {
    return res.json([]);
  }

  // 3. filter match case from mockData
  const results = mockData.filter(item =>
    item.title.toLowerCase().includes(query)
  );

  // 4. return filtered result by json format
  res.json(results);
});


// executing server
app.listen(port, () => {
  console.log(`executing express search API server-http://localhost:${port}`);
});

