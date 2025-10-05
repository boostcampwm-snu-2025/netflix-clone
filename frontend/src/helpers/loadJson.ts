const baseUrl = {
  development: 'http://localhost:3001',
  production: '',
}[import.meta.env.MODE] || '';

export async function loadJson<T = unknown>(url: RequestInfo | URL): Promise<T> {
  const response = await fetch(baseUrl + url);
  return await response.json();
}
