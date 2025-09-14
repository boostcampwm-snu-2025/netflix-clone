document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('faq-open', e => {
    document.querySelectorAll('faq-accordion').forEach(acc => {
      if (acc !== e.target) {
        acc.close();
      }
    });
  });
});
