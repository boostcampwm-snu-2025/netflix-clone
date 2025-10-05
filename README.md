# netflix-clone

넷플릭스 클론 프로젝트

# To DO

- Express 서버 구현
  - 1초 지연을 위해 Promise 객체를 이용해 custom sleep 함수 구현

- JSON 형태의 Mock Data 적재

- 최근검색어 기능 구현
  - Local Storage API 이용
  - Array 형태로 최근 검색어 5 개 저장

- 자동 검색 요청 및 데이터 요청 횟수 조절 구현
  - setTimeout 및 clearTimeout 이용
  - 키보드 입력 시 timerId 변수가 undefined가 아니면 clearTimeout 호출해 기존 timeout 취소

- 검색창 확대 기능 구현
  - focus Event Listener 이용
