# 5주차 과제\_설계서

## 서버 환경 구성

- [x] express로 서버폴더 (server/) 세팅하기
  - 포트: 3001
  - cors 허용: "[http://localhost:](http://localhost:5173/){프론트 포트번호}" or all
  - 데이터 응답 형식: JSON
- [x] 해당 폴더 내에 mock data 만들기 (AI활용)
  - 경로: server/data/mockData.json
    ```jsx
    //example
    [
      { id: 1, name: "Apple", image: "/images/apple.jpg" },
      { id: 2, name: "Banana", image: "/images/banana.jpg" },
      { id: 3, name: "Avocado", image: "/images/avocado.jpg" },
    ];
    ```
- [x] 해당 폴더를 프론트폴더(frontend/)와 같은 프로젝트 루트(week5_assignment/)에 두기
- [x] 프론트와 주고받을 API 엔드포인트 설계
      | Method | Endpoint | Query Params | 설명 |
      | ------ | ----------- | ------------ | ------------------------------------------- |
      | GET | /api/search | q(검색어) | 검색어와 일치(또는 포함)하는 mock data 반환 |
      ※Query Params란?: http요청에서 검색어나 필터 조건 같은 추가 정보를 전달할 때 URL뒤에 붙는 값

  ```jsx
  //요쳥 예시
  GET http://localhost:4000/api/search?q=ap

  //응답 예시
  [
    { "id": 1, "name": "Apple", "image": "/images/apple.jpg" },
    { "id": 3, "name": "Avocado", "image": "/images/avocado.jpg" }
  ]
  ```

## 프론트엔드 개발

- [x] 애니메이션 효과가 있는 검색창 UI 생성
  - not hovered → 검색 아이콘만 보임
  - hovered →
    - 검색 아이콘이 맨 왼쪽으로 슬라이딩
    - box border가 오른쪽에서 왼쪽으로 슬라이딩되며 나타남
    - box 내부에 input area 생성 (placeholder: “제목, 사람, 장르”)
- [x] 실시간 검색 로직
  1. onChange 이벤트로 입력값 감지
  2. 0.5초동안 입력이 없으면(debounce) → api 호출(/api/search?q=입력값)로 요청
  3. 응답받은 data중 name이 검색어를 **부분 포함**하는 항목만 필터링
  4. 일치하는 항목들의 image만 UI에 표시
