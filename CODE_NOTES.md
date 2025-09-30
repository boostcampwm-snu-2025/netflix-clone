# Directory Structure

- `data.json` : Contains all data, including `.png` files, constant values (titles, content, etc)

- `scripts` : typescript files
- `scripts/api` : API handling
- `scripts/api/fetchTest.ts` : For test- currently not in use
- `scripts/api/fetchData.st` : Uses API to fetch `data.json` data

- `scripts/components` : typescript files handling UI actions
- `scripts/components/handleLikes.ts` : Handles likes of cards- Uses localStorage to store "like" states, States and UI are changed when the card icon is clicked, "Like" states are restored even after refreshing the browser.
  - `getLikedItems()`
  - `saveLikedItems()`
  - `toggleLike()` : Change to like if currently unliked, and vice versa.
  - `repaintLikes()` : Update UI whenever refreshing or DOM is updated
  - `initLikeButtons()` : Register click events (Initialize event listeners) -> used whenever the user clicks
- `scripts/components/infiniteCarousel.ts` : Handles infinite carousel actions (Check [Previous Notes](#previous-notes))
- `scripts/components/top10.ts` : Handles top10 carousel actions (Check [Previous Notes](#previous-notes))

- `scripts/render` : Handles UI rendering on screen. Updates the DOM of each UI section- Hero, Notification, Profile, Carousels, Top10, etc.
- `scripts/render/render.ts` :
  Functions:

  - `renderHero`
  - `renderNotifications`
  - `renderProfiles`
  - `renderCarousels`
  - `renderTop10`

- `styles` : Handles CSS

- `types` : Defines types for data fetching & rendering

# Previous Notes- Carousel & Top10 explanations. Made for HW 3

## Infinite Carousel- 일반 row들

`InfiniteCarousel` class를 만든 후, 모든 동적인 동작들을 class의 함수로 정의하고, `InfiniteCarousel` class 생성자에서 함수들을 실행하도록 하였다.

```javascript
document
	.querySelectorAll("[data-carousel]")
	.forEach((root) => new InfiniteCarousel(root));
```

모든 `data-carousel` 속성을 가진 tag들 (= carousel이 들어가는 모든 row들)이 `new InfiniteCarousel(root)`를 호출하도록 한다. 즉 생성자 실행

`index.html`에 만들지 않고, `app.js`에서 동적으로 pagination을 생성하도록 설정

-> 각 carousel의 item 개수에 따라 pagination bar 개수가 달라지도록 하는 등의 관리가 더 편하다

카드들을 앞뒤로 복제하여 3n개의 배열로 관리한 후, 무한 루프처럼 자연스럽게 이동하도록 한다.

현재 window를 기준으로 한 번에 몇 장의 카드를 보여줄지 계산하고, 그에 따라 페이지 개수와 pagination bar의 개수를 계산한다.

페이지 이동 시 현재 위치에 맞게 pagination bar의 active 위치를 계산하여 표시한다.

Resizing event도 (창 크기가 바뀌어도) handling하도록 함수를 추가하였다.

### 각 함수들

#### \_readGap()

카드 간격 계산

#### \_slideWidth()

카드의 width 계산

#### \_cloneHeadAndTail()

무한 Carousel 구현을 위해 `head`(앞쪽)와 `tail`(뒤쪽) 변수를 만들어서 각 부분에 모든 카드 복사하여 저장

#### \_translate(i, animated = true)

`i`번째 카드로 carousel을 움직이는 함수. `animated` 변수는 transition CSS를 사용할지 여부

#### \_jump(i)

transition CSS 없이 특정 `i`번째 카드로 위치 조정할 때 쓰는 함수

#### \_buildPageStarts()

`_computeLayout` 함수에서 계산한 `itemsPerView` (한 화면에 띄울 카드 개수)를 이용해서, `pageStarts` 배열에 각 페이지마다 시작하는(가장 왼쪽에 있을) card의 index를 저장하고, 그걸 토대로 `totalPages`(Pagination bar 수) 계산

#### \_computeLayout()

`itemsPerView` 계산 방법: `unit` = 카드 1장 + gap 1개의 폭 계산하여 저장. 화면을 `unit`으로 나눈만큼의 카드를 한 번에 보여준다.

#### \_buildPagination()

pagination bar 그리거나 reload(초기화)할 때 함수 호출. 기존의 pagination bar 없앤 후 다시 계산한다

#### \_logicalIndex()

`_cloneHeadAndTail()` 함수에서 `n`-> `3n`개로 확장한 카드 수를 0 ~ n-1 범위로 바꾸는 함수

#### \_currentPageIndex()

현재 카드가 몇번째 page에 속하는지 (`idx` 페이지에 속함) 계산하여 반환

#### \_updatePaginationActive()

pagination bar가 어떤 index (`idx`)의 bar를 active 처리할지 계산하는 함수. `isAnimating`이 `true`이면(=현재 transition 진행 중) 현재 저장된 페이지 index를 활성화하고, 아니면 `_currentPageIndex`함수를 사용해서 새롭게 계산한다.

#### \_goToPageIndex(targetIdx, dir = 0)

`targetIdx` 페이지로 이동하는 함수

#### \_movePage(dir)

`_goToPageIndex` 함수를 호출하여 `dir` 방향으로 한 페이지씩 이동한다

#### \_onTransitionEndSync()

`transitionend` (transition 끝났을 때) event 발생 시 일어나는 일을 명시한 함수.

#### \_bind()

무한 Carousel의 모든 인터랙션을 연결한다. (초기 셋팅 담당)

- 버튼 조작 (Prev/Next 버튼 클릭 시 페이지 이동)
- 에니메이션 종료 감지 (transitionend 시 무한 루프 보정 + pagination 동기화)
- 마우스 드래그 (좌우 드래그로 페이지 이동)
- 리사이즈 (resize event)
- 등

#### \_handleEdges()

`_jump` 함수 사용해서, 오른쪽 끝이나 왼쪽 끝까지 간 경우에 각각 -n / +n을 해서 infinite carousel 구현

#### \_recalc()

브라우저 resizing 등을 handling: 카드 폭 등을 다시 계산하고 layout을 다시 셋팅한다.

## Infinite Carousel- Top 10 부분

Top 10은 따로 함수를 더 정의하여 구현하였다.

`.top10-section`, `.top10-list`가 있는 tag들을 찾아 적용하도록 했다.

CSS 스타일 동적으로 적용 -> `.css` 파일에 정의해도 되긴 함

다른 carousel들과 따로 정의한 이유: `pageSize=5` (한번에 5개씩 보여주기)로 따로 구현하기 위함. 코드가 더 간단하므로

-> 이렇게 Top10 custom되니 함수를 따로 정의한게 계산량이 줄어서 더 빠르게 구현할 수 있다
