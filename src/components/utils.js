export async function loadTemplate(path, baseUrl = import.meta.url) {
  const res = await fetch(new URL(path, baseUrl));
  const html = await res.text();

  const template = document.createElement('template');
  template.innerHTML = html.trim();

  return template;
}

export async function loadStyle(path, baseUrl = import.meta.url) {
  const res = await fetch(new URL(path, baseUrl));
  const css = await res.text();

  const style = document.createElement('style');
  style.textContent = css.trim();

  return style;
}
