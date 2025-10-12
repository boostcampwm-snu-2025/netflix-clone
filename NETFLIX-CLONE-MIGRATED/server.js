// server.js (ES Module 버전)

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // 파일 경로 변환을 위한 모듈 추가
import cors from 'cors';

// CORS 설정

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001; 
app.use(express.json());
app.use(cors());

// --- 1. 정적 파일 경로 설정 (Static File Serving) ---
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));
app.use(express.static(path.join(__dirname))); 

// 2. src 폴더 내부의 CSS/JS 파일 서빙 
app.use('/src', express.static(path.join(__dirname, 'src'))); 

// 3. public 폴더 내부의 이미지 파일 서빙
app.use('/public', express.static(path.join(__dirname, 'public'))); 

// 4. JSON 데이터 파일 서빙
app.get('/data/netflix-content.json', (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'netflix-content.json');
    
    // path.join()을 사용했으므로 __dirname을 기준으로 경로 설정이 유지됩니다.
    res.sendFile(dataPath, (err) => {
        if (err) {
            console.error('JSON 파일 전송 에러:', err);
            res.status(404).json({ error: 'Data file not found' });
        }
    });
});

app.listen(port, () => {
    console.log(`✅ Netflix Clone Server started at http://localhost:${port}`);
    console.log('Ctrl+C를 눌러 서버를 종료하세요.');
});