import heroImage from "./img/hero-img.webp"
import titleImage from "./img/title-card.webp"

document.querySelector<HTMLElement>('.hero')!.innerHTML = `
                <div class = "hero-image-wrapper">
                    <img src = "${heroImage}">
                </div>
                <div class = "right-button-layer">
                    <i class="fa fa-refresh"></i>
                    <span class="maturity-rating">
                        <p>15+</p>
                    </span>
                </div>
                <div class="fill-container">
                    <div class="titleWrapper">
                        <img src="${titleImage}">
                    </div>
                    <div class="info-wrapper">
                        <h1>#2 in TV Shows Today</h1>
                        <p>A modern-day chef travels back in time and finds herself before a tyrant king. Can she win over his heart-and his palate-with her culinary creations?</p>
                    </div>
                    <div class = "left-button-layer">
                        <button>
                            <i class="fa fa-play"></i>
                            Play
                        </button>
                        <button>
                            <i class="fa fa-info-circle"></i>
                            More Info
                        </button>
                    </div>
                </div>
`
