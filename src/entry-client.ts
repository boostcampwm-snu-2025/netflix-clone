import './components/suspenseContainer/suspenseContainer.ts';
import './components/asyncComponent/asyncComponent.ts';

import './components/appButton/appButton.ts';
import './components/arrowButton/arrowButton.ts';
import './components/faqAccordion/faqAccordion.ts';
import './components/featureCard/featureCard.ts';
import './components/languageSelect/languageSelect.ts';
import './components/movieCard/movieCard.ts';
import './components/movieModal/movieModal.ts';

import { worker } from './mocks/browser.ts';

await worker.start({
  onUnhandledRequest: 'warn',
});
