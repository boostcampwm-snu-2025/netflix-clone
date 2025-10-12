export class InfiniteCarouselInstance {
  constructor(wrapper, opts) {
    this.wrapper = wrapper;
    this.opts = Object.assign({
      trackSelector: '.track',
      itemSelector: '.item',
      prevSelector: '.prev',
      nextSelector: '.next',
      visible: 5,
      gap: 15,
      transition: 'transform 0.5s ease',
      infinite: true,
      indicator: null,
      onPageChange: null,
    }, opts || {});

    this.locking = false;
    this._init();
  }

  _q(sel, root = this.wrapper) {
    return root ? root.querySelector(sel) : null;
  }

  _qa(sel, root = this.wrapper) {
    return root ? root.querySelectorAll(sel) : [];
  }

  _slidesAll() {
    return this.track ? this.track.querySelectorAll(this.opts.itemSelector) : [];
  }

  _firstSlideWidth() {
    const first = this._slidesAll()[0];
    return first ? first.offsetWidth : 0;
  }

  _applyTransform(animate = true) {
    if (!this.track) return;
    this.track.style.transition = animate ? this.opts.transition : 'none';
    const w = this._firstSlideWidth();
    const offset = this.index * (w + this.opts.gap);
    this.track.style.transform = `translateX(-${offset}px)`;
  }

  _normalizeIndex() {
    const N = this.N;
    if (!this.opts.infinite || !N) return;
    if (this.index >= 2 * N) {
      this.index -= N;
      this._applyTransform(false);
    } else if (this.index < N) {
      this.index += N;
      this._applyTransform(false);
    }
  }

  _updateIndicator() {
    const N = this.N;
    if (!N) return;
    const visible = Math.max(1, Math.min(this.opts.visible, N));
    const pages = Math.ceil(N / visible);
    const baseIndex = ((this.index % N) + N) % N;
    const page = Math.floor(baseIndex / visible);

    if (this.indicatorTrack && this.indicatorConfig) {
      const dots = this.indicatorTrack.querySelectorAll(`.${this.indicatorConfig.dotClass}`);
      dots.forEach((d, i) => {
        if (i === page) d.classList.add(this.indicatorConfig.activeClass);
        else d.classList.remove(this.indicatorConfig.activeClass);
      });
    }

    if (typeof this.opts.onPageChange === 'function') {
      this.opts.onPageChange({ page, pages, baseIndex, index: this.index });
    }
  }

  _ensureIndicator(pages) {
    if (!this.opts.indicator || !this.opts.indicator.trackSelector) return;
    this.indicatorTrack = this._q(this.opts.indicator.trackSelector, this.wrapper.closest(':scope') || this.wrapper.parentElement || this.wrapper);
    if (!this.indicatorTrack) return;
    const cfg = this.indicatorConfig = Object.assign({
      dotClass: 'pi-dot',
      activeClass: 'is-active',
      createDots: true,
    }, this.opts.indicator);
    if (cfg.createDots) {
      this.indicatorTrack.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('span');
        dot.className = cfg.dotClass + (i === 0 ? ` ${cfg.activeClass}` : '');
        this.indicatorTrack.appendChild(dot);
      }
    }
  }

  _bind() {
    if (this.prevBtn) this.prevBtn.addEventListener('click', this._onPrev);
    if (this.nextBtn) this.nextBtn.addEventListener('click', this._onNext);
    if (this.track) this.track.addEventListener('transitionend', this._onTransitionEnd);
  }

  _unbind() {
    if (this.prevBtn) this.prevBtn.removeEventListener('click', this._onPrev);
    if (this.nextBtn) this.nextBtn.removeEventListener('click', this._onNext);
    if (this.track) this.track.removeEventListener('transitionend', this._onTransitionEnd);
  }

  _init() {
    this.track = this._q(this.opts.trackSelector);
    if (!this.track) return;

    this.prevBtn = this.opts.prevSelector ? this._q(this.opts.prevSelector) : null;
    this.nextBtn = this.opts.nextSelector ? this._q(this.opts.nextSelector) : null;

    const originalSlides = Array.from(this._slidesAll());
    this.N = originalSlides.length;
    if (this.N === 0) return;

    if (this.opts.infinite) {
      if (this._slidesAll().length === this.N) {
        const frag = document.createDocumentFragment();
        for (let r = 0; r < 2; r++) {
          originalSlides.forEach(slide => frag.appendChild(slide.cloneNode(true)));
        }
        this.track.appendChild(frag);
      }
      this.index = this.N;
    } else {
      this.index = 0;
    }

    const visible = Math.max(1, Math.min(this.opts.visible, this.N));
    const pages = Math.ceil(this.N / visible);
    this._ensureIndicator(pages);

    this._onPrev = () => this.step('prev');
    this._onNext = () => this.step('next');
    this._onTransitionEnd = (e) => {
      if (e.propertyName !== 'transform') return;
      this._normalizeIndex();
      this._updateIndicator();
      requestAnimationFrame(() => { this.locking = false; });
    };

    // Initial paint
    requestAnimationFrame(() => this._applyTransform(false));
    this._updateIndicator();
    this._bind();
  }

  step(dir) {
    if (this.locking || !this.N) return;
    this.locking = true;
    const stepSize = Math.min(Math.max(1, this.opts.visible), this.N);
    this.index += dir === 'next' ? stepSize : -stepSize;
    this._applyTransform(true);
    this._updateIndicator();
  }

  next() { this.step('next'); }
  prev() { this.step('prev'); }

  getState() {
    return {
      index: this.index,
      total: this.N,
      visible: this.opts.visible,
      infinite: this.opts.infinite,
    };
  }

  destroy() {
    this._unbind();
  }
}

export function initInfiniteCarousels(options = {}) {
  const {
    selector = '.carousel',
    trackSelector = '.track',
    itemSelector = '.item',
    prevSelector = '.prev',
    nextSelector = '.next',
    visible = 5,
    gap = 15,
    transition = 'transform 0.5s ease',
    infinite = true,
    indicator = null,
    onPageChange = null,
  } = options;

  const wrappers = document.querySelectorAll(selector);
  const instances = [];
  wrappers.forEach(wrapper => {
    const inst = new InfiniteCarouselInstance(wrapper, {
      trackSelector,
      itemSelector,
      prevSelector,
      nextSelector,
      visible,
      gap,
      transition,
      infinite,
      indicator,
      onPageChange,
    });
    // Only push if properly initialized (track and N exist)
    if (inst.track && inst.N > 0) instances.push(inst);
  });
  return instances;
}
