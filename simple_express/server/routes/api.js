
import express from "express";
import { TITLES } from "../data.js";

const router = express.Router();
const DELAY_MS = 1000; // 1초 지연 (요구사항)

// GET 요청시 /api/search?q=키워드 router 등록
router.get("/search", (req, res) => {
    const q = req.query.q ? req.query.q.toLowerCase() : "";

    // 검색 로직
    const result = TITLES
        .filter(t => t.name.toLowerCase().includes(q))
        .filter(t => !!t.image); // 이미지 없는 항목 제외

    // 1초 지연 후 응답
    setTimeout(() => {
        res.json({
            items: result,
            total: result.length,
        });
    }, DELAY_MS);
});

// router 객체를 외부에 내보내기
export default router;