# netflix-clone
넷플릭스 클론 프로젝트


## 4주차 - 빌드와 데이터 통신 체크리스트

### 요구사항
- 데이터를 별도의 파일에 저장하기
- fetch 요청을 통해 콘텐츠 가져오기
- 좋아요 기능 개발
- vite 개발환경 구성하기
- (선택) mock server 환경 구축하기

## 개발 체크리스트

### 지난 주 요구사항 마저 구현하기
- [ ] BEM 리팩토링 마무리
- [ ] emailInput 컴포넌트 생성
- [ ] arrowButton, movieModal 스타일 클론 일치
- [ ] movieModal 애니메이션 적용
- [ ] 범용 무한 캐러셀 로직 작성 및 리팩토링

### 데이터 분리 및 구조화
- [ ] `src/data/movies.json` 파일 생성
- [ ] 영화 데이터 스키마 정의 (id, title, thumbnail, description, category, liked 등)
- [ ] 현재 HTML에 하드코딩된 영화 데이터를 JSON으로 이동

### API 서비스 구현
- [ ] `src/services/movieService.js` 파일 생성
- [ ] `fetchMovies()` 함수 구현
- [ ] `updateMovieLike()` 함수 구현  
- [ ] `index.js`에서 기존 하드코딩된 데이터 호출을 fetch로 변경

### 좋아요 기능 개발
- [ ] `movieModdal` 컴포넌트에 좋아요 버튼 UI 추가
- [ ] 좋아요 상태 표시 (빈 하트/채워진 하트)
- [ ] 좋아요 토글 이벤트 처리
- [ ] localStorage를 활용한 좋아요 상태 영구 저장

### Vite 개발환경 구성
- [ ] Vite 설치
- [ ] 빌드 테스트

### Mock Server 환경 구성
**MSW (Mock Service Worker) 사용 예정**
- [ ] API 핸들러 정의
- [ ] 브라우저 서비스 워커 설정