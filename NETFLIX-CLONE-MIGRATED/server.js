// server.js

const express = require('express');
const path = require('path');
const app = express();
const port = 3000; // 서버 포트 설정 (원하는 포트로 변경 가능)

// --- 1. 정적 파일 경로 설정 (Static File Serving) ---
// 클라이언트가 요청하는 HTML, CSS, JS, 이미지 파일이 위치한 경로를 지정합니다.

// A. 루트 파일 (index.html, server.js와 같은 위치)
// 클라이언트가 '/'로 접속하면 index.html을 찾도록 설정합니다.
app.use(express.static(path.join(__dirname))); 

// B. CSS 및 JS 파일 경로 설정 (src 폴더 가정)
// ./src/style/style.css -> /src/style/style.css로 접근 가능
// ./src/script/content-loader.js -> /src/script/content-loader.js로 접근 가능
app.use('/src', express.static(path.join(__dirname, 'src')));

// C. 이미지/리소스 파일 경로 설정 (public 폴더 가정)
// 이미지 파일이 ./public/img 에 있다면 -> /public/img 로 접근 가능
app.use('/public', express.static(path.join(__dirname, 'public')));


// --- 2. JSON 데이터 API 엔드포인트 설정 ---
// 'content-loader.js'에서 fetch('./data/netflix-content.json') 요청을 처리합니다.
app.get('/data/netflix-content.json', (req, res) => {
    // 실제 JSON 파일의 경로
    const dataPath = path.join(__dirname, 'data', 'netflix-content.json');

    // JSON 파일을 읽어서 클라이언트에게 응답 (res.sendFile 사용)
    res.sendFile(dataPath, (err) => {
        if (err) {
            console.error('JSON 파일 전송 에러:', err);
            // 파일이 없을 경우 404 에러와 함께 JSON 응답
            res.status(404).json({ error: 'Data file not found' });
        }
    });
});


// --- 3. 서버 시작 ---
app.listen(port, () => {
    console.log(`✅ Netflix Clone Server started at http://localhost:${port}`);
    console.log('Ctrl+C를 눌러 서버를 종료하세요.');
});