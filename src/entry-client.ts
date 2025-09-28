import { worker } from './mocks/browser.ts';

import('./components/suspenseContainer/suspenseContainer.ts');
import('./components/asyncComponent/asyncComponent.ts');
import('./components/appButton/appButton.ts');
import('./components/arrowButton/arrowButton.ts');
import('./components/faqAccordion/faqAccordion.ts');
import('./components/featureCard/featureCard.ts');
import('./components/languageSelect/languageSelect.ts');
import('./components/movieCard/movieCard.ts');
import('./components/movieModal/movieModal.ts');
import('./components/movieSkeletonCard/movieSkeletonCard.ts');
import('./components/movieList/movieList.ts');

async function initializeApp() {
  await worker.start({
    onUnhandledRequest: 'warn',
  });

  if (document.readyState === 'loading') {
    await new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', resolve);
    });
  }
}

initializeApp().catch(error => {
  console.error('Failed to initialize app:', error);
});
