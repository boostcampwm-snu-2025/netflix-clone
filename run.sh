#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE} 프론트엔드 서버 시작${NC}\n"

cleanup() {
    echo -e "\n${RED}서버 종료 중...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup INT TERM

echo -e "${GREEN}[Backend]${NC} 벡엔드 서버 시작 (http://localhost:8000)"
uvicorn server.main:app --reload --port 8000 &
BACKEND_PID=$!

sleep 2

echo -e "${GREEN}[Frontend]${NC} Vite 개발 서버 시작 (http://localhost:3000)"
cd client
npm run dev &
FRONTEND_PID=$!

wait
