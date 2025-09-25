import { mainRender } from './render/mainRender.js';
import { heroRender } from './render/heroRender.js';
import { headerRender } from './render/headerRender.js';
import { footerRender } from './render/footerRender.js';
import { initializeFiniteCarousel, initializeInfiniteCarousel } from './animation/carousel.js';
import { initializeHeaderInteraction } from './animation/header.js';


async function init() {
    await headerRender();
    await heroRender();
    await mainRender();
    await footerRender();
    setupAllCarousels();
    initializeHeaderInteraction();
}

function setupAllCarousels() {
    initializeFiniteCarousel('.carousel-container__for-user', { visible: 6, move: 5 });
    initializeFiniteCarousel('.carousel-container__top10', { move: 5 });
    initializeInfiniteCarousel('.carousel-container__new', { move: 5 });
}

document.addEventListener('DOMContentLoaded', init);