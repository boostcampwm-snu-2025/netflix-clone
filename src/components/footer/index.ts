import "./index.css";

import facebookIcon from "/assets/footer/facebook.svg?raw";
import instagramIcon from "/assets/footer/instagram.svg?raw";
import twitterIcon from "/assets/footer/twitter.svg?raw";
import youtubeIcon from "/assets/footer/youtube.svg?raw";

export default function Footer() {
  return `
  <footer class="footer">
    <ul class="social-media">
      <li>
        <a href="#" target="_blank" aria-label="facebook">${facebookIcon}</a>
      </li>
      <li>
        <a href="#" target="_blank" aria-label="instagram">${instagramIcon}</a>
      </li>
      <li>
        <a href="#" target="_blank" aria-label="twitter">${twitterIcon}</a>
      </li>
      <li>
        <a href="#" target="_blank" aria-label="youtube">${youtubeIcon}</a>
      </li>
    </ul>
    <nav aria-label="Footer navigation">
      <ul class="footer-links">
        <li><a href="#" target="_self">화면 해설</a></li>
        <li><a href="#" target="_self">고객 센터</a></li>
        <li><a href="#" target="_self">기프트카드</a></li>
        <li><a href="#" target="_self">미디어 센터</a></li>
        <li><a href="#" target="_self">투자 정보(IR)</a></li>
        <li><a href="#" target="_self">입사 정보</a></li>
        <li><a href="#" target="_self">이용 약관</a></li>
        <li><a href="#" target="_self">개인정보</a></li>
        <li><a href="#" target="_self">법적 고지</a></li>
        <li><a href="#" target="_self">쿠키 설정</a></li>
        <li><a href="#" target="_self">회사 정보</a></li>
        <li><a href="#" target="_self">문의하기</a></li>
      </ul>
    </nav>
    <address class="copy-text">
      <div class="copy-text-block">
        넷플릭스서비시스코리아 유한회사 통신판매업신고번호:
        제2018-서울종로-0426호 전화번호:
        <a href="tel:00-308-321-0161">00-308-321-0161</a> (수신자 부담)
      </div>
      <div class="copy-text-block">대표: 레지널드 숀 톰프슨</div>
      <div class="copy-text-block">
        이메일 주소: <a href="mailto:korea@netflix.com">korea@netflix.com</a>
      </div>
      <div class="copy-text-block">
        주소: 대한민국 서울특별시 종로구 우정국로 26, 센트로폴리스 A동 20층
        우편번호 03161
      </div>
      <div class="copy-text-block">사업자등록번호: 165-87-00119</div>
      <div class="copy-text-block">
        클라우드 호스팅: Amazon Web Services Inc.
      </div>
      <div class="copy-text-block">
        <a href="http://www.ftc.go.kr/bizCommPop.do?wrkr_no=1658700119">공정거래위원회 웹사이트</a>
      </div>
    </address>
  </footer>
`;
}
