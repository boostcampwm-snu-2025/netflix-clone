class InfiniteScrollObserver {
  private observer: IntersectionObserver;
  private target: HTMLElement;
  private callback: () => void;

  constructor(target: string, callback: () => void) {
    this.callback = callback;
    this.target = document.querySelector(target) as HTMLElement;

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.callback();
          }
        });
      },
      {
        root: this.target.parentElement,
        rootMargin: '800px',
        threshold: 0,
      }
    );

    this.observer.observe(this.target);
  }

  disconnect() {
    this.observer.disconnect();
  }
}

export default InfiniteScrollObserver;
