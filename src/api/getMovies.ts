export interface Movie {
  id: number;
  title: string;
  thumbnail: string;
  background: string;
  icon: string;
  rank: number;
  description: string;
  genre: string[];
  likes: number;
}

export interface MoviesResponse {
  trending: Movie[];
}

export async function getTrendingMovies(): Promise<Movie[]> {
  try {
    const response = await fetch('/api/trending');

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    const data: MoviesResponse = await response.json();

    return data.trending;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw new Error('Failed to fetch trending movies');
  }
}
