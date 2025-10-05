# netflix-clone

넷플릭스 클론 프로젝트

## 체크포인트

- 검색
  - 검색 결과 노출 (api 응답 받으면 화면에 바로 노출)
    - 검색결과는 datalist tag를 사용하여 선택가능하도록 제공
  - 검색 서버 구현 (Express로 GET API 구현)
  - api 호출에 debounce 적용
    - setTimeout / clearTimeout 활용
- 최근 검색어 (form과 input의 name 속성 활용)
- 검색창 애니메이션 (click와 focusout event 활용)
