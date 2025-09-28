export async function loadJson<T = unknown>(url: RequestInfo | URL): Promise<T> {
  const response = await fetch(url);
  return await response.json();
}
