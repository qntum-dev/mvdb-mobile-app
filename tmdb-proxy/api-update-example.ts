// Updated API service for React Native app
// Replace the content in your services/api.ts with this updated version

import { CombinedCredits, Movie, MovieDetails, Person, PersonDetails, Show, ShowDetails, Videos } from "@/interfaces/interfaces";
import Constants from 'expo-constants';

const env = Constants.expoConfig?.extra || {};

export const TMDB_CONFIG = {
  // Change this to your deployed Cloudflare Worker URL
  BASE_URL: env.PROXY_URL || "https://your-worker.your-subdomain.workers.dev/api/tmdb",
  MEDIA_URL: env.TMDB_MEDIA_URL || "https://image.tmdb.org",
  // No need for API_KEY anymore as it's handled by the proxy
  headers: {
    accept: "application/json",
    // Remove Authorization header as the proxy handles it
  },
};

// Debug logging
console.log("TMDB Proxy Config:", {
  BASE_URL: TMDB_CONFIG.BASE_URL,
  MEDIA_URL: TMDB_CONFIG.MEDIA_URL,
});

export const fetchMovies = async ({
  query,
}: {
  query: string;
}): Promise<Movie[]> => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  try {
    const url = `${TMDB_CONFIG.BASE_URL}/trending/movie/day`;
    console.log("Fetching trending movies from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      throw new Error(`Failed to fetch trending movies: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Trending movies fetched:", data.results?.length || 0);
    return data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};

export const fetchPopularPeople = async (): Promise<Person[]> => {
  try {
    const url = `${TMDB_CONFIG.BASE_URL}/person/popular`;
    console.log("Fetching popular people from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      throw new Error(`Failed to fetch popular people: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Popular people fetched:", data.results?.length || 0);
    return data.results;
  } catch (error) {
    console.error("Error fetching popular people:", error);
    throw error;
  }
};

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  try {
    const url = `${TMDB_CONFIG.BASE_URL}/movie/popular`;
    console.log("Fetching popular movies from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      throw new Error(`Failed to fetch popular movies: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Popular movies fetched:", data.results?.length || 0);
    return data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

export const fetchTrendingShows = async (): Promise<Show[]> => {
  try {
    const url = `${TMDB_CONFIG.BASE_URL}/trending/tv/day`;
    console.log("Fetching trending shows from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      throw new Error(`Failed to fetch trending shows: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Trending shows fetched:", data.results?.length || 0);
    return data.results;
  } catch (error) {
    console.error("Error fetching trending shows:", error);
    throw error;
  }
};

// Keep all your existing helper functions unchanged
export const getMoviePosterUrl = (posterPath: string): string => {
  if (!posterPath) return "https://placehold.co/440x660/1a1a1a/FFFFFF.png";
  return `${TMDB_CONFIG.MEDIA_URL}/t/p/w440_and_h660_face${posterPath}`;
};

export const getPersonProfileUrl = (profilePath: string): string => {
  if (!profilePath) return "https://placehold.co/276x350/1a1a1a/FFFFFF.png";
  return `${TMDB_CONFIG.MEDIA_URL}/t/p/w276_and_h350_face${profilePath}`;
};

export const getShowPosterUrl = (posterPath: string): string => {
  if (!posterPath) return "https://placehold.co/440x660/1a1a1a/FFFFFF.png";
  return `${TMDB_CONFIG.MEDIA_URL}/t/p/w440_and_h660_face${posterPath}`;
};

export const fetchShowDetails = async (
  showId: string
): Promise<ShowDetails> => {
  try {
    const url = `${TMDB_CONFIG.BASE_URL}/tv/${showId}`;
    console.log("Fetching show details from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      throw new Error(`Failed to fetch show details: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Show details fetched:", data.name);
    return data;
  } catch (error) {
    console.error("Error fetching show details:", error);
    throw error;
  }
};

export const fetchPersonDetails = async (
  personId: string
): Promise<PersonDetails> => {
  try {
    const url = `${TMDB_CONFIG.BASE_URL}/person/${personId}`;
    console.log("Fetching person details from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      throw new Error(`Failed to fetch person details: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Person details fetched:", data.name);
    return data;
  } catch (error) {
    console.error("Error fetching person details:", error);
    throw error;
  }
};

export const fetchPersonCredits = async (
  personId: string
): Promise<CombinedCredits> => {
  try {
    const url = `${TMDB_CONFIG.BASE_URL}/person/${personId}/combined_credits`;
    console.log("Fetching person credits from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      throw new Error(`Failed to fetch person credits: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Person credits fetched:", data.cast?.length || 0);
    return data;
  } catch (error) {
    console.error("Error fetching person credits:", error);
    throw error;
  }
};

export const fetchMovieVideos = async (
  movieId: string
): Promise<Videos> => {
  try {
    const url = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/videos`;
    console.log("Fetching movie videos from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      throw new Error(`Failed to fetch movie videos: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Movie videos fetched:", data.results?.length || 0);
    return data;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    throw error;
  }
};

export const fetchShowVideos = async (
  showId: string
): Promise<Videos> => {
  try {
    const url = `${TMDB_CONFIG.BASE_URL}/tv/${showId}/videos`;
    console.log("Fetching show videos from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      throw new Error(`Failed to fetch show videos: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Show videos fetched:", data.results?.length || 0);
    return data;
  } catch (error) {
    console.error("Error fetching show videos:", error);
    throw error;
  }
};