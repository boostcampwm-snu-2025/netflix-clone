document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('faq-open', e => {
    document.querySelectorAll('faq-accordion').forEach(acc => {
      if (acc !== e.target) {
        acc.close();
      }
    });
  });

  const movieList = document.querySelector('.top-contents__list');

  if (movieList) {
    movieList.addEventListener(
      'wheel',
      e => {
        e.preventDefault();
      },
      { passive: false }
    );

    const originalCards = Array.from(movieList.children);
    const cardsToClone = 5;

    for (let i = 0; i < cardsToClone; i++) {
      const clonedCard = originalCards[i].cloneNode(true);
      clonedCard.classList.add('cloned-card');
      movieList.appendChild(clonedCard);
    }

    const cardWidth = 180 + 32;
    const originalTotalCards = originalCards.length;
    const resetPoint = originalTotalCards * cardWidth;

    const autoScrollInterval = setInterval(() => {
      let currentScrollPosition = movieList.scrollLeft;
      currentScrollPosition += cardWidth;

      movieList.scrollTo({
        left: currentScrollPosition,
        behavior: 'smooth',
      });

      setTimeout(() => {
        if (currentScrollPosition >= resetPoint) {
          movieList.scrollTo({
            left: 0,
            behavior: 'auto',
          });
        }
      }, 600);
    }, 2500);
  }
});
