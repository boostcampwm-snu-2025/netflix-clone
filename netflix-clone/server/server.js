import express from "express";
import cors from "cors";
import { CONTENTS } from "./data.js";

const app = express();
const PORT = 3001;
const DELAY = 1000;

app.use(cors());
app.use(express.json());

app.get("/api/search", (req, res) => {
    setTimeout(() => {
        handle_search_request(req, res);
    }, DELAY)
})

function handle_search_request(req, res) {
    const input = req.query.q.toLowerCase();
    const result = CONTENTS.filter(create_filter(input))
    res.json({ items: result, total: result.length });
}

function create_filter(input) {
    return function(content) {
        const title = content.title.toLowerCase();
        const description = content.description.toLowerCase();
        return title.includes(input) || description.includes(input);
    }
}

app.listen(PORT, () => {
    console.log(`Serer running at http://localhost:${PORT}`);
})
