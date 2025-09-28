import './components/suspenseContainer/suspenseContainer.ts';
import './components/asyncComponent/asyncComponent.ts';
import { worker } from './mocks/browser.ts';

await worker.start({
  onUnhandledRequest: 'warn',
});
