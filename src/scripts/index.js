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
  }
});
