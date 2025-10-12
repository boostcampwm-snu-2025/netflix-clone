# 넷플릭스 클론 프로젝트

## 5. 비동기와 데이터 통신 체크포인트

### 공통

- [X] 디렉토리 구조 변경
  - server : 백엔드 코드
  - client : 프론트엔드 코드

### 프론트엔드

- 검색창 구현
  - [X] 최근 검색어 5개 저장 및 표시
  - [X] API 호출 로딩 시 텍스트 표시
  - [X] 검색 결과 페이지 이동
  - [X] 돋보기 아이콘 클릭 시 검색창 애니메이션
  - [X] 최근 검색어 키보드 방향키로 선택 가능
  - [X] 검색 결과 없을 시 "검색 결과가 없습니다" 메시지 표시

- 리팩토링
  - [X] `fetch ... then` 문법 사용
  - [X] 클래스 문법이 아닌 함수형 컴포넌트로 변경
  - [ ] 콜백 함수 분리

### 백엔드

- 검색 API 구현 (FastAPI 사용)
  - [X] 검색어를 받아 관련 영화 데이터 반환
  - [ ] 검색 결과 정렬 및 필터링 기능

## 실행 방법

### 1. 백엔드 서버 실행

#### 1. uv 설치

  Windows

  ```bash
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  ```

  MacOS / Linux

  ```bash
  curl -sSL https://astral.sh/uv/install.sh | sh
  ```

  #### 2. uv로 가상환경 생성

  ```bash
  uv sync
  source .venv/bin/activate
  ```

  #### 3. 서버 실행

  ```bash
  uvicorn server.main:app --reload
  ```

### 2. 프론트엔드 서버 실행

  ```bash
  cd client
  npm run dev
  ```

### 3. 한번에 실행

  ```bash
  bash run.sh
  ```

  또는

  ```bash
  sh run.sh
  ```
