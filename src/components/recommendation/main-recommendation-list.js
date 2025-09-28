import {
  TOP_TEN_API_VALUE,
  RECOMMENDATION_API_VALUE,
} from "../../entity/main-recommendation-video-data.js";

export class MainRecommendationList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = this._render(RECOMMENDATION_API_VALUE, TOP_TEN_API_VALUE);
    this._setupCarousels(RECOMMENDATION_API_VALUE);
  }

  _render(recommendationData, topTenData) {
    const sortedVideos = topTenData.videos.sort((a, b) => a.rank - b.rank);

    return `
      <section class="recommendation-container">
        ${recommendationData.recommendation_list
          .map(
            ({
              title,
              is_top_ten,
            }) => `<div class="recommendation-contents-wrapper">
            <p>${title}</p>
            <main-recommendation-carousel ${
              is_top_ten === true ? "is-top-ten='true'" : ""
            }></main-recommendation-carousel>
          </div>`
          )
          .join("")}
      </section>
    `;
  }

  _setupCarousels(recommendationData) {
    const carousels = this.querySelectorAll("main-recommendation-carousel");
    carousels.forEach((carousel, index) => {
      carousel.videos = recommendationData.recommendation_list[index].videos;
    });
  }
}
