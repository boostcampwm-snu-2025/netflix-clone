export interface SearchMovie {
  id: number;
  title: string;
  thumbnail: string;
  genre: string[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SearchResponse {
  results: SearchMovie[];
  query: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface MoviesResponse {
  movies: SearchMovie[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const API_BASE_URL = 'http://localhost:3000/api';

export async function searchMovies(
  signal: AbortSignal,
  query: string = '',
  page: number = 1,
  limit: number = 20
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (query) {
    params.append('q', query);
  }

  const response = await fetch(`${API_BASE_URL}/search?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return response.json();
}

export async function getMovies(
  signal: AbortSignal,
  page: number = 1,
  limit: number = 20
): Promise<MoviesResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/movies?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return response.json();
}

export async function getNextPage(
  currentResponse: SearchResponse | MoviesResponse,
  signal: AbortSignal,
  type: 'search' | 'movies' = 'movies',
  searchQuery?: string
): Promise<SearchResponse | MoviesResponse | null> {
  if (!currentResponse.hasNextPage) {
    return null;
  }

  const nextPage = currentResponse.currentPage + 1;

  if (type === 'search') {
    return searchMovies(
      signal,
      searchQuery || '',
      nextPage,
      currentResponse.itemsPerPage
    );
  } else {
    return getMovies(signal, nextPage, currentResponse.itemsPerPage);
  }
}
