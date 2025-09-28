import { ASSET_PATH } from "./asset.js";

export const TOP_TEN_API_VALUE = {
  videos: [
    {
      rank: 1,
      title: "사마귀",
      thumbnail_image: ASSET_PATH.VIDEOS.SAMAGUI,
    },
    {
      rank: 2,
      title: "폭군의 셰프",
      thumbnail_image: ASSET_PATH.VIDEOS.CHEF,
    },
    {
      rank: 3,
      title: "에스콰이어",
      thumbnail_image: ASSET_PATH.VIDEOS.ESQUIRE,
    },
    {
      rank: 4,
      title: "애마부인",
      thumbnail_image: ASSET_PATH.VIDEOS.HORSE,
    },
    {
      rank: 5,
      title: "야당",
      thumbnail_image: ASSET_PATH.VIDEOS.YADANG,
    },
    {
      rank: 6,
      title: "케이팝 데몬 헌터스",
      thumbnail_image: ASSET_PATH.VIDEOS.KPOP,
    },
    {
      rank: 7,
      title: "사마귀",
      thumbnail_image: ASSET_PATH.VIDEOS.SAMAGUI,
    },
    {
      rank: 8,
      title: "사마귀",
      thumbnail_image: ASSET_PATH.VIDEOS.SAMAGUI,
    },
    {
      rank: 9,
      title: "사마귀",
      thumbnail_image: ASSET_PATH.VIDEOS.SAMAGUI,
    },
    {
      rank: 10,
      title: "사마귀",
      thumbnail_image: ASSET_PATH.VIDEOS.SAMAGUI,
    },
  ],
};

export const RECOMMENDATION_API_VALUE = {
  recommendation_list: [
    {
      title: "밥 친구",
      videos: [
        {
          title: "폭군의 셰프",
          thumbnail: ASSET_PATH.VIDEOS.CHEF,
          is_new_episode: true,
        },
        {
          title: "에스콰이어",
          thumbnail: ASSET_PATH.VIDEOS.ESQUIRE,
          is_new_episode: true,
        },
        {
          title: "트리거",
          thumbnail: ASSET_PATH.VIDEOS.TRIGGER,
        },
        {
          title: "사마귀",
          thumbnail: ASSET_PATH.VIDEOS.SAMAGUI,
          is_new_episode: true,
        },
        {
          title: "폭싹 속았수다",
          thumbnail: ASSET_PATH.VIDEOS.POKSSAK,
        },
        {
          title: "트라이",
          thumbnail: ASSET_PATH.VIDEOS.TRY,
        },
      ],
    },
    {
      title: ".님이 시청 중인 콘텐츠",
      videos: [
        {
          title: "트라이",
          thumbnail: ASSET_PATH.VIDEOS.TRY,
          is_new_episode: true,
        },
      ],
    },
    {
      title: "연애 세포를 깨우는 작품들",
      videos: [
        {
          title: "20세기",
          thumbnail: ASSET_PATH.VIDEOS.TWENTY,
          is_new: true,
        },
        {
          title: "장난스러운 키스",
          thumbnail: ASSET_PATH.VIDEOS.KISS,
        },
        {
          title: "애마부인",
          thumbnail: ASSET_PATH.VIDEOS.HORSE,
        },
        {
          title: "역사",
          thumbnail: ASSET_PATH.VIDEOS.HISTORY,
        },
        {
          title: "케이팝 데몬 헌터스",
          thumbnail: ASSET_PATH.VIDEOS.KPOP,
          is_new_season: true,
        },
      ],
    },
    {
      title: "오늘 대한민국의 TOP 10 시리즈",
      is_top_ten: true,
      videos: TOP_TEN_API_VALUE.videos,
    },
  ],
};
