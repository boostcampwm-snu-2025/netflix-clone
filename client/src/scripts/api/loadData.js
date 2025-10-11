export async function loadData() {
  try {
    const dataUrl = new URL('../../data.json', import.meta.url);
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}