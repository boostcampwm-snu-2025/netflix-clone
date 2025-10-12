export interface Title {
    id: number;
    name: string;
    type: "series" | "movie";
    image: string;
    desc?: string;
  }
  export interface SearchResponse {
    items: Title[];
    total: number;
  }
  
  const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3001";
  
  export async function searchTitles(q: string, signal?: AbortSignal): Promise<SearchResponse> {
    const url = new URL("/api/search", BASE);
    url.searchParams.set("q", q);
    const res = await fetch(url.toString(), { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
  