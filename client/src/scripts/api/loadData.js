export async function loadData() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/content/');
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

export async function loadSearchResults(params) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/content/search?${new URLSearchParams(params)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading search results:', error);
    throw error;
  }
}