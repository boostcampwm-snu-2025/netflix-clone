export async function loadTemplate(
  path: string,
  baseUrl: string = import.meta.url
): Promise<HTMLTemplateElement> {
  const res = await fetch(new URL(path, baseUrl));
  const html = await res.text();

  const template = document.createElement('template');
  template.innerHTML = html.trim();

  return template;
}

export function processDefaultSlot(
  component: HTMLElement,
  slotSelector: string = '[data-slot]'
): void {
  const slotElement = component.querySelector(slotSelector);
  if (!slotElement) return;

  const originalContent = Array.from(component.childNodes).filter(
    node => node !== slotElement.parentElement && !slotElement.contains(node)
  );

  originalContent.forEach(node => {
    slotElement.appendChild(node);
  });
}

export function processNamedSlots(component: HTMLElement): void {
  const slots = component.querySelectorAll('[data-slot]');

  const slottedElements = Array.from(component.children).filter(
    child => child.hasAttribute('slot') && !child.hasAttribute('data-slot')
  );

  slots.forEach(slot => {
    const slotName = slot.getAttribute('data-slot');

    const elementsForSlot = slottedElements.filter(
      el => el.getAttribute('slot') === slotName
    );

    elementsForSlot.forEach(el => {
      slot.appendChild(el);
    });
  });

  const defaultSlot =
    component.querySelector('[data-slot=""]') ||
    component.querySelector('[data-slot]:not([data-slot=""])') === null
      ? component.querySelector('[data-slot]')
      : null;

  if (defaultSlot) {
    const defaultElements = Array.from(component.children).filter(
      child => !child.hasAttribute('slot') && !child.hasAttribute('data-slot')
    );

    defaultElements.forEach(el => {
      defaultSlot.appendChild(el);
    });
  }
}

export function processTextSlot(
  component: HTMLElement,
  slotSelector: string = '[data-slot]'
): void {
  const slotElement = component.querySelector(slotSelector);
  if (!slotElement) return;

  const textContent = component.textContent?.trim() || '';

  Array.from(component.childNodes).forEach(node => {
    if (
      node.nodeType === Node.TEXT_NODE ||
      (node.nodeType === Node.ELEMENT_NODE &&
        !(node as Element).hasAttribute('data-template'))
    ) {
      if (!slotElement.contains(node)) {
        component.removeChild(node);
      }
    }
  });

  slotElement.textContent = textContent;
}

export function processSlots(
  component: HTMLElement,
  template: DocumentFragment
): void {
  const originalContent = Array.from(component.childNodes);

  component.innerHTML = '';
  component.appendChild(template.cloneNode(true));

  const hasNamedSlots = component.querySelector(
    '[data-slot]:not([data-slot=""])'
  );

  if (hasNamedSlots) {
    const tempContainer = document.createElement('div');
    originalContent.forEach(node =>
      tempContainer.appendChild(node.cloneNode(true))
    );
    component.appendChild(tempContainer);

    processNamedSlots(component);

    if (tempContainer.parentNode) {
      tempContainer.remove();
    }
  } else {
    const defaultSlot = component.querySelector('[data-slot]');
    if (defaultSlot && originalContent.length > 0) {
      originalContent.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          defaultSlot.appendChild(document.createTextNode(node.textContent));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          defaultSlot.appendChild(node.cloneNode(true));
        }
      });
    }
  }
}

export function updateSlotData(
  component: HTMLElement,
  data: Record<string, string | number | undefined | null>
): void {
  Object.entries(data).forEach(([key, value]) => {
    const slotElement = component.querySelector(`[data-slot="${key}"]`);
    if (!slotElement || value === undefined || value === null) return;

    if (slotElement.tagName === 'IMG') {
      const imgElement = slotElement as HTMLImageElement;
      imgElement.src = String(value);
      imgElement.alt = imgElement.alt || `${key} image`;
    } else {
      slotElement.textContent = String(value);
    }
  });
}
